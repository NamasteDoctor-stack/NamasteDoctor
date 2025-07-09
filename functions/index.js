/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Triggered when a session is deleted
exports.cleanupOnSessionDelete = functions.database
  .ref('/sessions/{sessionId}')
  .onDelete(async (snapshot, context) => {
    const sessionId = context.params.sessionId;
    const db = admin.database();
    // Remove related data
    await db.ref('conversations/' + sessionId).remove();
    await db.ref('typing/' + sessionId).remove();
    // You can add more cleanup here if needed
    console.log(`Cleaned up data for session: ${sessionId}`);
    return null;
  });
