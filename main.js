const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

function crearVentana() {

    const ventana = new BrowserWindow({

        width: 1200,
        height: 800,

        minWidth: 900,
        minHeight: 650,

        autoHideMenuBar: true,

        // ICONO DE KENTRO
        icon: path.join(
            __dirname,
            "Assets",
            "Iconos",
            "App.png"
        ),

        webPreferences: {

            preload: path.join(
                __dirname,
                "preload.js"
            ),

            contextIsolation: true,

            nodeIntegration: false
        }

    });

    ventana.loadFile(
        path.join(
            __dirname,
            "Pages",
            "Acceso",
            "Acceso.html"
        )
    );

}

app.whenReady().then(() => {

    Menu.setApplicationMenu(null);

    crearVentana();

});

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});
