// Self-check for the cart rules: `pnpm tsx src/lib/cart.check.ts`.
import assert from "node:assert/strict";

import { cartTotals, clampQuantity, MAX_LINES, parseCart, serializeCart } from "./cart";

assert.equal(parseCart(undefined).size, 0);
assert.equal(parseCart("not json").size, 0);
assert.equal(parseCart("[1,2]").size, 0);
assert.equal(parseCart("null").size, 0);
assert.deepEqual(
  [...parseCart('{"a":2,"b":-1,"c":1.5,"d":"3","e":0,"f":999}')],
  [
    ["a", 2],
    ["f", 10],
  ],
);
const many = Object.fromEntries(Array.from({ length: 80 }, (_, i) => [`p${i}`, 1]));
assert.equal(parseCart(JSON.stringify(many)).size, MAX_LINES);
assert.deepEqual(parseCart(serializeCart(new Map([["x", 3]]))), new Map([["x", 3]]));

assert.equal(clampQuantity(3, 0), 0);
assert.equal(clampQuantity(3, 3), 3);
assert.equal(clampQuantity(5, 3), 3);
assert.equal(clampQuantity(50, 100), 10);
assert.equal(clampQuantity(-2, 5), 0);

assert.deepEqual(
  cartTotals([
    { quantity: 2, unitPriceCents: 1850 },
    { quantity: 1, unitPriceCents: 4200 },
  ]),
  { subtotalCents: 7900, itemCount: 3 },
);
assert.deepEqual(cartTotals([]), { subtotalCents: 0, itemCount: 0 });

console.log("cart checks passed");
