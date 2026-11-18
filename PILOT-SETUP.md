# Partland Google pilot setup

The app uses the Sheet and Drive folder below as shared storage. Each staff member authorizes the app with their own Google account. The app does not receive passwords or store access tokens between browser sessions. Google file permissions control who can read or edit pilot data.

## Google resources

- Owner account: `partland.spares@gmail.com`
- Initial staff account: `francois.burden@gmail.com`
- Sheet ID: `1FAr77gLapvZr18th17TEJ7mhKCvGN32YrzPouWfh9_U`
- Drive folder ID: `1I2TPYw4VAPZ1D_sMORrG-6lGDtXRBsEo`

Share the Sheet and folder with each approved staff account as an editor. For future staff, share both resources with their Gmail account. Keep the OAuth app in Testing while the pilot is small, and add each approved user as a test user in Google Cloud as well. Google currently limits an external Testing app to 100 test users, and user authorizations expire after seven days; staff may need to authorize again weekly. Google may also show an unverified-app warning during the pilot.

## Create the OAuth Web client

1. Sign in to Google Cloud Console as `partland.spares@gmail.com` and create a project named **Partland Vehicle Check-in Pilot**.
2. Enable **Google Sheets API** and **Google Drive API** for that project.
3. Configure the OAuth consent screen for **External** users. Add the app name **Partland Vehicle Check-in**, the owner email, and the staff email. Leave the app in **Testing** during the trial.
4. Create an OAuth 2.0 client ID with application type **Web application**.
5. Add this **Authorized JavaScript origin** exactly:

   `https://juanpeo-code.github.io`

   Do not add the repository path. The OAuth client ID is safe to publish in browser code. Never publish a client secret.

6. Copy the Web client ID (it ends in `apps.googleusercontent.com`) and send that ID to the app maintainer. It is public browser configuration; never send a client secret.
7. The maintainer adds the ID to `src/google-config.js` and deploys the updated app to GitHub Pages. Each staff member then opens the app and selects **Connect Google**, using the same Gmail account that was granted access to the Sheet and Drive folder.

The app creates a `PartlandData` tab and its header row the first time an authorized staff member connects. Keep this tab for app data; the Sheet can still be opened directly to review the event log.

## Adding staff later

Share the Sheet and Drive folder with the new staff member's Gmail address, then add that address under **OAuth consent screen → Audience → Test users** while the OAuth app remains in Testing. They can then open the app, choose **Connect Google**, and authorize access. No app code change is needed.

## First connection and records

If the shared Sheet has no vehicle records, the app asks whether to import the current browser's saved vehicles. The prototype may contain sample records, so review that prompt carefully. Choose **Cancel** to start with empty shared stock. Once connected, vehicle/check saves are queued locally if the network is temporarily unavailable and sent on the next sync. Use **Sync now** to load changes saved by other staff.

The Sheet is a version log: each vehicle save adds one row rather than replacing an existing row. Drive stores the image files. The app has no server-side employee directory, so access is controlled by Google sharing and the OAuth test-user list during the pilot.

