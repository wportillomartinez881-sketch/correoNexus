/**
 * CONFIGURACIÓN DE VARIABLES EXTERNAS (INTEGRACIONES FUTURAS)
 * Modifica estas constantes cuando despliegues tus otros repositorios o servicios.
 */
const CONTACT_FORM_URL = "AQUI_COLOCARE_LA_URL";
const CHATBOT_URL = "AQUI_COLOCARE_LA_URL";
const WHATSAPP_NUMBER = "AQUI_COLOCARE_EL_NUMERO"; // Ejemplo: "50370000000"
const GOOGLE_APPS_SCRIPT_URL = "AQUI_GOOGLE_APPS_SCRIPT_URL";

document.addEventListener("DOMContentLoaded", () => {

    // --- 1. CONFIGURACIÓN DE ENLACES EXTERNOS ---
    document.getElementById("btnEmailContact").addEventListener("click", () => {
        if (CONTACT_FORM_URL.includes("AQUI_")) {
            alert("Variable pendiente: CONTACT_FORM_URL no ha sido configurada.");
        } else {
            window.location.href = CONTACT_FORM_URL;
        }
    });

    document.getElementById("btnChatbot").addEventListener("click", () => {
        if (CHATBOT_URL.includes("AQUI_")) {
            alert("Variable pendiente: CHATBOT_URL no ha sido configurada.");
        } else {
            window.location.href = CHATBOT_URL;
        }
    });

    document.getElementById("btnWhatsApp").addEventListener("click", () => {
        if (WHATSAPP_NUMBER.includes("AQUI_")) {
            alert("Variable pendiente: WHATSAPP_NUMBER no ha sido configurada.");
        } else {
            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola,%20deseo%20más%20información%20sobre%20los%20servicios%20de%20Nexus.`;
            window.open(waUrl, "_blank");
        }
    });

    // --- 2. NAVEGACIÓN ENTRE SECCIONES ---
    const mainCardsSection = document.getElementById("mainCardsSection");
    const agendaSection = document.getElementById("agendaSection");
    const confirmationSection = document.getElementById("confirmationSection");

    document.getElementById("btnOpenAgenda").addEventListener("click", () => {
        mainCardsSection.classList.add("hidden");
        agendaSection.classList.remove("hidden");
        renderCalendar();
    });

    document.getElementById("btnCloseAgenda").addEventListener("click", () => {
        agendaSection.classList.add("hidden");
        mainCardsSection.classList.remove("hidden");
    });

    document.getElementById("btnBackHome").addEventListener("click", () => {
        confirmationSection.classList.add("hidden");
        mainCardsSection.classList.remove("hidden");
        resetAgendaState();
    });

    // --- 3. LÓGICA DEL CALENDARIO Y DISPONIBILIDAD ---
    let currentDate = new Date();
    let selectedDateObj = null;
    let selectedTimeSlot = null;

    // Fechas disponibles configurables (Formato: "YYYY-MM-DD")
    // Puedes agregar o quitar fechas fácilmente para demostración.
    const availableDates = [
        "2026-09-02",
        "2026-09-04",
        "2026-09-08",
        "2026-09-10",
        "2026-09-15",
        "2026-09-18",
        "2026-09-22",
        "2026-09-25",
        "2026-09-29"
    ];

    // Horarios disponibles configurables
    const availableTimes = [
        "09:00 AM",
        "10:30 AM",
        "02:00 PM",
        "03:30 PM"
    ];

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

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

        // Obtener fecha actual sin hora para bloquear fechas pasadas
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Espacios vacíos iniciales
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDiv = document.createElement("div");
            emptyDiv.classList.add("calendar-day", "empty");
            daysGrid.appendChild(emptyDiv);
        }

        // Renderizar días del mes
        for (let day = 1; day <= totalDays; day++) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("calendar-day");
            dayDiv.textContent = day;

            const formattedMonth = String(month + 1).padStart(2, "0");
            const formattedDay = String(day).padStart(2, "0");
            const dateString = `${year}-${formattedMonth}-${formattedDay}`;

            const currentDayDate = new Date(year, month, day);

            // Validar si es fecha pasada o no disponible
            if (currentDayDate < today) {
                dayDiv.classList.add("unavailable");
            } else if (availableDates.includes(dateString)) {
                dayDiv.classList.add("available");
                dayDiv.addEventListener("click", () => {
                    selectDate(dateString, dayDiv);
                });
            } else {
                dayDiv.classList.add("unavailable");
            }

            // Mantener estado seleccionado si recarga vista
            if (selectedDateObj === dateString) {
                dayDiv.classList.add("selected");
            }

            daysGrid.appendChild(dayDiv);
        }
    }

    function selectDate(dateStr, dayElement) {
        // Remover selección previa visual
        document.querySelectorAll(".calendar-day").forEach(d => d.classList.remove("selected"));
        dayElement.classList.add("selected");
        selectedDateObj = dateStr;

        // Mostrar horarios
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

                // Mostrar formulario de solicitud
                document.getElementById("requestFormContainer").classList.remove("hidden");
            });

            slotsGrid.appendChild(btn);
        });
    }

    // --- 4. ENVÍO DE FORMULARIO Y VALIDACIÓN ---
    const meetingForm = document.getElementById("meetingForm");
    meetingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!selectedDateObj || !selectedTimeSlot) {
            alert("Por favor selecciona una fecha y un horario primero.");
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

        // Preparado para Google Sheets mediante Google Apps Script (fetch)
        if (!GOOGLE_APPS_SCRIPT_URL.includes("AQUI_")) {
            fetch(GOOGLE_APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            }).catch(err => console.error("Error al enviar a Google Sheets:", err));
        }

        // Rellenar pantalla de confirmación
        document.getElementById("sumDate").textContent = formData.fecha;
        document.getElementById("sumTime").textContent = formData.hora;
        document.getElementById("sumName").textContent = formData.nombre;
        document.getElementById("sumCompany").textContent = formData.empresa;
        document.getElementById("sumEmail").textContent = formData.correo;

        // Cambiar vista
        agendaSection.classList.add("hidden");
        confirmationSection.classList.remove("hidden");
    });

    function resetAgendaState() {
        selectedDateObj = null;
        selectedTimeSlot = null;
        meetingForm.reset();
        document.getElementById("requestFormContainer").classList.add("hidden");
        document.getElementById("slotsGrid").innerHTML = "";
        document.getElementById("timeHelperText").style.display = "block";
    }

});
