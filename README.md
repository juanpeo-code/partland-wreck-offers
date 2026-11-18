# Partland Vehicle Check-in

A mobile-friendly intake app for vehicles Partland has already purchased and received. Record vehicle identity and supplier, capture arrival photos, complete receipt checks and enter the assigned stock number.

## Live app

[Open Partland Vehicle Check-in](https://juanpeo-code.github.io/partland-wreck-offers/)

## Receipt checks

- Vehicle matches the received record
- Registration matches paperwork
- VIN / chassis number verified
- Keys received and recorded
- Original papers / NATIS checked
- Condition and visible damage recorded
- Arrival photos captured

Once all seven checks are complete and the stock number is entered, the vehicle is marked checked into current stock.

## Local run

Requires Node.js 20 or newer. Run `npm start`, then open http://localhost:4173. No package install is needed.

## Prototype data

The sample records are illustrative. Vehicle records and photos are stored in the current browser profile using `localStorage`; they are not shared or synced between staff or devices. This app is an intake log and does not connect to the existing stock system. Use a shared authenticated API and an integration with the stock system before relying on it for live inventory data.

## Hosting and Android

GitHub Pages deployment is configured in `.github/workflows/deploy.yml`; pushes to `main` deploy automatically. The responsive interface, web app manifest and service worker support installation from a compatible mobile browser over HTTPS. For Play Store distribution, this static app can be wrapped with Capacitor or a Trusted Web Activity.
