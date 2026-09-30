# Acceptance Criteria -- Version 1

## AC-1: Storefront Browsing

- [ ] Home page loads with featured products, category navigation, and hero section
- [ ] Catalog page displays all active products with image, title, price, and availability
- [ ] Products can be filtered by category, occasion, price range, and availability
- [ ] Products can be sorted by price (low to high, high to low) and newest
- [ ] Search returns relevant products matching title and description keywords
- [ ] Category and collection landing pages display filtered product sets
- [ ] All pages are responsive on mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Pages include SEO metadata and canonical URLs
- [ ] Loading skeletons display while data is fetching
- [ ] Empty states display appropriate messaging when no results match

## AC-2: Product Discovery

- [ ] Product detail page shows full description, included items, price, variants, MOQ, lead time, and delivery regions
- [ ] Product images load lazily and display with proper aspect ratio
- [ ] Related products or same-category products are suggested
- [ ] Breadcrumb navigation reflects the product's category hierarchy
- [ ] Draft and archived products are not visible on the storefront

## AC-3: Cart

- [ ] Products can be added to cart from catalog and product detail pages
- [ ] Cart persists across page navigation and browser refresh (localStorage)
- [ ] Cart displays product name, quantity, unit price, and indicative subtotal
- [ ] Quantity can be updated; items can be removed
- [ ] Cart clearly labels pricing as "indicative, subject to final quote"
- [ ] Cart shows INR currency formatting (e.g., "INR 1,25,000")
- [ ] Empty cart state directs users back to the catalog

## AC-4: Inquiry Submission

- [ ] Inquiry form captures: company name, contact name, phone, email, quantity, requested delivery date, delivery mode, addresses, personalization notes, budget range, WhatsApp consent
- [ ] Phone number is validated for Indian mobile format
- [ ] Required fields are enforced with inline validation errors
- [ ] Form submission is idempotent (duplicate submissions within a window produce the same inquiry)
- [ ] Confirmation page displays a non-sequential reference number
- [ ] WhatsApp continuation link opens WhatsApp with a prefilled message containing only the reference number
- [ ] Inquiry record is created in Firestore with all submitted data

## AC-5: Admin Authentication

- [ ] Admin login page at `/admin/login` uses Firebase Auth (email/password)
- [ ] Only users with admin claim or present in `adminUsers` collection can access admin routes
- [ ] Unauthenticated users are redirected to login
- [ ] Unauthorized authenticated users see an access-denied message
- [ ] Admin session persists across page refresh
- [ ] Logout clears the session and redirects to login

## AC-6: Product CRUD (Admin)

- [ ] Admin can create a new product with all catalog fields
- [ ] Admin can edit an existing product
- [ ] Admin can change product status: draft, active, archived
- [ ] Product form validates required fields (title, price, category, at least one image URL)
- [ ] Changes are reflected in the storefront after save (active products only)
- [ ] Product list in admin supports search and status filtering
- [ ] Category and collection CRUD is functional

## AC-7: Order Lifecycle (Admin)

- [ ] New inquiries appear in the admin dashboard
- [ ] Admin can view inquiry details and customer information
- [ ] Admin can advance an order through lifecycle states with valid transitions
- [ ] Invalid state transitions are rejected with an error message
- [ ] Each state change records an audit event (actor, timestamp, old state, new state, notes)
- [ ] Admin can add internal notes to an order
- [ ] Order list supports filtering by status, date range, and search

## AC-8: WhatsApp Fake Adapter

- [ ] A fake WhatsApp adapter is available for local development
- [ ] Fake adapter logs outbound messages to console and stores them in memory/Firestore
- [ ] Fake webhook endpoint accepts simulated inbound messages
- [ ] Template-based messages render with the correct variables
- [ ] Message status updates (sent, delivered, read) can be simulated
- [ ] No real WhatsApp API calls are made when the fake adapter is active
- [ ] Configuration switches between fake and real adapter via environment variable

## AC-9: Cross-Cutting

- [ ] All pages pass axe-core accessibility checks with no critical violations
- [ ] Keyboard navigation works for all interactive elements
- [ ] Color contrast meets WCAG 2.2 AA requirements
- [ ] 404 page is styled and provides navigation back to home
- [ ] Error boundaries catch and display user-friendly error messages
- [ ] No secrets are present in client-side bundles or source control
- [ ] Production build completes without errors
- [ ] All unit and integration tests pass
