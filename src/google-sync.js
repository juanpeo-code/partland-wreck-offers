import { GOOGLE_CONFIG } from './google-config.js';

const SHEET_HEADERS = ['eventId', 'type', 'updatedAt', 'email', 'payload'];
const GOOGLE_SCOPES = [
  'openid', 'email',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
].join(' ');

export class GooglePilotSync {
  constructor(onStatus = () => {}) {
    this.config = GOOGLE_CONFIG;
    this.onStatus = onStatus;
    this.token = '';
    this.email = '';
    this.tokenClient = null;
    this.photoUrls = new Map();
  }

  get ready() {
    return Boolean(this.config.clientId && this.config.spreadsheetId && this.config.driveFolderId);
  }

  get connected() { return Boolean(this.token); }
  get photoCache() { return this.photoUrls; }

  async connect() {
    if (!this.config.clientId) throw new Error('Google OAuth setup is not finished. Follow PILOT-SETUP.md and add the Web client ID.');
    if (!window.google?.accounts?.oauth2) throw new Error('Google sign-in could not load. Check the internet connection and reload.');
    this.onStatus('signing-in');
    return new Promise((resolve, reject) => {
      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.config.clientId,
        scope: GOOGLE_SCOPES,
        callback: async response => {
          if (response.error || !response.access_token) {
            this.token = '';
            this.onStatus('error');
            reject(new Error(response.error_description || response.error || 'Google authorization was not completed.'));
            return;
          }
          this.token = response.access_token;
          try {
            const profile = await this.request('https://www.googleapis.com/oauth2/v3/userinfo');
            this.email = profile.email || '';
            await this.ensureSheet();
            this.onStatus('connected');
            resolve({ email: this.email, events: await this.readEvents() });
          } catch (error) {
            this.token = '';
            this.onStatus('error');
            reject(error);
          }
        },
        error_callback: error => {
          this.token = '';
          this.onStatus('error');
          reject(new Error(error.message || 'Google sign-in was closed before it finished.'));
        }
      });
      this.tokenClient.requestAccessToken({ prompt: 'select_account' });
    });
  }

  async request(url, options = {}) {
    if (!this.token) throw new Error('Connect to Google again to continue syncing.');
    const response = await fetch(url, {
      ...options,
      headers: { Authorization: `Bearer ${this.token}`, ...(options.headers || {}) }
    });
    if (!response.ok) {
      let detail = `${response.status} ${response.statusText}`;
      try { detail = (await response.json()).error?.message || detail; } catch {}
      if (response.status === 401) {
        this.token = '';
        this.onStatus('expired');
      }
      throw new Error(detail);
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async ensureSheet() {
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}?fields=sheets.properties.title`;
    const book = await this.request(endpoint);
    const hasTab = (book.sheets || []).some(sheet => sheet.properties?.title === this.config.sheetTab);
    if (!hasTab) {
      await this.request(`https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}:batchUpdate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: [{ addSheet: { properties: { title: this.config.sheetTab } } }] })
      });
    }
    const range = `${encodeURIComponent(this.config.sheetTab)}!A1:E1`;
    const values = await this.request(`https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/${range}`);
    if (!values.values?.length) await this.appendRows([SHEET_HEADERS]);
  }

  async readEvents() {
    const range = `${encodeURIComponent(this.config.sheetTab)}!A2:E`;
    const result = await this.request(`https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/${range}`);
    return (result.values || []).filter(row => row[1] && row[4]).map((row, index) => {
      try {
        return { eventId: row[0] || `legacy-${index}`, type: row[1], updatedAt: row[2] || '', email: row[3] || '', payload: JSON.parse(row[4]), rowIndex: index };
      } catch { return null; }
    }).filter(Boolean);
  }

  async appendRows(rows) {
    if (!rows.length) return;
    const range = `${encodeURIComponent(this.config.sheetTab)}!A:E`;
    await this.request(`https://sheets.googleapis.com/v4/spreadsheets/${this.config.spreadsheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ majorDimension: 'ROWS', values: rows })
    });
  }

  async appendEvent(event) {
    await this.appendRows([[event.eventId, event.type, event.updatedAt, this.email, JSON.stringify(event.payload)]]);
  }

  async uploadPhoto(dataUrl, vehicleId, photoKey, checkKey = '') {
    const blob = await (await fetch(dataUrl)).blob();
    const metadata = {
      name: `Partland-${vehicleId}-${photoKey}.jpg`,
      mimeType: blob.type || 'image/jpeg',
      parents: [this.config.driveFolderId],
      description: `Partland vehicle check evidence${checkKey ? `: ${checkKey}` : ''}`
    };
    const boundary = `partland_${crypto.randomUUID().replaceAll('-', '')}`;
    const body = new Blob([
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n--${boundary}\r\nContent-Type: ${metadata.mimeType}\r\n\r\n`,
      blob,
      `\r\n--${boundary}--`
    ], { type: `multipart/related; boundary=${boundary}` });
    const file = await this.request('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType', {
      method: 'POST', headers: { 'Content-Type': `multipart/related; boundary=${boundary}` }, body
    });
    const url = URL.createObjectURL(blob);
    this.photoUrls.set(file.id, url);
    return file.id;
  }

  async loadPhoto(fileId) {
    if (this.photoUrls.has(fileId) || !this.token) return;
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`, {
      headers: { Authorization: `Bearer ${this.token}` }
    });
    if (!response.ok) throw new Error('A saved Drive photo could not be loaded. Check folder access.');
    this.photoUrls.set(fileId, URL.createObjectURL(await response.blob()));
  }
}

