// Función para alternar la visibilidad del chatbot
function toggleChatbot() {
    const chat = document.getElementById('chatbot-container');
    chat.classList.toggle('chatbot-hidden');
}

// Base de conocimiento integrada (Fase 3, Servicios, Precios y Leyes de El Salvador)
const knowledgeBase = {
    "planilla": "Los servicios de planilla disponibles son: Elaboración de Planilla Única ($64.24), Asesoría en Gestión de Planilla ($48.08), Configuración y Automatización ($110.27) y Revisión y Corrección ($52.65). Todos alineados al Código de Trabajo, ISSS y AFP de El Salvador.",
    "precios": "Nuestros precios oficiales son: Planilla Única ($64.24), Asesoría en Gestión ($48.08), Automatización ($110.27) y Revisión ($52.65).",
    "servicios": "Ofrecemos Gestión de Planilla Única, Servicios Administrativos, Servicios Contables Básicos y Asesoría Empresarial bajo la normativa legal salvadoreña.",
    "legal": "Nuestros procesos cumplen rigurosamente con el Código de Trabajo, Ley del Seguro Social, Ley del Sistema de Ahorro para Pensiones (SAP), Código Tributario y Código de Comercio de El Salvador."
};

function sendMessage() {
    const input = document.getElementById('user-input');
    const messagesContainer = document.getElementById('chat-messages');
    const text = input.value.trim().toLowerCase();

    if (!text) return;

    // Mostrar mensaje del usuario
    const userMsg = document.createElement('div');
    userMsg.style.margin = "8px 0";
    userMsg.style.textAlign = "right";
    userMsg.innerHTML = `<span style="background-color: #2563eb; padding: 6px 12px; border-radius: 8px; display: inline-block;">${input.value}</span>`;
    messagesContainer.appendChild(userMsg);

    // Generar respuesta del bot basada en palabras clave
    let botResponse = "Entiendo tu consulta. Para más detalles específicos sobre nuestros servicios empresariales o la base legal en El Salvador, puedes escribirnos por correo o WhatsApp.";
    
    for (let key in knowledgeBase) {
        if (text.includes(key)) {
            botResponse = knowledgeBase[key];
            break;
        }
    }

    // Mostrar respuesta del bot
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.style.margin = "8px 0";
        botMsg.innerHTML = `<span style="background-color: #334155; padding: 6px 12px; border-radius: 8px; display: inline-block;">${botResponse}</span>`;
        messagesContainer.appendChild(botMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 400);

    input.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
