const WHATSAPP_NUMBER = "50378210173"; // Tu número configurado
const GOOGLE_APPS_SCRIPT_URL = "AQUI_GOOGLE_APPS_SCRIPT_URL";

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. PARTÍCULAS ANIMADAS ---
    const particlesContainer = document.getElementById('particles-container');
    for (let i = 0; i < 40; i++) {
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

    // --- 2. WHATSAPP ---
    document.getElementById("btnWhatsApp").addEventListener("click", () => {
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20deseo%20más%20información%20sobre%20los%20servicios%20y%20módulos%20de%20Nexus.`;
        window.open(waUrl, "_blank");
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
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Enviando...';

        setTimeout(() => {
            statusText.classList.remove("hidden", "text-red-400");
            statusText.classList.add("text-emerald-400");
            statusText.textContent = "¡Mensaje de correo enviado con éxito! Nos pondremos en contacto pronto.";
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Enviar Mensaje por Correo</span><i class="fa-solid fa-paper-plane text-xs"></i>';
            setTimeout(() => statusText.classList.add("hidden"), 5000);
        }, 1500);
    });

    // --- 5. ASISTENTE VIRTUAL INTERACTIVO ---
    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");

    function appendMessage(sender, text) {
        const isBot = sender === "bot";
        const div = document.createElement("div");
        div.classList.add("flex", "items-start", "gap-3");
        if (!isBot) div.classList.add("flex-row-reverse");

        div.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-slate-800 border border-gold-subtle flex items-center justify-center text-gold shrink-0">
                <i class="fa-solid ${isBot ? 'fa-robot' : 'fa-user'} text-xs"></i>
            </div>
            <div class="bg-slate-800 p-3 rounded-xl text-gray-200 max-w-lg border border-white/5 text-xs sm:text-sm">
                ${text}
            </div>
        `;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleBotResponse(query) {
        let response = "Entendido. Para gestiones especializadas o contratación de módulos en El Salvador, te invitamos a agendar una reunión o escribirnos mediante el formulario de correo.";
        const q = query.toLowerCase();

        if (q.includes("planilla") || q.includes("unica")) {
            response = "La Gestión de Planilla Única (Módulo I - $64.24) en Nexus automatiza el cálculo preciso de ISSS, AFP, renta y retenciones según las normativas vigentes en El Salvador.";
        } else if (q.includes("precio") || q.includes("módulo") || q.includes("tarifa")) {
            response = "Contamos con 4 módulos oficiales:\n• Módulo I (Planilla Única): $64.24\n• Módulo II (Asesoría Contable): $48.08\n• Módulo III (Gestión Corporativa): $110.27\n• Módulo IV (Consultoría Directa): $52.65";
        } else if (q.includes("horario") || q.includes("atencion")) {
            response = "Nuestro horario de atención corporativa es de Lunes a Viernes de 8:00 AM a 5:00 PM.";
        } else if (q.includes("asesoría") || q.includes("reunion") || q.includes("agendar")) {
            response = "Puedes seleccionar una fecha y hora directamente en el calendario interactivo que se encuentra en la parte superior de esta página.";
        } else if (q.includes("whatsapp") || q.includes("contacto directo")) {
            response = `También puedes escribirnos de forma directa haciendo clic en el botón inferior de WhatsApp o al número +503 7821-0173.`;
        }

        setTimeout(() => appendMessage("bot", response), 600);
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
            // Usa el atributo data-question si existe, de lo contrario toma el texto del título principal del botón
            const question = btn.getAttribute("data-question") || btn.querySelector("div").textContent;
            appendMessage("user", question);
            handleBotResponse(question);
        });
    });

});
