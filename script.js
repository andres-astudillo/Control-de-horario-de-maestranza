const URL_API_GOOGLE_SHEET = 'https://script.google.com/macros/s/AKfycbxTwKgctk7YhBzDQyRDrwy-yf0CaYRMNnQBL3VZbDoB2G0rgc-cyioaCqpd5qoPpbU/exec';

        // Usuarios predeterminados
        let usuarios = {
            "empleado1": { nombre: "Juan", apellido: "Pérez", contrasena: "1234" },
            "empleado2": { nombre: "María", apellido: "González", contrasena: "abcd" }
        };
        
        let usuarioAutenticado = null;
        let ubicacion = null;

        function iniciarSesion() {
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            if (usuarios[username] && usuarios[username].contrasena === password) {
                usuarioAutenticado = usuarios[username];
                document.getElementById("nombre").value = usuarioAutenticado.nombre;
                document.getElementById("apellido").value = usuarioAutenticado.apellido;

                document.getElementById("login-form").style.display = "none";
                document.getElementById("registro-form").style.display = "block";
                obtenerUbicacion();
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        }

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
                await fetch(URL_API_GOOGLE_SHEET, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos),
                    mode: 'no-cors' // Modo 'no-cors' para omitir restricciones de CORS
                });

                alert(`Registro de ${tipo} enviado exitosamente`);
            } catch (error) {
                console.error("Error al enviar datos a Google Sheets:", error);
            }
        }

        function cambiarContrasena() {
            const nuevaContrasena = prompt("Ingresa tu nueva contraseña:");
            if (nuevaContrasena) {
                usuarios[document.getElementById("username").value].contrasena = nuevaContrasena;
                alert("Contraseña actualizada con éxito.");
            }
        }