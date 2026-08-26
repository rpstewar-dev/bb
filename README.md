# thebreezeboys.com — static build

Plain HTML. No build step, no dependencies to install. Upload the whole folder.

## Files

    index.html              Home
    services.html           All four services (#interior #additions #outdoor #hurricane)
    about.html              About / team / values
    shop.html               Merch, via Shopify Buy Button
    service-area-map.html   Leaflet map, embedded in index.html by <iframe>
    photos/                 Project + team photos
    logo-mark.png           Navy logo (light backgrounds)
    logo-mark-cream.png     Cream logo (dark backgrounds)

## Deploying

**GitHub Pages** — push to a repo, then Settings → Pages → deploy from branch, root.
Works as-is; no Jekyll config needed.

**Any host** — drop the folder in the web root.

## Third-party pieces

- Booking: Jotform form 232505326485153 (every "Book an estimate" button).
- Shop: Shopify Buy Button SDK, store `n1e7zq-nq.myshopify.com`. The storefront
  access token in shop.html is public by design — it is read-only.
- Map: Leaflet 1.9.4 + OpenStreetMap tiles, both loaded from unpkg with SRI hashes.
  The OSM attribution in the corner is a license requirement; leave it.

## Before you go live

- Add the SC contractor license number (footers currently say "Licensed & insured"
  with no number).
- Confirm the St. Jude 5% figure and the referral program terms on about.html.
- Set up a Google Business Profile and keep the name, phone and address identical
  to what's in the JSON-LD block at the bottom of index.html.
