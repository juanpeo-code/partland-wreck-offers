# Partland Wreck Offers

A responsive, local-first web app for Partland Auto Parts. Keep every vehicle offer, seller answer, photo, manual offer and callback together through the arrival check.

## Live app

[Open Partland Wreck Offers](https://juanpeo-code.github.io/partland-wreck-offers/)

## Local run

Requires Node.js 20 or newer. Run `npm start`, then open http://localhost:4173. No package install is needed.

## Prototype data

The sample records are illustrative. Offers and photos are stored in the current browser profile using `localStorage`; they are not shared or synced between staff or devices. Clear this site's data to reset to the illustrative records. Connect an authenticated shared API before using it for live business records.

## Hosting and updates

GitHub Pages deployment is configured in `.github/workflows/deploy.yml`. Once GitHub Pages is enabled with the **GitHub Actions** publishing source, pushes to `main` deploy automatically.

## Android path

The responsive interface, web app manifest and service worker support installation from a compatible mobile browser over HTTPS. For Play Store distribution, the app can be wrapped with Capacitor or a Trusted Web Activity. The data adapter currently uses browser storage and should be replaced with a shared API for team use.
