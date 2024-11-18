import * as functions from "firebase-functions/v1";
import { UserRecord } from "firebase-admin/auth";

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

export const createUserDocument = functions.auth.user().onCreate((user: UserRecord) => {
    db.collection("users")
    .doc(user.uid)
    .set(JSON.parse(JSON.stringify(user)));
});