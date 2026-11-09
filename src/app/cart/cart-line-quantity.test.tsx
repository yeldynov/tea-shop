import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { updateCartItem, type CartActionState } from "@/app/cart/actions";
import { CartLineQuantity } from "./cart-line-quantity";

vi.mock("@/app/cart/actions", () => ({ updateCartItem: vi.fn() }));

const updateCartItemMock = vi.mocked(updateCartItem);

type Props = { slug: string; name: string; quantity: number; stock: number };
const defaults: Props = { slug: "sencha", name: "Sencha", quantity: 2, stock: 5 };

function renderLine(props: Partial<Props> = {}) {
  return render(<CartLineQuantity {...defaults} {...props} />);
}

function getSelect() {
  return screen.getByRole("combobox", { name: "Quantity of Sencha" });
}

describe("CartLineQuantity", () => {
  beforeEach(() => updateCartItemMock.mockReset());

  it.each([
    { stock: 3, expected: 3 },
    { stock: 50, expected: 10 },
  ])("renders $expected options when stock is $stock", ({ stock, expected }) => {
    renderLine({ stock });

    expect(within(getSelect()).getAllByRole("option")).toHaveLength(expected);
  });

  it("starts on the current quantity", () => {
    renderLine({ quantity: 2 });

    expect(getSelect()).toHaveValue("2");
  });

  it("submits on change, without a button", async () => {
    updateCartItemMock.mockResolvedValue(null);
    const user = userEvent.setup();
    renderLine();

    await user.selectOptions(getSelect(), "4");

    await waitFor(() => expect(updateCartItemMock).toHaveBeenCalledTimes(1));
    const formData = updateCartItemMock.mock.calls[0][1];
    expect(formData.get("slug")).toBe("sencha");
    expect(formData.get("quantity")).toBe("4");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows the server's message as an alert", async () => {
    updateCartItemMock.mockResolvedValue({
      tone: "error",
      message: "Only 3 available, so your bag now has 3.",
    });
    const user = userEvent.setup();
    renderLine();

    await user.selectOptions(getSelect(), "5");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Only 3 available, so your bag now has 3.",
    );
  });

  it("disables the select while saving", async () => {
    const { promise, resolve } = Promise.withResolvers<CartActionState>();
    updateCartItemMock.mockReturnValue(promise);
    const user = userEvent.setup();
    renderLine();

    await user.selectOptions(getSelect(), "3");
    await waitFor(() => expect(getSelect()).toBeDisabled());

    resolve(null);

    await waitFor(() => expect(getSelect()).toBeEnabled());
  });

  it("follows a new quantity from the server", () => {
    const { rerender } = renderLine({ quantity: 2 });

    rerender(<CartLineQuantity {...defaults} quantity={3} />);

    expect(getSelect()).toHaveValue("3");
  });
});
