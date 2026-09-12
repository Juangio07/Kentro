const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("kentro", {
    version: "1.0.0"
});