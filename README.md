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

## Google pilot sync

The app can sync vehicle records and custom checks to the shared Google Sheet, and upload check photos to the shared Drive folder. Each staff member signs in with their own Google account. Google permissions on the Sheet and folder control who can read or edit the pilot. Sync uses an append-only event log in the `PartlandData` tab, so simultaneous updates to separate vehicles do not overwrite each other. If two people edit the same vehicle at once, the latest saved version wins.

Before sync can be enabled, finish the Google Cloud OAuth setup in [PILOT-SETUP.md](PILOT-SETUP.md) and add the OAuth Web client ID to `src/google-config.js`. That client ID is public in a browser app; do not put any client secret in this repository. A first connection to an empty Sheet asks whether to import this browser's locally saved records (which may include sample vehicles) or start with empty shared stock.

Until the OAuth client ID is configured, the app continues to save only in the current browser profile. Local records are not shared automatically. Photos are uploaded to the shared Drive folder after Google connection; local-only records and photos stay on their originating device.

## Hosting and Android

GitHub Pages deployment is configured in `.github/workflows/deploy.yml`; pushes to `main` deploy automatically. The responsive interface, web app manifest and service worker support installation from a compatible mobile browser over HTTPS. For Play Store distribution, this static app can be wrapped with Capacitor or a Trusted Web Activity.

