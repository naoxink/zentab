// 1. RELOJ (Sencillo y eficiente)
function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('clock').textContent = timeStr;

    // Actualizamos el saludo según la hora
    const hour = now.getHours();
    let msg = "Buenas noches";
    if (hour >= 6 && hour < 12) msg = "Buenos días";
    else if (hour >= 12 && hour < 20) msg = "Buenas tardes";

    requestAnimationFrame(updateClock);
}

// 2. CAMBIADOR DE FONDO (Sin API Keys)
async function refreshBackground() {
    const btn = document.getElementById('refresh-bg');
    if (btn) btn.style.transform = "rotate(360deg)";

    // 1. Pedimos una imagen aleatoria
    const response = await fetch('https://picsum.photos/1920/1080');

    // 2. Picsum nos redirige a una URL fija con un ID real
    // Ejemplo: https://fastly.picsum.photos/id/237/1920/1080.jpg...
    const fixedUrl = response.url;

    // 3. Aplicamos y guardamos esa URL específica, no la de "random"
    applyBackground(fixedUrl);

    if (btn) setTimeout(() => btn.style.transform = "rotate(0deg)", 1000);
}

// Función única para establecer el fondo
function applyBackground(url) {
    const bgElement = document.getElementById('bg-image');
    if (bgElement && url) {
        bgElement.style.backgroundImage = `url('${url}')`;
        bgElement.style.opacity = "1";
        localStorage.setItem('lastBackground', url);
        console.log("Fondo aplicado y guardado:", url);
    }
}

const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Cargar tareas al iniciar
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
renderTasks();

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && todoInput.value.trim() !== '') {
        tasks.push(todoInput.value);
        todoInput.value = '';
        updateStorage();
    }
});

function renderTasks() {
    todoList.innerHTML = tasks.map((task, index) => `
        <li class="todo-item">${task} <span onclick="removeTask(${index})">×</span></li>
    `).join('');
}

function removeTask(index) {
    tasks.splice(index, 1);
    updateStorage();
}

function updateStorage() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
    todoInput.focus(); // Para que puedas seguir escribiendo sin usar el ratón
}
function loadYoutube(mood, videoId) {
    const wrapper = document.getElementById('player-wrapper');

    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');

    wrapper.innerHTML = `
            <iframe 
                width="100%" 
                height="80" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1" 
                frameborder="0" 
                allow="autoplay; encrypted-media">
            </iframe>`;
}
// 1. Cargar Clima (wttr.in es genial porque detecta tu IP)
async function updateWeather() {
    try {
        // Usamos Open-Meteo, que es libre y permite peticiones desde cualquier web
        const lat = 36.72; // Málaga
        const lon = -4.42;
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);

        if (!response.ok) throw new Error();

        const data = await response.json();
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;

        // Mapeo simple de iconos según el código de Open-Meteo
        let icon = "☀️";
        if (code >= 1 && code <= 3) icon = "🌤️";
        if (code >= 45 && code <= 48) icon = "☁️";
        if (code >= 51 && code <= 67) icon = "🌧️";
        if (code >= 71 && code <= 77) icon = "❄️";
        if (code >= 95) icon = "⛈️";

        document.getElementById('weather-info').textContent = `Málaga: ${icon} ${temp}°C`;
    } catch (err) {
        // Si incluso esto falla, al menos ponemos un mensaje honesto
        document.getElementById('weather-info').textContent = "No hemos podido encontrar datos :(";
    }
}

// 2. Sistema de Frases
const quotes = [
    "La mejor cámara es la que tienes contigo.",
    "Tu primera 10,000 fotografías son tus peores fotos. - Henri Cartier-Bresson",
    "Código limpio siempre parece que ha sido escrito por alguien a quien le importa.",
    "La luz lo es todo. - Sebastiao Salgado",
    "No te preocupes si no funciona bien. Si todo lo hiciera, no tendrías trabajo.",
    "La sencillez es la máxima sofisticación. - Da Vinci",
    "Si el código es difícil de explicar, es una mala idea."
];

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quote').textContent = `"${quotes[randomIndex]}"`;
}

window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f' && document.activeElement.tagName !== 'INPUT') {
        document.body.classList.toggle('focus-mode');
    }
});
// --- Lógica del Pomodoro ---
let timer;
let timeLeft = 25 * 60;
let isRunning = false;

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById('timer-display').textContent =
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function toggleTimer() {
    const btn = document.getElementById('timer-btn');
    if (isRunning) {
        clearInterval(timer);
        btn.textContent = "▶";
    } else {
        btn.textContent = "⏸";
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timer);
                new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(() => { });
                alert("¡Tiempo de descanso, Juan Gabriel!");
                resetTimer();
            }
        }, 1000);
    }
    isRunning = !isRunning;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
    document.getElementById('timer-btn').textContent = "▶";
}

// --- Lógica de Salud e Hidratación ---

// Esta función apaga el brillo cuando haces clic
function acknowledgeAlert(id) {
    const el = document.getElementById(id);
    if (el.classList.contains('alert-active')) {
        el.classList.remove('alert-active');
        // Pequeño feedback visual de confirmación
        el.style.transform = "scale(1.5)";
        setTimeout(() => el.style.transform = "scale(1)", 200);
    }
}

function setupHealthAlerts() {
    // Recordatorio de Agua cada 45 min
    setInterval(() => {
        document.getElementById('water-alert').classList.add('alert-active');
    }, 45 * 60 * 1000);

    // Recordatorio de Estirar cada 60 min
    setInterval(() => {
        document.getElementById('stretch-alert').classList.add('alert-active');
    }, 60 * 60 * 1000);
}

let quickLinks = JSON.parse(localStorage.getItem('zentab-links')) || [
    { name: 'Notas', url: 'https://naoxink.github.io/notas' }
];

function renderLinks() {
    const container = document.getElementById('links-container');
    container.innerHTML = '';
    
    quickLinks.forEach((link, index) => {
        const a = document.createElement('a');
        a.href = link.url;
        a.className = 'link-icon';
        a.target = '_blank';
        a.textContent = link.name;
        a.title = `Click derecho para eliminar "${link.name}"`
        
        // Clic derecho para eliminar un link
        a.oncontextmenu = (e) => {
            e.preventDefault();
            if(confirm(`¿Eliminar ${link.name}?`)) {
                quickLinks.splice(index, 1);
                saveAndRender();
            }
        };
        
        container.appendChild(a);
    });
}

function addNewLink() {
    const name = prompt("Nombre del sitio (ej: ChatGPT):");
    const url = prompt("URL (ej: https://chat.openai.com):");
    
    if (name && url) {
        quickLinks.push({ name, url: url.startsWith('http') ? url : `https://${url}` });
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('zentab-links', JSON.stringify(quickLinks));
    renderLinks();
}

document.addEventListener('DOMContentLoaded', () => {

    const nameElement = document.getElementById('user-name');

    // 1. Cargar nombre guardado
    const savedName = localStorage.getItem('dashboard-user-name');
    if (savedName && nameElement) {
        nameElement.textContent = savedName;
    }

    // 2. Evento para guardar cuando el usuario termina de escribir
    if (nameElement) {
        // Guardar al perder el foco (clic fuera)
        nameElement.addEventListener('blur', () => {
            const newName = nameElement.textContent.trim();
            if (newName) {
                localStorage.setItem('dashboard-user-name', newName);
            } else {
                nameElement.textContent = "Usuario";
            }
        });

        // Guardar al pulsar Enter y evitar salto de línea
        nameElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                nameElement.blur();
            }
        });
    }




    const savedBg = localStorage.getItem('lastBackground');

    if (savedBg && savedBg.includes('http')) {
        console.log("Detectado fondo en localStorage, aplicando...");
        applyBackground(savedBg);
    } else {
        console.log("No hay fondo guardado, cargando uno nuevo...");
        refreshBackground();
    }

    // Arrancamos el resto de funciones
    if (typeof updateClock === 'function') updateClock();
    if (typeof updateWeather === 'function') updateWeather();
    if (typeof showRandomQuote === 'function') showRandomQuote();
    if (typeof setupHealthAlerts === 'function') setupHealthAlerts();
    if (typeof renderLinks === 'function') renderLinks();

    document.querySelector('#weather-container').addEventListener('click', updateWeather)
});