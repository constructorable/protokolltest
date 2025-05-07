/* Copyright - Oliver Acker, acker_oliver@yahoo.de
saveimportexport.js
Version 3.36_beta */


function getFormData() {
    const data = {};

    data['dupli_atsc'] = [];
    document.querySelectorAll('input.dupli.atsc[id]').forEach(input => {
        const key = input.id;
        data[key] = input.value;
    });

    data['signatureFullnames'] = {};
    document.querySelectorAll('[id^="einziehender-mieter-fullname-"], [id^="ausziehender-mieter-fullname-"]').forEach(span => {
        data['signatureFullnames'][span.id] = span.textContent.trim();
    });

    document.querySelectorAll('input').forEach(input => {
        const key = input.id || input.name;
        if (!key) return;

        if (input.type === 'radio' || input.type === 'checkbox') {
            data[key] = input.checked;
        } else {
            data[key] = input.value;
        }
    });
    document.querySelectorAll('select').forEach(select => {
        const key = select.id || select.name;
        if (!key) return;

        data[key] = select.value;
    });
    return data;
}
const saveAsTextBtn = document.getElementById("saveasText");
if (saveAsTextBtn) {
    saveAsTextBtn.addEventListener("click", exportCurrentSaveAsText);
}

// Gespeicherte Daten wieder ins Formular einsetzen
function setFormData(data) {
    // Helper function to set element value
    const setElementValue = (el, value) => {
        if (el.type === 'radio' || el.type === 'checkbox') {
            el.checked = value;
        } else {
            el.value = value ?? ''; // Fallback for null/undefined
        }
    };

    // Process regular fields
    Object.keys(data).forEach(key => {
        // First try elements with class "dupli atsc"
        const dupliEl = document.getElementById(key);
        if (dupliEl && dupliEl.classList.contains("dupli") && dupliEl.classList.contains("atsc")) {
            setElementValue(dupliEl, data[key]);
            return;
        }

        // Fallback to any matching element
        const el = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
        if (el) {
            setElementValue(el, data[key]);
        }
    });

    // Process signature fields
    if (data.signatureFullnames) {
        Object.entries(data.signatureFullnames).forEach(([id, value]) => {
            const span = document.getElementById(id);
            if (span) span.textContent = value;
        });
    }

    // Process remarks
    if (Array.isArray(data.remarks)) {
        const originalRow = document.querySelector('tr.ogro');
        if (!originalRow) return;

        const dupliTable = originalRow.parentElement;
        const firstInput = originalRow.querySelector('input.dupli.atsc');

        // Clear existing rows except original
        dupliTable.querySelectorAll('tr:not(.ogro)').forEach(row => row.remove());

        // Set first remark
        if (firstInput) firstInput.value = data.remarks[0] ?? '';

        // Add additional remarks
        data.remarks.slice(1).forEach(remark => {
            const newRow = originalRow.cloneNode(true);
            newRow.classList.remove('ogro');
            const input = newRow.querySelector('input.dupli.atsc');
            if (input) input.value = remark;
            dupliTable.appendChild(newRow);
        });
    }
}

let autoBackupInterval;
let initialBackupTimeout;

function startAutoBackup() {
    // Clear any existing intervals/timeouts
    if (autoBackupInterval) clearInterval(autoBackupInterval);
    if (initialBackupTimeout) clearTimeout(initialBackupTimeout);

    // Schedule first backup after 5 minutes (300,000 milliseconds)
    initialBackupTimeout = setTimeout(() => {
        performAutoBackup();

        // Then set regular interval for every 10 minutes (600,000 milliseconds)
        autoBackupInterval = setInterval(performAutoBackup, 1200000);
    }, 300000);

    console.log("Auto-Backup geplant: Erstes Backup in 5 Minuten, dann alle 10 Minuten");
}

function stopAutoBackup() {
    if (autoBackupInterval) clearInterval(autoBackupInterval);
    if (initialBackupTimeout) clearTimeout(initialBackupTimeout);
    console.log("Auto-Backup gestoppt");
}


function formatGermanDateTime(date) {
    const pad = num => num.toString().padStart(2, '0');

    // Get Berlin time
    const berlinDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));

    // Format as YYYY-MM-DD_HH:MM:SS
    return [
        berlinDate.getFullYear(),
        pad(berlinDate.getMonth() + 1),
        pad(berlinDate.getDate())
    ].join('-') + '_' + [
        pad(berlinDate.getHours()),
        pad(berlinDate.getMinutes()),
        pad(berlinDate.getSeconds())
    ].join(':');
}

function performAutoBackup() {
    const timestamp = formatGermanDateTime(new Date());
    const backupName = `Autosave_${timestamp}`;

    // Save data
    const allSaves = JSON.parse(localStorage.getItem("saves")) || {};
    allSaves[backupName] = getFormData();
    localStorage.setItem("saves", JSON.stringify(allSaves));

    // Update UI
    updateSaveList();
    localStorage.setItem('lastBackupTime', timestamp);

    console.log(`Automatisch gesichert als: ${backupName} (${new Date().toLocaleTimeString()})`);
}


function saveData() {
    // Create modal
    const inputModal = document.createElement("div");
    inputModal.id = "saveNameModal";
    inputModal.innerHTML = `
        <div class="modal-content" style="position: relative;">
            <!-- Close Button -->
            <button id="modalCloseBtn" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #888;
                padding: 5px 10px;
                line-height: 1;
            ">×</button>
            
            <h2>Name eingeben</h2>
            <input type="text" id="saveNameInput" placeholder="">
            <div class="button-group">
                <button id="cancelSaveBtn">Abbrechen</button>
                <button id="confirmSaveBtn">Speichern</button>
            </div>
        </div>
    `;

    // Apply styles (consider moving to CSS)
    Object.assign(inputModal.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999",
        opacity: "0",
        pointerEvents: "none",
        transition: "opacity 0.3s ease"
    });

    const modalContent = inputModal.querySelector('.modal-content');
    Object.assign(modalContent.style, {
        background: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
        width: "400px",
        maxWidth: "90%",
        animation: "fadeInUp 0.4s ease",
        position: "relative" // Wichtig für den Close-Button
    });

    // Input field styles
    const inputField = inputModal.querySelector('#saveNameInput');
    Object.assign(inputField.style, {
        width: "100%",
        padding: "12px",
        marginBottom: "25px",
        border: "2px solid #ddd",
        borderRadius: "6px",
        fontSize: "16px",
        boxSizing: "border-box"
    });

    // Button group styles
    const buttonGroup = inputModal.querySelector('.button-group');
    Object.assign(buttonGroup.style, {
        display: "flex",
        justifyContent: "space-between",
        gap: "15px"
    });

    // Button styles
    const buttons = inputModal.querySelectorAll('.button-group button');
    buttons.forEach(button => {
        Object.assign(button.style, {
            flex: "1",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            transition: "background-color 0.3s"
        });
    });

    // Cancel button specific style
    Object.assign(buttons[0].style, {
        backgroundColor: "rgb(176, 57, 57)",
        color: "white"
    });

    // Confirm button specific style
    Object.assign(buttons[1].style, {
        backgroundColor: "rgb(40, 118, 43)",
        color: "white"
    });

    document.body.appendChild(inputModal);

    // Show modal
    setTimeout(() => {
        inputModal.style.opacity = "1";
        inputModal.style.pointerEvents = "auto";
        document.getElementById("saveNameInput").focus();
    }, 10);

    // Event handlers
    const confirmSave = () => {
        const name = document.getElementById("saveNameInput").value.trim();
        if (!name) {
            alert("Bitte geben Sie einen Namen ein!");
            return;
        }

        // Save data
        const allSaves = JSON.parse(localStorage.getItem("saves")) || {};
        allSaves[name] = getFormData();
        localStorage.setItem("saves", JSON.stringify(allSaves));

        updateSaveList();

        // Update current save name display
        const nameDisplay = document.getElementById("currentSaveName");
        if (nameDisplay) nameDisplay.textContent = `Aktuell geladene Version: ${name}`;

        closeModal();
        showSuccessModal(`Name: "${name}"`);
    };

    const closeModal = () => {
        inputModal.style.opacity = "0";
        inputModal.style.pointerEvents = "none";
        setTimeout(() => document.body.removeChild(inputModal), 100);
    };

    // Event listeners
    document.getElementById("confirmSaveBtn").addEventListener("click", confirmSave);
    document.getElementById("cancelSaveBtn").addEventListener("click", closeModal);
    document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
    document.getElementById("saveNameInput").addEventListener("keypress", (e) => {
        if (e.key === "Enter") confirmSave();
    });
}

// Hilfsfunktion für Erfolgsmeldung
function showSuccessModal(message) {
    const modal = document.createElement("div");
    modal.id = "successModal";
    modal.innerHTML = `
        <div style="
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            animation: fadeInUp 0.4s ease;
        ">
            <h2 style="margin-bottom: 10px; color: #4CAF50; font-size: 22px;">Erfolgreich gespeichert!</h2>
            <p style="margin-bottom: 20px; font-size: 22px;">${message}</p>
            <button id="closeModalBtn" style="
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s;
            ">OK</button>
        </div>
    `;

    Object.assign(modal.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: "0",
        pointerEvents: "none",
        transition: "opacity 0.3s ease",
        zIndex: "9999"
    });

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.style.opacity = "1";
        modal.style.pointerEvents = "auto";
    }, 100);

    document.getElementById("closeModalBtn").addEventListener("click", () => {
        modal.style.opacity = "0";
        modal.style.pointerEvents = "none";
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 100);
    });
}

// CSS-Animationen sicherstellen
if (!document.getElementById('modalStyles')) {
    const style = document.createElement('style');
    style.id = 'modalStyles';
    style.innerHTML = `
        @keyframes fadeInUp {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        #confirmSaveBtn:hover {
            background-color: #45a049 !important;
        }
        #cancelSaveBtn:hover {
            background-color: #d32f2f !important;
        }
        #closeModalBtn:hover {
            background-color: #45a049 !important;
        }
    `;
    document.head.appendChild(style);
}















// Liste gespeicherter Einträge aktualisieren
function updateSaveList() {
    const select = document.getElementById("loadSelect");
    const allSaves = JSON.parse(localStorage.getItem("saves")) || {};

    select.innerHTML = ''; // Bestehende Optionen löschen

    if (Object.keys(allSaves).length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Keine Einträge vorhanden";
        select.appendChild(option);
    } else {
        Object.keys(allSaves).forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    startAutoBackup();
});




function loadSelectedSave() {
    // Modal für Ladeauswahl erstellen
    const loadModal = document.createElement("div");
    loadModal.id = "loadSelectionModal";

    // Optionen aus dem LocalStorage laden
    const allSaves = JSON.parse(localStorage.getItem("saves")) || {};
    const saveOptions = Object.keys(allSaves).map(name =>
        `<option value="${name}">${name}</option>`
    ).join('');

    loadModal.innerHTML = `
        <div style="
            background: #ffffff;
            padding: 30px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            width: 500px;
            max-width: 90%;
            animation: fadeInUp 0.4s ease;
            position: relative;
        ">
            <!-- Close Button -->
            <button id="modalCloseBtn" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #888;
                padding: 5px 10px;
                line-height: 1;
            ">×</button>
            
            <h2 style="margin-bottom: 20px; color: rgb(90, 94, 103); font-size: 26px;">Version laden</h2>
            
            <select id="modalLoadSelect" style="
                width: 100%;
                padding: 12px;
                margin-bottom: 25px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 26px;
                box-sizing: border-box;
                height: 70px;
            ">
                <option style="font-size:22px;" value="">-- Bitte auswählen --</option>
                ${saveOptions}
            </select>
            
            <div style="display: flex; justify-content: center; gap: 15px;">
                <button id="cancelLoadBtn" style="
                    background-color: rgb(176, 57, 57);
                    color: white;
                    padding: 10px 25px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 22px;
                    transition: background-color 0.3s;
                ">Abbrechen</button>
                
                <button id="confirmLoadBtn" style="
                    background-color: rgb(40, 118, 43);
                    color: white;
                    padding: 10px 25px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 22px;
                    transition: background-color 0.3s;
                ">Laden</button>
            </div>
        </div>
    `;

    Object.assign(loadModal.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999",
        opacity: "0",
        pointerEvents: "none",
        transition: "opacity 0.3s ease"
    });

    document.body.appendChild(loadModal);

    // Modal anzeigen
    setTimeout(() => {
        loadModal.style.opacity = "1";
        loadModal.style.pointerEvents = "auto";
        document.getElementById("modalLoadSelect").focus();
    }, 10);

    // Event-Handler für Close-Button
    document.getElementById("modalCloseBtn").addEventListener("click", () => {
        loadModal.style.opacity = "0";
        loadModal.style.pointerEvents = "none";
        setTimeout(() => {
            document.body.removeChild(loadModal);
        }, 100);
    });

    // Event-Handler für Laden-Button
    document.getElementById("confirmLoadBtn").addEventListener("click", () => {
        const selectedName = document.getElementById("modalLoadSelect").value;

        if (!selectedName) {
            alert("Bitte wählen Sie eine Version aus!");
            return;
        }

        // Modal schließen
        loadModal.style.opacity = "0";
        loadModal.style.pointerEvents = "none";
        setTimeout(() => {
            document.body.removeChild(loadModal);
        }, 100);

        // Originale Funktion mit der ausgewählten Version aufrufen
        loadSelectedVersion(selectedName);
    });

    // Event-Handler für Abbrechen-Button
    document.getElementById("cancelLoadBtn").addEventListener("click", () => {
        loadModal.style.opacity = "0";
        loadModal.style.pointerEvents = "none";
        setTimeout(() => {
            document.body.removeChild(loadModal);
        }, 100);
    });

    // Enter-Taste abfangen
    document.getElementById("modalLoadSelect").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            document.getElementById("confirmLoadBtn").click();
        }
    });

    // Hilfsfunktion, die die eigentliche Ladefunktion enthält
    function loadSelectedVersion(selectedName) {
        const allSaves = JSON.parse(localStorage.getItem("saves")) || {};
        if (allSaves[selectedName]) {
            setFormData(allSaves[selectedName]);

            // Name der aktuellen Version anzeigen
            const nameDisplay = document.getElementById("currentSaveName");
            if (nameDisplay) {
                nameDisplay.textContent = `Aktuell geladene Version: ${selectedName}`;
            }

            // Vorhandenes Modal entfernen, falls vorhanden
            const existingModal = document.getElementById("loadSuccessModal");
            if (existingModal) {
                document.body.removeChild(existingModal);
            }

            // Erfolgs-Modal erstellen
            const modal = document.createElement("div");
            modal.id = "loadSuccessModal";
            modal.innerHTML = `
                <div style="
                    background: #ffffff;
                    padding: 30px;
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                    animation: fadeInUp 0.4s ease;
                ">
                    <h2 style="margin-bottom: 10px; color: rgb(40, 118, 43); font-size: 26px;">Laden erfolgreich!</h2>
                    <p style="margin-bottom: 20px; font-size: 22px;">Name: ${selectedName}</p>
                    <button id="closeLoadModalBtn" style="
                        background-color: rgb(40, 118, 43);
                        color: white;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 22px;
                        transition: background-color 0.3s;
                    ">OK</button>
                </div>
            `;
            Object.assign(modal.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                opacity: "0",
                pointerEvents: "none",
                transition: "opacity 0.3s ease",
                zIndex: "9999"
            });
            document.body.appendChild(modal);

            // Modal nach 1500ms sichtbar machen
            setTimeout(() => {
                modal.style.opacity = "1";
                modal.style.pointerEvents = "auto";
            }, 50);

            // Button schließen mit kompletter Entfernung des Modals
            document.getElementById("closeLoadModalBtn").addEventListener("click", () => {
                modal.style.opacity = "0";
                modal.style.pointerEvents = "none";
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            });
        } else {
            console.error("Ausgewählte Version nicht gefunden");
        }
    }
}




// CSS-Animationen sicherstellen
if (!document.getElementById('modalStyles')) {
    const style = document.createElement('style');
    style.id = 'modalStyles';
    style.innerHTML = `
                @keyframes fadeInUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                #confirmLoadBtn:hover {
                    background-color: rgb(33, 96, 35) !important;
                }
                #cancelLoadBtn:hover {
                    background-color: rgb(48, 87, 149) !important;
                }
                #closeLoadModalBtn:hover {
                    background-color: rgb(33, 96, 35) !important;
                }
            `;
    document.head.appendChild(style);
}













// Hilfsfunktion für Erfolgsmeldung (aktualisiert mit neuen Farben)
function showSuccessModal(message) {
    const modal = document.createElement("div");
    modal.id = "successModal";
    modal.innerHTML = `
            <div style="
                background: #ffffff;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                animation: fadeInUp 0.4s ease;
            ">
                <h2 style="margin-bottom: 10px; color: #388E3C; font-size: 26px;">Erfolgreich gespeichert!</h2>
                <p style="margin-bottom: 20px; font-size: 22px;">${message}</p>
                <button id="closeModalBtn" style="
                    background-color: #388E3C;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 22px;
                    transition: background-color 0.3s;
                ">OK</button>
            </div>
        `;

    Object.assign(modal.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: "0",
        pointerEvents: "none",
        transition: "opacity 0.3s ease",
        zIndex: "9999"
    });

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.style.opacity = "1";
        modal.style.pointerEvents = "auto";
    }, 200);

    document.getElementById("closeModalBtn").addEventListener("click", () => {
        modal.style.opacity = "0";
        modal.style.pointerEvents = "none";
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 200);
    });
}

// CSS-Animationen sicherstellen
if (!document.getElementById('modalStyles')) {
    const style = document.createElement('style');
    style.id = 'modalStyles';
    style.innerHTML = `
            @keyframes fadeInUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            #confirmLoadBtn:hover {
                background-color: #2E7D32 !important;
            }
            #cancelLoadBtn:hover {
                background-color: #3457a1 !important;
            }
            #closeModalBtn:hover {
                background-color: #2E7D32 !important;
            }
        `;
    document.head.appendChild(style);
}











function deleteSelectedSave() {
    const allSaves = JSON.parse(localStorage.getItem("saves")) || {};

    if (Object.keys(allSaves).length === 0) {
        ModalHelper.showErrorModal("Keine gespeicherten Einträge vorhanden.");
        return;
    }

    // Modal für Löschauswahl erstellen
    const deleteModal = document.createElement('div');
    deleteModal.id = "deleteSelectionModal";
    deleteModal.innerHTML = `
        <div style="
            background: white;
            padding: 25px;
            border-radius: 10px;
            max-width: 600px;
            margin: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        ">
            <!-- Close Button -->
            <button id="modalCloseBtn" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #888;
                padding: 5px 10px;
                line-height: 1;
            ">×</button>
            
            <h3 style="margin-top: 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                Versionen zum Löschen auswählen
            </h3>
            
            <div id="versionSelection" style="margin: 15px 0;">
                ${Object.keys(allSaves).map(name => `
                    <label style="display: block; padding: 8px; margin-bottom: 5px; border-radius: 4px; background: #f9f9f9;">
                        <input type="checkbox" name="versionToDelete" value="${name}" style="margin-right: 10px;">
                        ${name}
                    </label>
                `).join('')}
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <button id="selectAllVersions" style="
                    padding: 8px 12px;
                    background:rgb(185, 185, 185);
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right:11px;
                    ">Alle auswählen</button>

                                    <div style="display: flex; gap: 10px;">
                    <button id="cancelDelete" style="
                        padding: 8px 16px;
                        background:rgb(179, 179, 179);
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-left:11px;
                    ">Abbrechen</button>
                </div>

                <button id="confirmDelete" style="
                    padding: 8px 16px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">Ausgewählte löschen</button>
                

            </div>
        </div>
    `;

    // Modal-Stile
    Object.assign(deleteModal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000'
    });

    document.body.appendChild(deleteModal);

    // Event Listener für Buttons
    const closeModal = () => {
        document.body.removeChild(deleteModal);
    };

    document.getElementById('cancelDelete').addEventListener('click', closeModal);
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);

    document.getElementById('selectAllVersions').addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('input[name="versionToDelete"]');
        const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

        checkboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
        });
    });

    document.getElementById('confirmDelete').addEventListener('click', () => {
        const selectedVersions = Array.from(
            document.querySelectorAll('input[name="versionToDelete"]:checked')
        ).map(checkbox => checkbox.value);

        if (selectedVersions.length === 0) {
            ModalHelper.showErrorModal("Bitte mindestens eine Version auswählen.");
            return;
        }

        if (confirm(`Wirklich ${selectedVersions.length} Version${selectedVersions.length > 1 ? 'en' : ''} löschen?`)) {
            // Lösche die ausgewählten Versionen
            selectedVersions.forEach(version => {
                delete allSaves[version];
            });

            localStorage.setItem("saves", JSON.stringify(allSaves));

            // WICHTIG: Aktualisiere die Dropdown-Liste
            updateSaveList();

            // Schließe das Modal
            closeModal();

            // Zeige Erfolgsmeldung
            ModalHelper.showSuccessModal(
                `${selectedVersions.length} Version${selectedVersions.length > 1 ? 'en' : ''} wurden gelöscht.`
            );

            // ZUSÄTZLICH: Aktualisiere das Dropdown manuell
            const select = document.getElementById("loadSelect");
            select.innerHTML = ''; // Leere das Dropdown

            // Füge die verbleibenden Optionen hinzu
            const remainingSaves = JSON.parse(localStorage.getItem("saves")) || {};
            if (Object.keys(remainingSaves).length === 0) {
                const option = document.createElement("option");
                option.value = "";
                option.textContent = "Keine Einträge vorhanden";
                select.appendChild(option);
            } else {
                Object.keys(remainingSaves).forEach(name => {
                    const option = document.createElement("option");
                    option.value = name;
                    option.textContent = name;
                    select.appendChild(option);
                });
            }
        }
    });
}

// Event-Listener zu Buttons
document.addEventListener("DOMContentLoaded", () => {
    updateSaveList();

    const saveBtn = document.getElementById("saveButton");
    if (saveBtn) saveBtn.addEventListener("click", saveData);

    const loadBtn = document.getElementById("loadButton");
    if (loadBtn) loadBtn.addEventListener("click", loadSelectedSave);

    const deleteBtn = document.getElementById("deleteButton");
    if (deleteBtn) deleteBtn.addEventListener("click", deleteSelectedSave);

    const exportPortableBtn = document.getElementById("exportPortableBtn");
    if (exportPortableBtn) exportPortableBtn.addEventListener("click", exportPortableSave);
});


function saveMieterDaten() {
    const mieterdaten = [];

    // Alle Nachnamen-Eingabefelder (sie enthalten die Basis-ID)
    const nachnamenFelder = document.querySelectorAll('input[id^="NameEin"]');

    nachnamenFelder.forEach((nachnameInput) => {
        const idSuffix = nachnameInput.id.replace("NameEin", ""); // z. B. "02"
        const vornameInput = document.getElementById(`VornameEin${idSuffix}`);

        // Passende Telefon und E-Mail Felder aus derselben Zeile holen
        const row = nachnameInput.closest('tr');
        const telefonInput = row.querySelector('.teleinziehmieter');
        const emailInput = row.querySelector('.maileinziehmieter');

        mieterdaten.push({
            nachname: nachnameInput.value.trim(),
            vorname: vornameInput ? vornameInput.value.trim() : "",
            telefon: telefonInput ? telefonInput.value.trim() : "",
            email: emailInput ? emailInput.value.trim() : ""
        });
    });

    // 🧪 Testweise in der Konsole anzeigen:
    console.log("Einziehende Mieter:", mieterdaten);

    // Optional: Abspeichern in localStorage
    localStorage.setItem("einziehendeMieter", JSON.stringify(mieterdaten));
}


function exportPortableSave() {
    const data = getFormData();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `ExportProtokoll_${timestamp}.protokoll`;

    // Metadaten hinzufügen
    const portableData = {
        version: 1,
        created: new Date().toISOString(),
        browser: navigator.userAgent,
        data: data
    };

    const jsonText = JSON.stringify(portableData, null, 2);
    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    // Erfolgs-Modal erstellen
    const modal = document.createElement("div");
    modal.id = "successModal";
    modal.innerHTML = `
            <div style="
                background: #ffffff;
                padding: 30px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
                animation: fadeInUp 0.4s ease;
            ">
                <h2 style="margin-bottom: 20px; color: #4CAF50; font-size:26px;">Export erfolgreich!</h2>
                <button id="closeModalBtn" style="
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 20px;
                    transition: background-color 0.3s;
                ">OK</button>
            </div>
        `;
    Object.assign(modal.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: "0",
        pointerEvents: "none",
        transition: "opacity 0.3s ease",
        zIndex: "9999"
    });
    document.body.appendChild(modal);

    // Modal erst nach 1500ms sichtbar machen
    setTimeout(() => {
        modal.style.opacity = "1";
        modal.style.pointerEvents = "auto";
    }, 1000); // Geändert von 10ms auf 1500ms

    // Button schließen
    document.getElementById("closeModalBtn").addEventListener("click", () => {
        modal.style.opacity = "0";
        modal.style.pointerEvents = "none";
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });

    // kleine CSS-Animation direkt einfügen
    const style = document.createElement('style');
    style.innerHTML = `
            @keyframes fadeInUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            #closeModalBtn:hover {
                background-color: #45a049;
            }
        `;
    document.head.appendChild(style);
}













/* function importPortableSave(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const portableData = JSON.parse(e.target.result);

            // Version prüfen
            if (!portableData.version || portableData.version > 1) {
                throw new Error("Nicht unterstütztes Dateiformat");
            }

            // Daten ins Formular laden
            setFormData(portableData.data);

            // Erfolgsmeldung
            alert("Protokoll erfolgreich importiert!");

        } catch (error) {
            console.error("Import fehlgeschlagen:", error);
            alert("Fehler beim Import: " + error.message);
        }
    };

    reader.onerror = function () {
        alert("Fehler beim Lesen der Datei");
    };

    reader.readAsText(file);
} */

function importPortableSave(file) {
    const reader = new FileReader();

    // Modal erstellen
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    modal.style.pointerEvents = 'none';

    // Modal-Inhalt
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.padding = '48px';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    modalContent.style.maxWidth = '400px';
    modalContent.style.textAlign = 'center';
    modalContent.style.transform = 'translateY(-20px)';
    modalContent.style.transition = 'transform 0.3s ease';

    const modalTitle = document.createElement('h3');
    modalTitle.style.marginTop = '0';
    modalTitle.style.color = '#4CAF50';

    const modalMessage = document.createElement('p');
    modalMessage.style.marginBottom = '40px';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'OK';
    closeButton.style.padding = '26px 38px';
    closeButton.style.backgroundColor = '#4CAF50';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '24px';

    closeButton.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalMessage);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);

    reader.onload = function (e) {
        try {
            const portableData = JSON.parse(e.target.result);

            // Version prüfen
            if (!portableData.version || portableData.version > 1) {
                throw new Error("Nicht unterstütztes Dateiformat");
            }

            // Daten ins Formular laden
            setFormData(portableData.data);

            // Erfolgsmeldung im Modal anzeigen
            modalTitle.textContent = '';
            modalMessage.textContent = 'Protokoll erfolgreich importiert!';
            modalMessage.fontSize = '44px';

            document.body.appendChild(modal);

            // Animation auslösen
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.style.pointerEvents = 'auto';
                modalContent.style.transform = 'translateY(0)';
            }, 10);

        } catch (error) {
            console.error("Import fehlgeschlagen:", error);

            // Fehlermeldung im Modal anzeigen
            modalTitle.textContent = 'Fehler!';
            modalTitle.style.color = '#F44336';
            modalMessage.textContent = 'Fehler beim Import: ' + error.message;
            closeButton.style.backgroundColor = '#F44336';

            document.body.appendChild(modal);

            // Animation auslösen
            setTimeout(() => {
                modal.style.opacity = '1';
                modal.style.pointerEvents = 'auto';
                modalContent.style.transform = 'translateY(0)';
            }, 10);
        }
    };

    reader.onerror = function () {
        // Fehlermeldung im Modal anzeigen
        modalTitle.textContent = 'Fehler!';
        modalTitle.style.color = '#F44336';
        modalMessage.textContent = 'Fehler beim Lesen der Datei';
        closeButton.style.backgroundColor = '#F44336';

        document.body.appendChild(modal);

        // Animation auslösen
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.pointerEvents = 'auto';
            modalContent.style.transform = 'translateY(0)';
        }, 10);
    };

    reader.readAsText(file);
}


// Event-Handler für Datei-Upload
document.getElementById('importFileInput')?.addEventListener('change', function (e) {
    if (e.target.files.length > 0) {
        importPortableSave(e.target.files[0]);
        e.target.value = ''; // Reset für erneuten Upload
    }
});
