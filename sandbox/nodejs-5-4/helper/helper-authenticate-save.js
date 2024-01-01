"use strict";
import { OAuth2Client } from "google-auth-library";
// import { google } from "googleapis";
import http from "http";
import https from "https";
import { URL } from "url";
import opn from "open";

const authenticateAndTokenize = async (credentials, scopes) => {
  return new Promise((resolve, reject) => {
    // const { credentials } = options;
    // const scopes = options.scopes;
    const keys = credentials.installed || credentials.web;
    const redirectUriString = keys.redirect_uris;
    const redirectUri = new URL(redirectUriString);
    const client = new OAuth2Client({
      clientId: keys.client_id,
      clientSecret: keys.client_secret,
    });

    const handleRequest = async (req, res) => {
      try {
        const url = new URL(req.url, redirectUriString);
        if (url.pathname !== redirectUri.pathname) return res.end(`Please check google config for  redirect URL, there is a mismatch ${url.pathname} <> ${redirectUri.pathname}`);

        const code = url.searchParams.get('code');
        const { tokens } = await client.getToken({ code, redirect_uri: redirectUriString });
        client.credentials = tokens;

        // const apis = google.getSupportedAPIs();

        res.end('Authenticated and tokenized');

        // Resolve with an object containing both gdrive and tokens
        resolve({ client, tokens });

      } catch (e) {
        console.error(e);
        res.end('Error during authentication and/or tokenization');
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

export { authenticateAndTokenize };
