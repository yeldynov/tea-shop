// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { releaseOrder, syncOrderFromCheckoutSession } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";
import { POST } from "./route";

vi.mock("@/lib/stripe", () => ({ getStripe: vi.fn() }));
vi.mock("@/lib/orders", () => ({ releaseOrder: vi.fn(), syncOrderFromCheckoutSession: vi.fn() }));

let constructEvent: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetAllMocks();
  constructEvent = vi.fn();
  vi.mocked(getStripe).mockReturnValue({ webhooks: { constructEvent } } as never);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

/** What Stripe would hand us after a valid signature check. */
function event(type: string, object: Record<string, unknown>) {
  constructEvent.mockReturnValue({ type, data: { object } });
}

function post(headers: Record<string, string> = {}) {
  return POST(
    new Request("http://localhost/api/stripe/webhook", { method: "POST", body: "{}", headers }),
  );
}

describe("POST /api/stripe/webhook", () => {
  describe("signature", () => {
    it("rejects a bad signature with 400 and touches no orders", async () => {
      constructEvent.mockImplementation(() => {
        throw new Error("No signatures found matching the expected signature");
      });

      const res = await post();

      expect(res.status).toBe(400);
      expect(await res.text()).toBe("Invalid signature");
      expect(syncOrderFromCheckoutSession).not.toHaveBeenCalled();
      expect(releaseOrder).not.toHaveBeenCalled();
    });

    it("verifies the raw body with the signature header and the webhook secret", async () => {
      vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
      event("customer.created", {});

      await post({ "stripe-signature": "t=1,v1=abc" });

      expect(constructEvent).toHaveBeenCalledWith("{}", "t=1,v1=abc", "whsec_test");
    });
  });

  describe("payment succeeded", () => {
    it.each(["checkout.session.completed", "checkout.session.async_payment_succeeded"])(
      "%s syncs the order from the session",
      async (type) => {
        event(type, { id: "cs_test_123" });

        const res = await post();

        expect(res.status).toBe(200);
        expect(syncOrderFromCheckoutSession).toHaveBeenCalledExactlyOnceWith("cs_test_123");
        expect(releaseOrder).not.toHaveBeenCalled();
      },
    );
  });

  describe("payment did not happen", () => {
    it.each([
      ["checkout.session.expired", "expired"],
      ["checkout.session.async_payment_failed", "failed"],
    ])("%s releases the order as %s", async (type, status) => {
      event(type, { id: "cs_test_123", metadata: { orderId: "order_1" } });

      const res = await post();

      expect(res.status).toBe(200);
      expect(releaseOrder).toHaveBeenCalledExactlyOnceWith("order_1", status);
      expect(syncOrderFromCheckoutSession).not.toHaveBeenCalled();
    });

    it.each([
      ["no metadata", {}],
      ["metadata without orderId", { metadata: {} }],
    ])("ignores an expired session with %s", async (_, extra) => {
      event("checkout.session.expired", { id: "cs_test_123", ...extra });

      const res = await post();

      expect(res.status).toBe(200);
      expect(releaseOrder).not.toHaveBeenCalled();
    });
  });

  it("acknowledges an unrelated event without doing anything", async () => {
    event("customer.created", { id: "cus_123" });

    const res = await post();

    expect(res.status).toBe(200);
    expect(syncOrderFromCheckoutSession).not.toHaveBeenCalled();
    expect(releaseOrder).not.toHaveBeenCalled();
  });

  describe("failures reach Stripe so it retries", () => {
    it("lets a sync error escape instead of answering 200", async () => {
      event("checkout.session.completed", { id: "cs_test_123" });
      vi.mocked(syncOrderFromCheckoutSession).mockRejectedValue(new Error("Stripe API down"));

      await expect(post()).rejects.toThrow("Stripe API down");
    });

    it("lets a release error escape instead of answering 200", async () => {
      event("checkout.session.expired", { id: "cs_test_123", metadata: { orderId: "order_1" } });
      vi.mocked(releaseOrder).mockRejectedValue(new Error("DB timeout"));

      await expect(post()).rejects.toThrow("DB timeout");
    });
  });
});
