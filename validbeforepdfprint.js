/* Copyright - Oliver Acker, acker_oliver@yahoo.de
validbeforepdfprint.js
Version 3.34_beta */



function validateStrasseeinzug() {
    // 1. Straßenvalidierung
    const strasseeinzugInput = document.getElementById("strasseeinzug");
    if (!strasseeinzugInput?.value?.trim()) {
        showModalBox("", "Objekt / Straße bitte eingeben.", strasseeinzugInput);
        return false;
    }

    // 2. Radio-Button Validierung mit allen relevanten Gruppen
    const radioGroups = [
        { names: ["rb", "rb00"], area: "Balkon" },
        { names: ["rk", "rk00"], area: "Keller" },
        { names: ["rd", "rd00"], area: "Dachboden" },
        { names: ["rg", "rg00"], area: "Stellplatz" }
    ];

    let isValid = true;
    let firstInvalidArea = "";
    let firstInvalidElement = null;

    radioGroups.forEach(group => {
        let isChecked = false;
        let groupRadioElements = [];

        // Alle Radio-Buttons der Gruppe finden
        group.names.forEach(name => {
            const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
            radios.forEach(radio => {
                groupRadioElements.push(radio);
                if (radio.checked) isChecked = true;
                else if (!firstInvalidElement && !isChecked) {
                    firstInvalidElement = radio;
                }
            });
        });

        if (!isChecked) {
            isValid = false;
            if (!firstInvalidArea) firstInvalidArea = group.area;

            // Visuelles Feedback für die gesamte Zeile
            const rows = document.querySelectorAll("tr");
            rows.forEach(row => {
                if (row.textContent.includes(group.area)) {
                    row.style.boxShadow = "0 0 0 2px #ff6b6b";
                    setTimeout(() => row.style.boxShadow = "none", 8000);
                }
            });
        }
    });

    if (!isValid) {
        const nebenraumContainer = document.getElementById("nebenraumContainer");
        showModalBox(
            "",
            `Bitte wählen Sie für "${firstInvalidArea}" mindestens eine Option aus.`,
            firstInvalidElement,
            nebenraumContainer
        );
        return false;
    }

    return true;
}

// Erstellt eine individuelle Modalbox
function showModalBox(title, message, inputElement = null, scrollContainer = null) {
    // Vorhandene Modalboxen entfernen
    document.querySelectorAll('.custom-validation-modal').forEach(modal => modal.remove());

    // Modal Elemente erstellen
    const modal = document.createElement("div");
    modal.className = "custom-validation-modal";
    modal.style.cssText = `
        display: block;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.7);
        overflow: auto;
    `;

    const modalContent = document.createElement("div");
    modalContent.className = "custom-modal-content";
    modalContent.style.cssText = `
        background-color: #f8f9fa;
        margin: 10% auto;
        padding: 25px;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        width: 80%;
        max-width: 500px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        position: relative;
        animation: custom-modal-fadein 0.3s;
    `;

    const closeBtn = document.createElement("span");
    closeBtn.className = "custom-modal-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.style.cssText = `
        color: #6c757d;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
        transition: color 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.color = "#000";
    closeBtn.onmouseout = () => closeBtn.style.color = "#6c757d";
    closeBtn.onclick = () => modal.remove();

    const titleElement = document.createElement("h3");
    titleElement.className = "custom-modal-title";
    titleElement.textContent = title;
    titleElement.style.cssText = `
        color: #343a40;
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.5rem;
    `;

    const messageElement = document.createElement("p");
    messageElement.className = "custom-modal-message";
    messageElement.textContent = message;
    messageElement.style.cssText = `
        color: #495057;
        margin-bottom: 20px;
        line-height: 1.3;
        text-align: center;
    `;

    // Button-Container für perfekte Zentrierung
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
        display: flex;
        justify-content: center;
        width: 100%;
        margin-top: 20px;
    `;

    const okButton = document.createElement("button");
    okButton.className = "custom-modal-button";
    okButton.textContent = "OK";
    okButton.style.cssText = `
        background-color: #6b85c2;
        color: white;
        border: none;
        padding: 10px 30px;
        font-size: 22px;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.3s;
        min-width: 120px;
    `;
    okButton.onmouseover = () => okButton.style.backgroundColor = "#5b85c2";
    okButton.onmouseout = () => okButton.style.backgroundColor = "#6b85c2";
    okButton.onclick = () => modal.remove();

    // Elemente hierarchisch zusammenbauen
    buttonContainer.appendChild(okButton);
    modalContent.appendChild(closeBtn);
    modalContent.appendChild(titleElement);
    modalContent.appendChild(messageElement);
    modalContent.appendChild(buttonContainer); // Button-Container statt direktem Button
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Klick außerhalb schließt Modal
    modal.onclick = (e) => e.target === modal && modal.remove();

    // Animationen
    const style = document.createElement("style");
    style.textContent = `
        @keyframes custom-modal-fadein {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes highlight-label {
            0% { background-color: rgba(255,107,107,0.3); }
            50% { background-color: rgba(255,107,107,0.7); }
            100% { background-color: transparent; }
        }
    `;
    document.head.appendChild(style);

    // Scroll-Verhalten
    setTimeout(() => {
        if (scrollContainer) {
            scrollContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (inputElement) {
                const label = document.querySelector(`label[for="${inputElement.id}"]`);
                label && (label.style.animation = "highlight-label 1.5s") && setTimeout(() => label.style.animation = "", 1500);
            }
        } else if (inputElement) {
            inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            inputElement.focus();
        }
    }, 100);
}



function processData() {
    return new Promise((resolve) => {
        resolve();
    });
}

async function runAllPrintJSFunctions() {
    await processData();
    await otherFunction();
    document.dispatchEvent(new CustomEvent('printJSFinished'));
}
