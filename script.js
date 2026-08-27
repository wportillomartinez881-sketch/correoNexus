const WHATSAPP_NUMBER = "50361612756"; // Número actualizado correctamente
const GOOGLE_APPS_SCRIPT_URL = "AQUI_GOOGLE_APPS_SCRIPT_URL";

document.addEventListener("DOMContentLoaded", () => {

    // --- 0. CONFIGURACIÓN ENLACE WHATSAPP ---
    const whatsappBtn = document.getElementById("whatsappBtn");
    if (whatsappBtn) {
        const defaultMsg = encodeURIComponent("Hola, me interesa obtener más información sobre los servicios y tarifas de Nexus.");
        whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`;
    }

    // --- 1. PARTÍCULAS ANIMADAS ---
    const particlesContainer = document.getElementById('particles-container');
    for (let i = 0; i < 35; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.animationDuration = `${Math.random() * 8 + 6}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(particle);
    }

    // --- 2. CONTROL DE MODALES (VENTANAS INTERNAS) ---
    const emailModal = document.getElementById("emailModal");
    const chatModal = document.getElementById("chatModal");

    document.getElementById("btnOpenEmailModal").addEventListener("click", () => emailModal.classList.remove("hidden"));
    document.getElementById("btnCloseEmailModal").addEventListener("click", () => emailModal.classList.add("hidden"));

    document.getElementById("btnOpenChatModal").addEventListener("click", () => chatModal.classList.remove("hidden"));
    document.getElementById("btnCloseChatModal").addEventListener("click", () => chatModal.classList.add("hidden"));

    // Cerrar modal haciendo clic fuera del contenido
    window.addEventListener("click", (e) => {
        if (e.target === emailModal) emailModal.classList.add("hidden");
        if (e.target === chatModal) chatModal.classList.add("hidden");
    });

    // --- 3. CALENDARIO DE REUNIONES ---
    let currentDate = new Date();
    let selectedDateObj = null;
    let selectedTimeSlot = null;

    const availableDates = [
        "2026-09-02", "2026-09-04", "2026-09-08", "2026-09-10",
        "2026-09-15", "2026-09-18", "2026-09-22", "2026-09-25", "2026-09-29"
    ];
    const availableTimes = ["09:00 AM", "10:30 AM", "02:00 PM", "03:30 PM"];
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    document.getElementById("prevMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        document.getElementById("monthYearDisplay").textContent = `${monthNames[month]} ${year}`;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const daysGrid = document.getElementById("daysGrid");
        daysGrid.innerHTML = "";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDiv = document.createElement("div");
            emptyDiv.classList.add("calendar-day", "empty");
            daysGrid.appendChild(emptyDiv);
        }

        for (let day = 1; day <= totalDays; day++) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("calendar-day");
            dayDiv.textContent = day;

            const formattedMonth = String(month + 1).padStart(2, "0");
            const formattedDay = String(day).padStart(2, "0");
            const dateString = `${year}-${formattedMonth}-${formattedDay}`;
            const currentDayDate = new Date(year, month, day);

            if (currentDayDate < today) {
                dayDiv.classList.add("unavailable");
            } else if (availableDates.includes(dateString)) {
                dayDiv.classList.add("available");
                dayDiv.addEventListener("click", () => selectDate(dateString, dayDiv));
            } else {
                dayDiv.classList.add("unavailable");
            }

            if (selectedDateObj === dateString) dayDiv.classList.add("selected");
            daysGrid.appendChild(dayDiv);
        }
    }

    function selectDate(dateStr, dayElement) {
        document.querySelectorAll(".calendar-day").forEach(d => d.classList.remove("selected"));
        dayElement.classList.add("selected");
        selectedDateObj = dateStr;
        renderTimeSlots();
    }

    function renderTimeSlots() {
        const slotsGrid = document.getElementById("slotsGrid");
        slotsGrid.innerHTML = "";
        document.getElementById("timeHelperText").style.display = "none";

        availableTimes.forEach(time => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.classList.add("time-slot-btn");
            btn.textContent = time;

            btn.addEventListener("click", () => {
                document.querySelectorAll(".time-slot-btn").forEach(b => b.classList.remove("selected"));
                btn.classList.add("selected");
                selectedTimeSlot = time;
                document.getElementById("requestFormContainer").classList.remove("hidden");
            });

            slotsGrid.appendChild(btn);
        });
    }

    renderCalendar();

    // Envío Reunión
    const meetingForm = document.getElementById("meetingForm");
    meetingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = {
            nombre: document.getElementById("fullName").value.trim(),
            empresa: document.getElementById("companyName").value.trim(),
            correo: document.getElementById("email").value.trim(),
            telefono: document.getElementById("phone").value.trim(),
            motivo: document.getElementById("meetingReason").value,
            fecha: selectedDateObj,
            hora: selectedTimeSlot,
            fechaHoraSolicitud: new Date().toISOString()
        };

        if (!GOOGLE_APPS_SCRIPT_URL.includes("AQUI_")) {
            fetch(GOOGLE_APPS_SCRIPT_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }).catch(err => console.error(err));
        }

        document.getElementById("sumDate").textContent = formData.fecha;
        document.getElementById("sumTime").textContent = formData.hora;
        document.getElementById("sumName").textContent = formData.nombre;
        document.getElementById("sumCompany").textContent = formData.empresa;
        document.getElementById("sumEmail").textContent = formData.correo;

        document.getElementById("agendaSection").classList.add("hidden");
        document.getElementById("confirmationSection").classList.remove("hidden");
    });

    document.getElementById("btnBackHome").addEventListener("click", () => {
        document.getElementById("confirmationSection").classList.add("hidden");
        document.getElementById("agendaSection").classList.remove("hidden");
        meetingForm.reset();
        selectedDateObj = null;
        selectedTimeSlot = null;
        document.getElementById("requestFormContainer").classList.add("hidden");
        document.getElementById("slotsGrid").innerHTML = "";
        document.getElementById("timeHelperText").style.display = "block";
        renderCalendar();
    });

    // --- 4. FORMULARIO DE CORREO CORPORATIVO ---
    const contactForm = document.getElementById("contact-form");
    const statusText = document.getElementById("form-status");

    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const submitBtn = document.getElementById("submit-email-btn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";

        setTimeout(() => {
            statusText.classList.remove("hidden", "text-red-400");
            statusText.classList.add("text-emerald-400");
            statusText.textContent = "¡Correo enviado con éxito! Nos pondremos en contacto pronto.";
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = "Enviar Mensaje por Correo";
            setTimeout(() => {
                statusText.classList.add("hidden");
                emailModal.classList.add("hidden");
            }, 2500);
        }, 1500);
    });

    // --- 5. ASISTENTE VIRTUAL NEXUS (WEB) ---
    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");

    function appendMessage(sender, text) {
        const isBot = sender === "bot";
        const div = document.createElement("div");
        div.classList.add("flex", "items-start", "gap-2");
        if (!isBot) div.classList.add("flex-row-reverse");

        div.innerHTML = `
            <div class="w-7 h-7 rounded-full bg-slate-800 border border-gold-subtle flex items-center justify-center text-gold shrink-0">
                <i class="fa-solid ${isBot ? 'fa-robot' : 'fa-user'} text-[10px]"></i>
            </div>
            <div class="bg-slate-800 p-2.5 rounded-xl text-gray-200 border border-white/5 text-xs">
                ${text.replace(/\n/g, '<br>')}
            </div>
        `;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleBotResponse(query) {
        let response = "Entendido. Para más detalles sobre nuestros servicios en El Salvador, puedes agendar una reunión o escribirnos mediante el formulario de correo.";
        const q = query.toLowerCase();

        if (q.includes("qué es nexus") || q.includes("quienes") || q.includes("servicios")) {
            response = "Nexus Servicios Empresariales, S.A. de C.V. es tu aliado estratégico en gestión empresarial. Ofrecemos soluciones profesionales integrales adaptadas a las normativas vigentes en El Salvador.";
        } else if (q.includes("precio") || q.includes("módulo") || q.includes("tarifa") || q.includes("cuánto valen")) {
            response = "Nuestros módulos y tarifas oficiales son:\n• Módulo I (Planilla Única Base): $64.24\n• Módulo II (Asesoría Contable): $48.08\n• Módulo III (Gestión Corporativa): $110.27\n• Módulo IV (Consultoría Directa): $52.65";
        } else if (q.includes("planilla") || q.includes("isss") || q.includes("afp")) {
            response = "El Módulo I de Planilla Única ($64.24) consiste en el cálculo automatizado y seguro de ISSS, AFP y retenciones de ley para empresas.";
        } else if (q.includes("contacto") || q.includes("contactar") || q.includes("whatsapp")) {
            response = `Puedes comunicarte con nosotros agendando una reunión en el calendario superior, utilizando el formulario de correo o vía WhatsApp al número +503 6161-2756.`;
        }

        setTimeout(() => appendMessage("bot", response), 500);
    }

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        appendMessage("user", text);
        chatInput.value = "";
        handleBotResponse(text);
    });

    document.querySelectorAll(".faq-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const question = btn.textContent.trim();
            appendMessage("user", question);
            handleBotResponse(question);
        });
    });

});
