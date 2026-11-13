import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LOW_STOCK_THRESHOLD, type Product } from "@/lib/catalog";
import { StockStatus } from "./stock-status";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return { stock: LOW_STOCK_THRESHOLD + 1, ...overrides } as Product;
}

describe("StockStatus", () => {
  it("shows 'In stock' when plenty is left", () => {
    render(<StockStatus product={makeProduct()} />);
    expect(screen.getByText("In stock")).toBeInTheDocument();
  });

  it("shows how many are left when stock is low", () => {
    render(<StockStatus product={makeProduct({ stock: LOW_STOCK_THRESHOLD })} />);
    expect(screen.getByText(`Only ${LOW_STOCK_THRESHOLD} left`)).toBeInTheDocument();
  });

  it("shows 'Sold out, Back in March'", () => {
    render(<StockStatus product={makeProduct({ stock: 0, restock: "Back in March" })} />);
    expect(screen.getByText("Sold out")).toBeInTheDocument();
    expect(screen.getByText(/Back in March/)).toBeInTheDocument();
  });

  it("promises shipping when detailed and in stock", () => {
    render(<StockStatus product={makeProduct()} detailed />);
    expect(screen.getByText(/Ships within 2 working days/)).toBeInTheDocument();
  });

  it("does not promise shipping without detailed", () => {
    render(<StockStatus product={makeProduct()} />);
    expect(screen.queryByText(/Ships within/)).not.toBeInTheDocument();
  });

  it("does not promise shipping for a sold-out product", () => {
    render(<StockStatus product={makeProduct({ stock: 0, restock: "Back in March" })} detailed />);
    expect(screen.queryByText(/Ships within/)).not.toBeInTheDocument();
  });
});
