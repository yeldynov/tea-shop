// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { site } from "@/lib/site";
import { notifyOwner, sendEmailJs } from "./emailjs";

const SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

type SentBody = { accessToken?: string; template_params: Record<string, string> };
let sentBody: SentBody | undefined;

const server = setupServer(
  http.post(SEND_URL, async ({ request }) => {
    sentBody = (await request.json()) as SentBody;
    return new HttpResponse("OK");
  }),
);

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));
beforeEach(() => {
  sentBody = undefined;
});
afterEach(() => {
  server.resetHandlers();
  vi.unstubAllEnvs();
});
afterAll(() => server.close());

const params = {
  name: "Mei",
  email: "mei@example.com",
  topic: "Order question",
  order: "#1042",
  message: "Where is my dian hong?",
};

function failWith(status: number, text = "boom") {
  server.use(http.post(SEND_URL, () => new HttpResponse(text, { status })));
}

describe("sendEmailJs", () => {
  it("posts the template params and fills in the site name", async () => {
    await sendEmailJs(params);

    expect(sentBody?.template_params).toEqual({ site: site.name, ...params });
  });

  it("sends the access token only when one is given", async () => {
    await sendEmailJs(params, "private_key");
    expect(sentBody).toHaveProperty("accessToken", "private_key");

    await sendEmailJs(params);
    expect(sentBody).not.toHaveProperty("accessToken");
  });

  it("throws with the status and body when EmailJS refuses", async () => {
    failWith(500, "Internal error");

    await expect(sendEmailJs(params)).rejects.toThrow("EmailJS 500: Internal error");
  });
});

describe("notifyOwner", () => {
  it("describes a new registration, using the email as the name by default", async () => {
    await notifyOwner("New registration", "mei@example.com");

    expect(sentBody?.template_params).toMatchObject({
      site: expect.any(String),
      topic: "New registration",
      email: "mei@example.com",
      name: "mei@example.com",
      message: "mei@example.com just created an account.",
    });
  });

  it("describes a new subscriber and keeps a given name", async () => {
    await notifyOwner("New subscriber", "mei@example.com", "Mei");

    expect(sentBody?.template_params).toMatchObject({
      topic: "New subscriber",
      name: "Mei",
      message: expect.stringContaining("subscribed to the newsletter"),
    });
  });

  it("passes EMAILJS_PRIVATE_KEY as the access token", async () => {
    vi.stubEnv("EMAILJS_PRIVATE_KEY", "server_secret");

    await notifyOwner("New subscriber", "mei@example.com");

    expect(sentBody?.accessToken).toBe("server_secret");
  });

  describe("never throws", () => {
    let consoleError: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("logs and swallows an EmailJS error response", async () => {
      failWith(500);

      await expect(notifyOwner("New registration", "mei@example.com")).resolves.toBeUndefined();
      expect(consoleError).toHaveBeenCalledWith(
        "Owner notification failed",
        expect.objectContaining({ message: expect.stringContaining("500") }),
      );
    });

    it("logs and swallows a network failure", async () => {
      server.use(http.post(SEND_URL, () => HttpResponse.error()));

      await expect(notifyOwner("New registration", "mei@example.com")).resolves.toBeUndefined();
      expect(consoleError).toHaveBeenCalledWith("Owner notification failed", expect.any(TypeError));
    });
  });
});
