/**
 * CONFIGURACIÓN DE VARIABLES EXTERNAS (INTEGRACIONES)
 */
const CONTACT_FORM_URL = "AQUI_COLOCARE_LA_URL_DE_TU_REPOSITORIO_DE_CORREO";
const CHATBOT_URL = "AQUI_COLOCARE_LA_URL_DEL_CHATBOT";
const WHATSAPP_NUMBER = "50322222222"; // Reemplaza con número real con código de país (ej. 503...)
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

    // --- 2. CONFIGURACIÓN DE ENLACES EXTERNOS ---
    const btnEmail = document.getElementById("btnEmailContact");
    if (!CONTACT_FORM_URL.includes("AQUI_")) btnEmail.href = CONTACT_FORM_URL;
    
    const btnChat = document.getElementById("btnChatbot");
    if (!CHATBOT_URL.includes("AQUI_")) btnChat.href = CHATBOT_URL;

    document.getElementById("btnWhatsApp").addEventListener("click", () => {
        if (WHATSAPP_NUMBER.includes("AQUI_") || WHATSAPP_NUMBER === "50322222222") {
            alert("Por favor, configura un número real en la variable WHATSAPP_NUMBER.");
        } else {
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20deseo%20más%20información%20sobre%20los%20servicios%20de%20Nexus.`;
            window.open(waUrl, "_blank");
        }
    });

    // --- 3. LÓGICA DEL CALENDARIO Y DISPONIBILIDAD ---
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

    // --- 4. ENVÍO DE FORMULARIO DE REUNIÓN ---
    const meetingForm = document.getElementById("meetingForm");
    meetingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!selectedDateObj || !selectedTimeSlot) {
            alert("Selecciona fecha y hora.");
            return;
        }

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
            fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }).catch(err => console.error(err));
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

});
