// Carga la API de Google para el inicio de sesión
function handleCredentialResponse(response) {
    console.log("Token JWT recibido:");
    console.log(response.credential);

    // Enviar el token al backend para validarlo
    fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token: response.credential })
    })
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            alert(`¡Bienvenido, ${data.user.name}!`);
        } else {
            alert("Error al iniciar sesión");
        }
    })
    .catch(error => console.error("Error en la autenticación:", error));
}

// Inicializar el cliente de Google
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "1006264475075-acpgmbih4dihuli7pj5fa0vfkc672fa3.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
        document.getElementById("google-login-btn"), // Elemento donde renderizar el botón
        { theme: "outline", size: "large" } // Opciones del botón
    );

    google.accounts.id.prompt(); // Mostrar el cuadro de diálogo
};
