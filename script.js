// Cambia esta URL por la URL de tu Web App de Google Apps Script
const URL_API_GOOGLE_SHEET = 'https://script.google.com/macros/s/AKfycbxRCqYy_03BdB0WP4JzyalXqtCRtXtCRjbnbcY6kwlT9ELNe5yRt5S-ja0N6MEu_Wic/exec';

// Datos de usuarios con contraseñas predeterminadas
let usuarios = {
    "empleado1": { nombre: "Juan", apellido: "Pérez", contrasena: "1234" },
    "empleado2": { nombre: "María", apellido: "González", contrasena: "abcd" }
};

// Variables para almacenar al usuario autenticado y la ubicación
let usuarioAutenticado = null;
let ubicacion = null;

// Función de inicio de sesión
function iniciarSesion() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Verificar si el usuario existe y la contraseña es correcta
    if (usuarios[username] && usuarios[username].contrasena === password) {
        usuarioAutenticado = usuarios[username];
        document.getElementById("nombre").value = usuarioAutenticado.nombre;
        document.getElementById("apellido").value = usuarioAutenticado.apellido;

        // Oculta el formulario de inicio de sesión y muestra el de registro
        document.getElementById("login-form").style.display = "none";
        document.getElementById("registro-form").style.display = "block";
        obtenerUbicacion(); // Captura la ubicación automáticamente
    } else {
        alert("Usuario o contraseña incorrectos");
    }
}

// Obtener la ubicación del usuario
function obtenerUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                ubicacion = `${position.coords.latitude}, ${position.coords.longitude}`;
                document.getElementById("ubicacion").textContent = `Ubicación: ${ubicacion}`;
            },
            (error) => {
                console.error("Error al obtener ubicación", error);
                document.getElementById("ubicacion").textContent = "Ubicación: No disponible";
            }
        );
    } else {
        alert("La geolocalización no está soportada en este navegador.");
    }
}

// Función para registrar la entrada o salida
async function registrar(tipo) {
    if (!ubicacion) {
        alert("Ubicación no disponible. Asegúrese de permitir el acceso a la ubicación.");
        return;
    }

    const datos = {
        fechaHora: new Date().toLocaleString(),
        usuario: `${usuarioAutenticado.nombre} ${usuarioAutenticado.apellido}`,
        ubicacion,
        tipo
    };

    try {
        const respuesta = await fetch(URL_API_GOOGLE_SHEET, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos),
        });

        if (respuesta.ok) {
            alert(`Registro de ${tipo} exitoso`);
        } else {
            alert("Error al registrar en Google Sheet");
        }
    } catch (error) {
        console.error("Error de conexión al enviar datos a Google Sheets:", error);
    }
}

// Función para cambiar la contraseña
function cambiarContrasena() {
    const nuevaContrasena = prompt("Ingresa tu nueva contraseña:");
    if (nuevaContrasena) {
        usuarios[document.getElementById("username").value].contrasena = nuevaContrasena;
        alert("Contraseña actualizada con éxito.");
    }
}   
