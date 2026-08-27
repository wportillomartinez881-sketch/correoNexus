// Lógica del Calendario Interactivo
const diasContainer = document.getElementById('calendar-days');
const mesAnioTexto = document.getElementById('mes-anio-titulo');
const slotsContainer = document.getElementById('time-slots-container');
const fechaSeleccionadaTexto = document.getElementById('selected-date-text');

let fechaActual = new Date();

function generarCalendario() {
    diasContainer.innerHTML = '';
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();

    const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    mesAnioTexto.innerText = `${nombresMeses[mes]} ${anio}`;

    // Cabecera de días de la semana
    ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach(d => {
        const div = document.createElement('div');
        div.style.fontWeight = 'bold';
        div.style.color = '#64748b';
        div.innerText = d;
        diasContainer.appendChild(div);
    });

    const primerDiaIndex = new Date(anio, mes, 1).getDay();
    const totalDias = new Date(anio, mes + 1, 0).getDate();

    // Espacios en blanco iniciales
    for (let i = 0; i < (primerDiaIndex === 0 ? 6 : primerDiaIndex - 1); i++) {
        const empty = document.createElement('div');
        diasContainer.appendChild(empty);
    }

    // Días del mes
    for (let i = 1; i <= totalDias; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        dayCell.innerText = i;
        
        // Simular fechas disponibles
        if (i % 2 === 0) {
            dayCell.onclick = () => seleccionarFecha(i, nombresMeses[mes], anio);
        } else {
            dayCell.style.opacity = '0.4';
            dayCell.style.cursor = 'not-allowed';
        }

        diasContainer.appendChild(dayCell);
    }
}

function cambiarMes(dir) {
    fechaActual.setMonth(fechaActual.getMonth() + dir);
    generarCalendario();
}

function seleccionarFecha(dia, mes, anio) {
    document.querySelectorAll('.day-cell').forEach(el => el.classList.remove('selected'));
    event.target.classList.add('selected');

    fechaSeleccionadaTexto.innerText = `Horarios para el ${dia} de ${mes} de ${anio}:`;
    
    slotsContainer.innerHTML = `
        <button class="time-btn" onclick="abrirVista('correo')">09:00 AM - 10:00 AM (Disponible)</button>
        <button class="time-btn" onclick="abrirVista('correo')">02:00 PM - 03:00 PM (Disponible)</button>
    `;
}

// Control de Vistas Modales (Correo / Chatbot)
function abrirVista(tipo) {
    document.getElementById('vista-overlay').classList.remove('hidden');
    document.getElementById('vista-correo').classList.add('hidden');
    document.getElementById('vista-chatbot').classList.add('hidden');

    if (tipo === 'correo') {
        document.getElementById('vista-correo').classList.remove('hidden');
    } else if (tipo === 'chatbot') {
        document.getElementById('vista-chatbot').classList.remove('hidden');
    }
}

function cerrarVista() {
    document.getElementById('vista-overlay').classList.add('hidden');
}

function cerrarCentroAtencion() {
    alert("Centro de atención cerrado.");
}

function enviarCorreo(e) {
    e.preventDefault();
    alert("¡Mensaje enviado con éxito a Nexus!");
    cerrarVista();
}

// Base de conocimiento del Chatbot (Fase 3, Precios y Leyes de El Salvador)
const knowledgeBase = {
    "planilla": "Los servicios de planilla oficiales son: Elaboración de Planilla Única ($64.24), Asesoría en Gestión de Planilla ($48.08), Configuración y Automatización ($110.27) y Revisión y Corrección ($52.65). Todos cumplen con el Código de Trabajo, ISSS y AFP de El Salvador.",
    "precios": "Nuestros precios finales son: Planilla Única ($64.24), Asesoría en Gestión ($48.08), Configuración y Automatización ($110.27) y Revisión ($52.65).",
    "servicios": "Ofrecemos Gestión de Planilla Única, Servicios Administrativos, Contables Básicos y Asesoría Empresarial bajo la normativa legal salvadoreña.",
    "legal": "Nuestros procesos se fundamentan estrictamente en el Código de Trabajo, Ley del Seguro Social, Ley del Sistema de Ahorro para Pensiones (SAP), Código Tributario y Código de Comercio de El Salvador."
};

function sendMessage() {
    const input = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chat-messages');
    const text = input.value.trim().toLowerCase();

    if (!text) return;

    // Mensaje del usuario
    const userMsg = document.createElement('div');
    userMsg.style.margin = "8px 0";
    userMsg.style.textAlign = "right";
    userMsg.innerHTML = `<span style="background-color: #2563eb; padding: 6px 12px; border-radius: 8px; display: inline-block;">${input.value}</span>`;
    messagesContainer.appendChild(userMsg);

    // Búsqueda en base de conocimiento
    let botResponse = "Entiendo tu consulta. Para más detalles corporativos o aclaraciones específicas sobre la fase 3, puedes enviarnos un mensaje desde nuestro formulario de correo.";
    
    for (let key in knowledgeBase) {
        if (text.includes(key)) {
            botResponse = knowledgeBase[key];
            break;
        }
    }

    // Respuesta del Bot
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.style.margin = "8px 0";
        botMsg.innerHTML = `<span style="background-color: #1e293b; padding: 8px 12px; border-radius: 8px; display: inline-block; border: 1px solid #334155;">${botResponse}</span>`;
        messagesContainer.appendChild(botMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 400);

    input.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Inicializar el calendario al cargar la página
window.onload = () => {
    generarCalendario();
};
