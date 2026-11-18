# Partland Vehicle Check-in

A mobile-friendly intake app for vehicles Partland has already purchased and received. Record vehicle identity and supplier, complete receipt checks, attach photos to individual checklist items and enter the assigned stock number.

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
- Battery present and condition checked
- Headlamps and tail lamps checked
- Bumpers and exterior panels inspected
- Windscreen, windows and mirrors checked
- Tyres and wheels checked

Yard staff can add reusable checks from a vehicle record. A newly added check appears on every vehicle and starts unchecked. Open any vehicle for a full-page check sheet. Add evidence photos beside a particular check (for example, battery, headlamps or NATIS papers), then tap a thumbnail to view it larger or move through the photo set.

Once every check is complete and the stock number is entered, the vehicle is marked checked into current stock.

## Local run

Requires Node.js 20 or newer. Run `npm start`, then open http://localhost:4173. No package install is needed.

## Prototype data

The sample records are illustrative. Vehicle records and photos are stored in the current browser profile using `localStorage`; they are not shared or synced between staff or devices. This app is an intake log and does not connect to the existing stock system. Use a shared authenticated API and an integration with the stock system before relying on it for live inventory data.

## Hosting and Android

GitHub Pages deployment is configured in `.github/workflows/deploy.yml`; pushes to `main` deploy automatically. The responsive interface, web app manifest and service worker support installation from a compatible mobile browser over HTTPS. For Play Store distribution, this static app can be wrapped with Capacitor or a Trusted Web Activity.

