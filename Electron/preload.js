"use strict";
const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("fixelar", { appVersion: "1.0.0" });
