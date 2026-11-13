import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { addToCart, type CartActionState } from "@/app/cart/actions";
import { AddToBagForm } from "./add-to-bag-form";

vi.mock("@/app/cart/actions", () => ({ addToCart: vi.fn() }));

const addToCartMock = vi.mocked(addToCart);

function renderForm(props: Partial<{ slug: string; stock: number; priceCents: number }> = {}) {
  return render(<AddToBagForm slug="sencha" stock={5} priceCents={1250} {...props} />);
}

describe("AddToBagForm", () => {
  beforeEach(() => addToCartMock.mockReset());

  it.each([
    { stock: 3, expected: 3 },
    { stock: 50, expected: 10 },
  ])("renders $expected quantity options when stock is $stock", ({ stock, expected }) => {
    renderForm({ stock });

    const select = screen.getByRole("combobox", { name: "Quantity" });
    const options = within(select).getAllByRole("option");

    expect(options).toHaveLength(expected);
    expect(options.map((o) => o.textContent)).toEqual(
      Array.from({ length: expected }, (_, i) => String(i + 1)),
    );
  });

  it("shows the formatted price on the button", () => {
    renderForm({ priceCents: 1250 });

    expect(screen.getByRole("button", { name: /add to bag/i })).toHaveTextContent("$12.50");
  });

  it("sends the form to the action and shows its message", async () => {
    addToCartMock.mockResolvedValue({ tone: "success", message: "Added to your bag. You have 2." });
    const user = userEvent.setup();
    renderForm();

    await user.selectOptions(screen.getByRole("combobox", { name: "Quantity" }), "2");
    await user.click(screen.getByRole("button", { name: /add to bag/i }));

    expect(await screen.findByRole("status")).toHaveTextContent("Added to your bag. You have 2.");
    expect(addToCartMock).toHaveBeenCalledTimes(1);
    expect(addToCartMock).toHaveBeenCalledWith(null, expect.any(FormData));

    const formData = addToCartMock.mock.calls[0][1];
    expect(formData.get("slug")).toBe("sencha");
    expect(formData.get("quantity")).toBe("2");
  });

  it("shows an error message as an alert", async () => {
    addToCartMock.mockResolvedValue({ tone: "error", message: "Sold out." });
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /add to bag/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Sold out.");
  });

  it("disables the button and says 'Adding…' while the action is pending", async () => {
    const { promise, resolve } = Promise.withResolvers<CartActionState>();
    addToCartMock.mockReturnValue(promise);
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /add to bag/i }));

    const pendingButton = await screen.findByRole("button", { name: "Adding…" });
    expect(pendingButton).toBeDisabled();
    expect(pendingButton).toHaveAttribute("aria-busy", "true");

    resolve({ tone: "success", message: "Added to your bag. You have 1." });

    expect(await screen.findByText("Added to your bag. You have 1.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add to bag/i })).toBeEnabled();
  });
});
