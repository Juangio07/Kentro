/* ============================================================
   KENTRO
   PERSONALIZACIÓN
   ============================================================ */


/* ============================================================
   CONFIGURACIÓN BASE
   ============================================================ */

const STORAGE_KEY =
    "kentro_configuracion_empresa_v1";


const TEMA_KENTRO = {

    nombre: "kentro",

    primary: "#65D20B",

    hover: "#54B90A",

    light: "#8BEA16",

    soft: "#EAFBDA"

};


/* ============================================================
   ELEMENTOS - INFORMACIÓN EMPRESA
   ============================================================ */

const idEmpresa =
    document.getElementById("idEmpresa");

const nit =
    document.getElementById("nit");

const nombrePropietario =
    document.getElementById("nombrePropietario");

const nombreEmpresa =
    document.getElementById("nombreEmpresa");

const telefono =
    document.getElementById("telefono");

const correo =
    document.getElementById("correo");

const direccion =
    document.getElementById("direccion");

const lema =
    document.getElementById("lema");


/* ============================================================
   ELEMENTOS - LOGO
   ============================================================ */

const inputLogo =
    document.getElementById("inputLogo");

const btnSeleccionarLogo =
    document.getElementById("btnSeleccionarLogo");

const btnEliminarLogo =
    document.getElementById("btnEliminarLogo");

const logoPlaceholder =
    document.getElementById("logoPlaceholder");

const previewLogoImage =
    document.getElementById("previewLogoImage");


/* ============================================================
   ELEMENTOS - PALETAS
   ============================================================ */

const paletteOptions =
    document.querySelectorAll(".palette-option");

const colorPersonalizado =
    document.getElementById("colorPersonalizado");

const colorHex =
    document.getElementById("colorHex");

const colorPreviewBox =
    document.getElementById("colorPreviewBox");

const btnAplicarColor =
    document.getElementById("btnAplicarColor");


/* ============================================================
   ELEMENTOS - VISTA PREVIA
   ============================================================ */

const previewCompanyName =
    document.getElementById("previewCompanyName");

const previewCompanyInitial =
    document.getElementById("previewCompanyInitial");

const previewCompanyImage =
    document.getElementById("previewCompanyImage");

const previewBusinessLema =
    document.getElementById("previewBusinessLema");


/* ============================================================
   BOTONES
   ============================================================ */

const btnGuardar =
    document.getElementById("btnGuardar");

const btnGuardarFooter =
    document.getElementById("btnGuardarFooter");

const btnRestaurar =
    document.getElementById("btnRestaurar");

const btnRestaurarFooter =
    document.getElementById("btnRestaurarFooter");

const btnVolver =
    document.getElementById("btnVolver");


/* ============================================================
   TOAST
   ============================================================ */

const toast =
    document.getElementById("toastPersonalizacion");


let toastTimer;


/* ============================================================
   ESTADO TEMPORAL
   ============================================================ */

let logoActual = null;

let temaActual = {
    ...TEMA_KENTRO
};


/* ============================================================
   TOAST
   ============================================================ */

function mostrarToast(
    mensaje,
    tipo = "normal"
) {

    clearTimeout(
        toastTimer
    );

    toast.textContent =
        mensaje;


    toast.style.background =
        tipo === "error"
            ? "#991B1B"
            : tipo === "success"
                ? "#101713"
                : "#101713";


    toast.classList.add(
        "show"
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}


/* ============================================================
   NORMALIZAR HEX
   ============================================================ */

function normalizarHex(valor) {

    if (!valor) {

        return null;

    }


    let hex =
        valor
            .trim()
            .replace("#", "")
            .toUpperCase();


    if (/^[0-9A-F]{3}$/.test(hex)) {

        hex =
            hex
                .split("")
                .map(
                    caracter =>
                        caracter + caracter
                )
                .join("");

    }


    if (!/^[0-9A-F]{6}$/.test(hex)) {

        return null;

    }


    return "#" + hex;

}


/* ============================================================
   HEX → RGB
   ============================================================ */

function hexARgb(hex) {

    const limpio =
        normalizarHex(hex);

    if (!limpio) {

        return null;

    }


    const numero =
        parseInt(
            limpio.substring(1),
            16
        );


    return {

        r:
            (numero >> 16) & 255,

        g:
            (numero >> 8) & 255,

        b:
            numero & 255

    };

}


/* ============================================================
   RGB → HEX
   ============================================================ */

function rgbAHex(
    r,
    g,
    b
) {

    const convertir =
        valor => {

            const limitado =
                Math.max(
                    0,
                    Math.min(
                        255,
                        Math.round(valor)
                    )
                );


            return limitado
                .toString(16)
                .padStart(2, "0");

        };


    return (
        "#" +
        convertir(r) +
        convertir(g) +
        convertir(b)
    ).toUpperCase();

}


/* ============================================================
   MEZCLAR COLORES
   ============================================================ */

function mezclarColores(
    color1,
    color2,
    porcentaje
) {

    const rgb1 =
        hexARgb(color1);

    const rgb2 =
        hexARgb(color2);


    if (!rgb1 || !rgb2) {

        return color1;

    }


    const p =
        porcentaje / 100;


    return rgbAHex(

        rgb1.r +
        (rgb2.r - rgb1.r) * p,

        rgb1.g +
        (rgb2.g - rgb1.g) * p,

        rgb1.b +
        (rgb2.b - rgb1.b) * p

    );

}


/* ============================================================
   OSCURECER COLOR
   ============================================================ */

function oscurecerColor(
    color,
    porcentaje = 15
) {

    return mezclarColores(
        color,
        "#000000",
        porcentaje
    );

}


/* ============================================================
   ACLARAR COLOR
   ============================================================ */

function aclararColor(
    color,
    porcentaje = 30
) {

    return mezclarColores(
        color,
        "#FFFFFF",
        porcentaje
    );

}


/* ============================================================
   COLOR SUAVE
   ============================================================ */

function crearColorSuave(color) {

    return mezclarColores(
        color,
        "#FFFFFF",
        85
    );

}


/* ============================================================
   COLOR PARA TEXTO SOBRE EL PRINCIPAL
   ============================================================ */

function obtenerColorContraste(hex) {

    const rgb =
        hexARgb(hex);

    if (!rgb) {

        return "#080C0A";

    }


    const luminancia =
        (
            0.299 * rgb.r +
            0.587 * rgb.g +
            0.114 * rgb.b
        );


    return luminancia > 155
        ? "#080C0A"
        : "#FFFFFF";

}


/* ============================================================
   APLICAR TEMA A LA INTERFAZ
   ============================================================ */

function aplicarTema(tema) {

    temaActual = {
        ...tema
    };


    const root =
        document.documentElement;


    root.style.setProperty(
        "--brand-primary",
        tema.primary
    );


    root.style.setProperty(
        "--brand-primary-hover",
        tema.hover
    );


    root.style.setProperty(
        "--brand-primary-light",
        tema.light
    );


    root.style.setProperty(
        "--brand-primary-soft",
        tema.soft
    );


    root.style.setProperty(
        "--brand-on-primary",
        obtenerColorContraste(
            tema.primary
        )
    );


    actualizarSelectorColor(
        tema.primary
    );

}


/* ============================================================
   ACTUALIZAR SELECTOR DE COLOR
   ============================================================ */

function actualizarSelectorColor(color) {

    const normalizado =
        normalizarHex(color);

    if (!normalizado) {

        return;

    }


    colorPersonalizado.value =
        normalizado;


    colorHex.value =
        normalizado.substring(1);


    colorPreviewBox.style.background =
        normalizado;

}


/* ============================================================
   SELECCIONAR PALETA
   ============================================================ */

function seleccionarPaleta(elemento) {

    paletteOptions.forEach(
        palette => {

            palette.classList.remove(
                "active"
            );

        }
    );


    elemento.classList.add(
        "active"
    );


    const tema = {

        nombre:
            elemento.dataset.theme,

        primary:
            elemento.dataset.primary,

        hover:
            elemento.dataset.hover,

        light:
            elemento.dataset.light,

        soft:
            elemento.dataset.soft

    };


    aplicarTema(tema);

}


/* ============================================================
   EVENTOS DE PALETAS
   ============================================================ */

paletteOptions.forEach(
    palette => {

        palette.addEventListener(
            "click",
            () => {

                seleccionarPaleta(
                    palette
                );

            }
        );

    }
);


/* ============================================================
   COLOR PERSONALIZADO
   ============================================================ */

function aplicarColorPersonalizado(
    color
) {

    const normalizado =
        normalizarHex(color);


    if (!normalizado) {

        mostrarToast(
            "El color ingresado no es válido.",
            "error"
        );

        return;

    }


    const tema = {

        nombre:
            "personalizado",

        primary:
            normalizado,

        hover:
            oscurecerColor(
                normalizado,
                14
            ),

        light:
            aclararColor(
                normalizado,
                28
            ),

        soft:
            crearColorSuave(
                normalizado
            )

    };


    paletteOptions.forEach(
        palette => {

            palette.classList.remove(
                "active"
            );

        }
    );


    aplicarTema(tema);

}


/* ============================================================
   SELECTOR NATIVO
   ============================================================ */

colorPersonalizado.addEventListener(
    "input",
    () => {

        const color =
            colorPersonalizado.value;


        colorHex.value =
            color
                .replace("#", "")
                .toUpperCase();


        colorPreviewBox.style.background =
            color;


        aplicarColorPersonalizado(
            color
        );

    }
);


/* ============================================================
   INPUT HEX
   ============================================================ */

colorHex.addEventListener(
    "input",
    () => {

        colorHex.value =
            colorHex.value
                .replace(/[^0-9a-fA-F]/g, "")
                .substring(0, 6)
                .toUpperCase();


        const color =
            normalizarHex(
                colorHex.value
            );


        if (color) {

            colorPreviewBox.style.background =
                color;

        }

    }
);


colorHex.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            aplicarColorPersonalizado(
                colorHex.value
            );

        }

    }
);


btnAplicarColor.addEventListener(
    "click",
    () => {

        aplicarColorPersonalizado(
            colorHex.value
        );

    }
);


/* ============================================================
   SELECCIONAR LOGO
   ============================================================ */

btnSeleccionarLogo.addEventListener(
    "click",
    () => {

        inputLogo.click();

    }
);


/* ============================================================
   VALIDAR Y CARGAR LOGO
   ============================================================ */

inputLogo.addEventListener(
    "change",
    event => {

        const archivo =
            event.target.files[0];


        if (!archivo) {

            return;

        }


        /* ------------------------------------------
           VALIDAR TIPO
           ------------------------------------------ */

        const tiposPermitidos = [

            "image/png",

            "image/jpeg",

            "image/webp"

        ];


        if (
            !tiposPermitidos.includes(
                archivo.type
            )
        ) {

            mostrarToast(
                "Solo puedes cargar archivos PNG, JPG o WebP.",
                "error"
            );

            inputLogo.value = "";

            return;

        }


        /* ------------------------------------------
           VALIDAR PESO
           ------------------------------------------ */

        const maximoBytes =
            2 * 1024 * 1024;


        if (
            archivo.size >
            maximoBytes
        ) {

            mostrarToast(
                "El logo no puede superar los 2 MB.",
                "error"
            );

            inputLogo.value = "";

            return;

        }


        /* ------------------------------------------
           LEER ARCHIVO
           ------------------------------------------ */

        const reader =
            new FileReader();


        reader.onload =
            eventoReader => {

                const imagen =
                    new Image();


                imagen.onload =
                    () => {

                        validarDimensionesLogo(
                            imagen,
                            eventoReader.target.result
                        );

                    };


                imagen.src =
                    eventoReader.target.result;

            };


        reader.readAsDataURL(
            archivo
        );

    }
);


/* ============================================================
   VALIDAR DIMENSIONES DEL LOGO
   ============================================================ */

function validarDimensionesLogo(
    imagen,
    dataUrl
) {

    const ancho =
        imagen.naturalWidth;

    const alto =
        imagen.naturalHeight;


    /* ------------------------------------------
       MÍNIMO
       ------------------------------------------ */

    if (
        ancho < 256 ||
        alto < 256
    ) {

        mostrarToast(
            "El logo debe tener mínimo 256 × 256 px.",
            "error"
        );

        inputLogo.value = "";

        return;

    }


    /* ------------------------------------------
       PROPORCIÓN
       ------------------------------------------ */

    const diferencia =
        Math.abs(
            ancho - alto
        );


    const tolerancia =
        Math.max(
            ancho,
            alto
        ) * 0.08;


    if (
        diferencia >
        tolerancia
    ) {

        mostrarToast(
            "Para mejores resultados utiliza un logo cuadrado, preferiblemente 512 × 512 px.",
            "error"
        );

        inputLogo.value = "";

        return;

    }


    /* ------------------------------------------
       LOGO CORRECTO
       ------------------------------------------ */

    logoActual =
        dataUrl;


    mostrarLogo(
        logoActual
    );


    mostrarToast(
        "Logo cargado correctamente.",
        "success"
    );

}


/* ============================================================
   MOSTRAR LOGO
   ============================================================ */

function mostrarLogo(dataUrl) {

    if (!dataUrl) {

        ocultarLogo();

        return;

    }


    previewLogoImage.src =
        dataUrl;

    previewLogoImage.hidden =
        false;

    logoPlaceholder.style.display =
        "none";


    previewCompanyImage.src =
        dataUrl;

    previewCompanyImage.hidden =
        false;

    previewCompanyInitial.style.display =
        "none";


    btnEliminarLogo.disabled =
        false;

}


/* ============================================================
   ELIMINAR LOGO
   ============================================================ */

function ocultarLogo() {

    logoActual =
        null;


    previewLogoImage.src =
        "";

    previewLogoImage.hidden =
        true;


    logoPlaceholder.style.display =
        "flex";


    previewCompanyImage.src =
        "";

    previewCompanyImage.hidden =
        true;


    previewCompanyInitial.style.display =
        "flex";


    btnEliminarLogo.disabled =
        true;


    inputLogo.value =
        "";

}


btnEliminarLogo.addEventListener(
    "click",
    () => {

        ocultarLogo();


        actualizarVistaPreviaEmpresa();


        mostrarToast(
            "Logo eliminado."
        );

    }
);


/* ============================================================
   VISTA PREVIA EMPRESA
   ============================================================ */

function actualizarVistaPreviaEmpresa() {

    const empresa =
        nombreEmpresa.value.trim();


    const lemaEmpresa =
        lema.value.trim();


    /* ------------------------------------------
       NOMBRE
       ------------------------------------------ */

    previewCompanyName.textContent =
        empresa ||
        "Negocio Demo";


    /* ------------------------------------------
       INICIAL
       ------------------------------------------ */

    if (!logoActual) {

        const inicial =
            empresa
                ? empresa.charAt(0)
                : "N";


        previewCompanyInitial.textContent =
            inicial.toUpperCase();

    }


    /* ------------------------------------------
       LEMA
       ------------------------------------------ */

    previewBusinessLema.textContent =
        lemaEmpresa ||
        "Controla tu negocio con Kentro";

}


/* ============================================================
   ESCUCHAR CAMBIOS DE DATOS
   ============================================================ */

nombreEmpresa.addEventListener(
    "input",
    actualizarVistaPreviaEmpresa
);


lema.addEventListener(
    "input",
    actualizarVistaPreviaEmpresa
);


/* ============================================================
   VALIDAR CORREO
   ============================================================ */

function validarCorreo(valor) {

    if (!valor) {

        return true;

    }


    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return expresion.test(
        valor
    );

}


/* ============================================================
   VALIDAR FORMULARIO
   ============================================================ */

function validarFormulario() {

    if (
        !nit.value.trim()
    ) {

        mostrarToast(
            "Debes ingresar el NIT o CC.",
            "error"
        );

        nit.focus();

        return false;

    }


    if (
        !nombrePropietario.value.trim()
    ) {

        mostrarToast(
            "Debes ingresar el nombre del propietario.",
            "error"
        );

        nombrePropietario.focus();

        return false;

    }


    if (
        !nombreEmpresa.value.trim()
    ) {

        mostrarToast(
            "Debes ingresar el nombre de la empresa.",
            "error"
        );

        nombreEmpresa.focus();

        return false;

    }


    if (
        correo.value.trim() &&
        !validarCorreo(
            correo.value.trim()
        )
    ) {

        mostrarToast(
            "Ingresa un correo electrónico válido.",
            "error"
        );

        correo.focus();

        return false;

    }


    return true;

}


/* ============================================================
   OBTENER CONFIGURACIÓN
   ============================================================ */

function obtenerConfiguracion() {

    return {

        idEmpresa:
            idEmpresa.value.trim(),

        nit:
            nit.value.trim(),

        nombrePropietario:
            nombrePropietario.value.trim(),

        nombreEmpresa:
            nombreEmpresa.value.trim(),

        telefono:
            telefono.value.trim(),

        correo:
            correo.value.trim(),

        direccion:
            direccion.value.trim(),

        lema:
            lema.value.trim(),

        logo:
            logoActual,

        tema: {

            nombre:
                temaActual.nombre,

            primary:
                temaActual.primary,

            hover:
                temaActual.hover,

            light:
                temaActual.light,

            soft:
                temaActual.soft,

            onPrimary:
                obtenerColorContraste(
                    temaActual.primary
                )

        }

    };

}


/* ============================================================
   GUARDAR CONFIGURACIÓN
   ============================================================ */

function guardarConfiguracion() {

    if (
        !validarFormulario()
    ) {

        return;

    }


    const configuracion =
        obtenerConfiguracion();


    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
                configuracion
            )
        );


        mostrarToast(
            "Configuración guardada correctamente.",
            "success"
        );

    }

    catch (error) {

        console.error(
            "Error guardando configuración:",
            error
        );


        mostrarToast(
            "No fue posible guardar la configuración.",
            "error"
        );

    }

}


btnGuardar.addEventListener(
    "click",
    guardarConfiguracion
);


btnGuardarFooter.addEventListener(
    "click",
    guardarConfiguracion
);


/* ============================================================
   CARGAR CONFIGURACIÓN
   ============================================================ */

function cargarConfiguracion() {

    const guardado =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (!guardado) {

        aplicarTema(
            TEMA_KENTRO
        );

        actualizarVistaPreviaEmpresa();

        return;

    }


    try {

        const configuracion =
            JSON.parse(
                guardado
            );


        idEmpresa.value =
            configuracion.idEmpresa ||
            "KENTRO-000001";


        nit.value =
            configuracion.nit || "";


        nombrePropietario.value =
            configuracion.nombrePropietario || "";


        nombreEmpresa.value =
            configuracion.nombreEmpresa || "";


        telefono.value =
            configuracion.telefono || "";


        correo.value =
            configuracion.correo || "";


        direccion.value =
            configuracion.direccion || "";


        lema.value =
            configuracion.lema || "";


        logoActual =
            configuracion.logo ||
            null;


        if (logoActual) {

            mostrarLogo(
                logoActual
            );

        }

        else {

            ocultarLogo();

        }


        if (
            configuracion.tema &&
            configuracion.tema.primary
        ) {

            temaActual = {

                nombre:
                    configuracion.tema.nombre ||
                    "personalizado",

                primary:
                    configuracion.tema.primary,

                hover:
                    configuracion.tema.hover,

                light:
                    configuracion.tema.light,

                soft:
                    configuracion.tema.soft

            };


            aplicarTema(
                temaActual
            );


            marcarPaletaGuardada(
                temaActual
            );

        }

        else {

            aplicarTema(
                TEMA_KENTRO
            );

        }


        actualizarVistaPreviaEmpresa();

    }

    catch (error) {

        console.error(
            "Error cargando configuración:",
            error
        );


        aplicarTema(
            TEMA_KENTRO
        );

    }

}


/* ============================================================
   MARCAR PALETA GUARDADA
   ============================================================ */

function marcarPaletaGuardada(tema) {

    let encontrada =
        false;


    paletteOptions.forEach(
        palette => {

            const coincide =
                palette.dataset.primary
                    .toUpperCase() ===
                tema.primary
                    .toUpperCase();


            palette.classList.toggle(
                "active",
                coincide
            );


            if (coincide) {

                encontrada =
                    true;

            }

        }
    );


    if (!encontrada) {

        paletteOptions.forEach(
            palette => {

                palette.classList.remove(
                    "active"
                );

            }
        );

    }

}


/* ============================================================
   RESTAURAR COLORES KENTRO
   ============================================================ */

function restaurarTemaKentro() {

    aplicarTema(
        TEMA_KENTRO
    );


    paletteOptions.forEach(
        palette => {

            palette.classList.toggle(
                "active",
                palette.dataset.theme ===
                "kentro"
            );

        }
    );


    mostrarToast(
        "Se restauraron los colores originales de Kentro.",
        "success"
    );

}


btnRestaurar.addEventListener(
    "click",
    restaurarTemaKentro
);


btnRestaurarFooter.addEventListener(
    "click",
    restaurarTemaKentro
);


/* ============================================================
   VOLVER AL MENÚ
   ============================================================ */

btnVolver.addEventListener(
    "click",
    () => {

        window.location.replace(
            "../Menu/Menu.html"
        );

    }
);


/* ============================================================
   INICIALIZAR
   ============================================================ */

function iniciarPersonalizacion() {

    cargarConfiguracion();

    actualizarVistaPreviaEmpresa();

}


iniciarPersonalizacion();