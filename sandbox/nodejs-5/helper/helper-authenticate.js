"use strict";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import http from "http";
import https from "https";
import { URL } from "url";
import opn from "open";

// let gdrive; // Global variable to hold the Google Drive client

const authenticate = async (options) => {
  return new Promise((resolve, reject) => {
    const { keyFileData } = options;
    const scopes = options.scopes;
    const keys = keyFileData.installed || keyFileData.web;
    const redirectUriString = keys.redirect_uris;
    const redirectUri = new URL(redirectUriString);
    const client = new OAuth2Client({
      clientId: keys.client_id,
      clientSecret: keys.client_secret,
    });

    const handleRequest = async (req, res) => {
      try {
        const url = new URL(req.url, redirectUriString);
        if (url.pathname !== redirectUri.pathname) return res.end('Invalid callback URL');

        const code = url.searchParams.get('code');
        const { tokens } = await client.getToken({ code, redirect_uri: redirectUriString });
        client.credentials = tokens;

        // Initialize Google Drive client
        const gdrive = google.drive({
          version: 'v3',
          auth: client,
        });

        res.end('Authentication successful! Drive initialized.');
        resolve(gdrive);
      } catch (e) {
        console.error(e);
        res.end('Error during authentication.');
        reject(e);
      } finally {
        server.close();
      }
    };

    const server = redirectUri.protocol === 'https:' ?
      https.createServer(handleRequest) : http.createServer(handleRequest);

    const listenPort = redirectUri.port || (redirectUri.protocol === 'https:' ? 443 : 80);

    server.listen(listenPort, redirectUri.hostname, () => {
      const authorizeUrl = client.generateAuthUrl({
        redirect_uri: redirectUri.toString(),
        access_type: 'offline',
        scope: scopes.join(' ')
      });
      opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
    });
  });
};

export { authenticate };
