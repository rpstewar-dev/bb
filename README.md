# thebreezeboys.com — embedded build

Every photo and both logos are embedded directly in the HTML as base64. There is
no photos/ folder to upload, so nothing can 404 from a missed folder.

## Upload these five files to the repo root

    index.html
    services.html
    about.html
    shop.html
    service-area-map.html

Optional: favicon.png (any square PNG) for the browser tab icon.

Vercel needs no configuration — it serves the root as a static site. Confirm
Vercel's "Root Directory" setting is blank/root and index.html sits beside it.

## Trade-off

These files are large (the photos live inside them), so browsers re-download the
images on every page instead of caching them once. Fine at this scale, and it
removes the folder-upload problem entirely.

If you'd rather have proper caching later, use the other build (separate photos/
folder) and upload it with git rather than the GitHub web uploader:

    git add . && git commit -m "site" && git push

## Before you go live

- Add the SC contractor license number (footers say "Licensed & insured", no number).
- Confirm the St. Jude 5% figure and referral terms on about.html.
- Shopify token in shop.html is public by design — read-only, safe to commit.
