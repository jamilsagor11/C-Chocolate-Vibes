# Security Spec for Chocolate Vibes

## Data Invariants
1. Products can only be created/updated/deleted by Admins.
2. Products can be read by anyone (at least listed/get).
3. Orders can be created by anyone (authenticated or anonymous depending on app logic, here we allow anyone to submit an order).
4. Orders can only be read/listed/updated by Admins.
5. Users shouldn't be able to list all orders unless they are admins. (In this demo, orders are only accessed by admins).

## The Dirty Dozen Payloads
1. Create a product as a non-admin. (DENIED)
2. Update a product's price as a non-admin. (DENIED)
3. Delete a product as a non-admin. (DENIED)
4. List all orders as a non-admin. (DENIED)
5. Update an order's status as a non-admin. (DENIED)
6. Read a specific order as a non-admin. (DENIED)
7. Create an order with a massive totalAmount (integrity violation - though hard to block without server-side validation of prices, we can check basic types). (VALIDATED)
8. Create an order with status 'delivered' initially. (DENIED if we enforce 'pending')
9. Inject extra fields into a product document. (DENIED via hasOnly)
10. Update a product and change its immutable createdAt field. (DENIED)
11. List products without a query (should be allowed). (ALLOWED)
12. Delete an order as a non-admin. (DENIED)

## Test Runner (Conceptual)
All tests should verify that unauthorized writes/reads fail.
