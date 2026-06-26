// Restored from ref/webview/assets/app-identity-CAX6mMBt.js

import { z } from "zod";

export const APP_NAME = "codex";

export const appIdentitySchema = z.string();

export const appIdentity = appIdentitySchema.parse(APP_NAME);
