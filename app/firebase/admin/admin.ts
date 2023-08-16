import * as admin from 'firebase-admin';
import { App, applicationDefault, getApp, getApps } from 'firebase-admin/app';

const config = {
  credential: applicationDefault(),
  databaseURL:
    'https://fatran37-default-rtdb.europe-west1.firebasedatabase.app/',
};

let app: any;

if (!admin.apps.length)
  admin.initializeApp(config);

