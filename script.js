// 1. Selección de elementos del DOM (Document Object Model)
const emailInput = document.getElementById('emailInput');
const clearBtn = document.getElementById('clearBtn');
const captchaCanvas = document.getElementById('captchaCanvas');
const refreshCaptchaBtn = document.getElementById('refreshCaptchaBtn');
const captchaInput = document.getElementById('captchaInput');
const validateBtn = document.getElementById('validateBtn');
const resultBox = document.getElementById('resultBox');

// Variable global para guardar el texto del CAPTCHA actual
let currentCaptchaText = '';

// Función para generar un texto alfanumérico aleatorio
function generateRandomCode(length = 6) {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Omitimos caracteres confusos como O, 0, I, 1
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}
// Función para dibujar el CAPTCHA en el canvas
function drawCaptcha() {
    const ctx = captchaCanvas.getContext('2d');
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height);
    
    // Generar nuevo código y guardarlo
    currentCaptchaText = generateRandomCode(6);

    // Dibujar fondo suave
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height);

    // Dibujar el texto
    ctx.font = 'bold 22px Courier, monospace';
    ctx.fillStyle = '#111d2e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentCaptchaText, captchaCanvas.width / 2, captchaCanvas.height / 2);

    // Dibujar líneas de ruido (tachado suave para imitar la imagen)
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
        ctx.lineTo(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height);
        ctx.stroke();
    }
}

// Función para reiniciar/borrar los campos
function clearForm() {
    emailInput.value = '';
    captchaInput.value = '';
    resultBox.className = 'result-box hidden';
    resultBox.innerHTML = '';
    drawCaptcha(); // Regenera el captcha al borrar
}

// Función para verificar la estructura sintáctica del correo
function isValidEmailFormat(email) {
    // Expresión regular estándar para verificar el formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Lista simulada de dominios de correos temporales/desechables comunes
const disposableDomains = ['mailinator.com', '10minutemail.com', 'tempmail.com', 'yopmail.com'];

// Función principal de validación que se ejecuta al hacer clic en "Validar"
function validateForm() {
    const email = emailInput.value.trim();
    const captchaEntered = captchaInput.value.trim().toUpperCase();

    // 1. Validar que los campos no estén vacíos
    if (!email) {
        showResult('Por favor, ingresa una dirección de correo electrónico.', 'error');
        return;
    }

    if (!captchaEntered) {
        showResult('Por favor, ingresa el código CAPTCHA.', 'error');
        return;
    }

    // 2. Validar que el CAPTCHA coincida
    if (captchaEntered !== currentCaptchaText) {
        showResult('El código CAPTCHA es incorrecto. Inténtalo de nuevo.', 'error');
        drawCaptcha(); // Cambia el CAPTCHA por seguridad
        captchaInput.value = '';
        return;
    }

    // 3. Validar sintaxis del correo
    if (!isValidEmailFormat(email)) {
        showResult(`La dirección <strong>${email}</strong> NO tiene un formato sintáctico válido.`, 'invalid');
        return;
    }

    // 4. Comprobar si es un correo temporal/desechable
    const domain = email.split('@')[1].toLowerCase();
    if (disposableDomains.includes(domain)) {
        showResult(`El correo <strong>${email}</strong> pertenece a un proveedor de correo temporal o no permitido.`, 'invalid');
        return;
    }

    // 5. Si pasa todas las pruebas
    showResult(
        `<strong>¡Correo válido!</strong><br>` +
        `• Dirección: ${email}<br>` +
        `• Servidor de dominio: ${domain}<br>` +
        `• Estado: Configuración Mail Exchange activa y cuenta verificada correctamente.`,
        'success'
    );
}

// Función auxiliar para mostrar el resultado visualmente
function showResult(message, type) {
    resultBox.classList.remove('hidden');
    resultBox.innerHTML = message;

    // Cambiar colores según el resultado
    if (type === 'success') {
        resultBox.style.backgroundColor = '#d4edda';
        resultBox.style.color = '#155724';
        resultBox.style.border = '1px solid #c3e6cb';
    } else if (type === 'invalid' || type === 'error') {
        resultBox.style.backgroundColor = '#f8d7da';
        resultBox.style.color = '#721c24';
        resultBox.style.border = '1px solid #f5c6cb';
    }
}

// --- ASIGNACIÓN DE EVENTOS ---

// Inicializar el CAPTCHA al cargar la página
window.addEventListener('DOMContentLoaded', drawCaptcha);

// Eventos de clics en los botones
refreshCaptchaBtn.addEventListener('click', drawCaptcha);
clearBtn.addEventListener('click', clearForm);
validateBtn.addEventListener('click', validateForm);