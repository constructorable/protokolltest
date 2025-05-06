/* Copyright - Oliver Acker, acker_oliver@yahoo.de
mailsend.js
Version 3.34_beta */

function sendEmail(fileName, emails, client) {

    const objekt = document.getElementById('strasseeinzug').value;
    const lage = document.getElementById('lageeinzug2').value;
    const plzOrt = document.getElementById('plzeinzug').value;
    const datum = document.getElementById('datum').value;
    const mietid = document.getElementById('mieterid').value;

    const protokollSelect = document.getElementById('protokollart1');
    let protokollTyp = "";


    switch(protokollSelect.value) {
        case "Abnahmeprotokoll (Mieterauszug)":
            protokollTyp = "Abnahmeprotokoll";
            break;
        case "Übergabeprotokoll (Mieterinzug)":
            protokollTyp = "Übergabeprotokoll";
            break;
        case "Abnahme- & Übergabeprotokoll (Ein- und Auszug)":
            protokollTyp = "Abnahme- und Übergabeprotokoll";
            break;
        default:
            protokollTyp = "Protokoll"; // Fallback für Option "-"
    }


    const subject = encodeURIComponent(
        `${objekt}, ${lage} - ${protokollTyp} / ${mietid}`
    );



    const body = encodeURIComponent(
        `Sehr geehrte Damen und Herren,\n` +
        `anbei erhalten Sie das erstellte Dokument (${protokollTyp}).\n\n` +
        `Objekt / Straße: ${objekt}\n` +
        `PLZ / Ort: ${plzOrt}\n` +
        `Lage / Stockwerk: ${lage}\n` +
        `Mieternummer: ${mietid}\n` +
        `Datum: ${datum}\n\n` +
        `Mit freundlichen Grüßen\n\n` +
        `Sauer Immobilien GmbH\n\n` +
        `Königstr. 25- 27\n\n` +
        `90402 Nürnberg\n\n` +
        `Tel.: 0911 / 21491-0\n\n` +
        `E-Mail: hausverwaltung@sauer-immobilien.de`
    );


    const emailList = emails.join(',');
    const ccEmail = "hausverwaltung@sauer-immobilien.de";

    let mailtoLink;
    switch (client) {
        case 'gmail':
            mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailList}&cc=${ccEmail}&su=${subject}&body=${body}`;
            break;
        default:
            mailtoLink = `mailto:${emailList}?cc=${ccEmail}&subject=${subject}&body=${body}`;
            break;
    }


    window.open(mailtoLink, '_blank');




    if (navigator.clipboard) {
        navigator.clipboard.writeText(emailList).then(() => {
            console.log("E-Mail-Adresse(n) in den Zwischenspeicher kopiert.");
        }).catch(err => {
            console.error("Fehler beim Kopieren in den Zwischenspeicher:", err);
        });
    } else {
        console.warn("Zwischenspeicher-API nicht verfügbar. E-Mail-Adresse(n) können nicht kopiert werden.");
    }
}


function showEmailMenu(fileName) {
    let validEmails = findValidEmails();

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'emailMenuOverlay';
    document.body.appendChild(overlay);

    // Modal mit deutlich sichtbarem Close-Button
    const emailMenu = document.createElement('div');
    emailMenu.id = 'emailMenu';
    emailMenu.innerHTML = `
        <button id="closeModal" style="
position: absolute;
  top: -11px;
  right: 15px;
  background: #fff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow: none;
  border: none;
  color: #bababa;
  font-weight: 200;
  font-size: 33px;
}
        ">×</button>
        <div style="padding-top: 20px;">
            <div class="pdf-hinweis">
                Hinweis: Bitte PDF-Datei manuell im E-Mail-Client anhängen
            </div>
            <h3>gültige E-Mail-Adressen:</h3>
            <ul>
                ${validEmails.map(email => `<li>${email}</li>`).join('')}
            </ul>
            <div style="margin-top: 20px;">
                <button id="defaultMailClient">E-Mail öffnen</button>
                <button id="cancel">← zurück</button>
            </div>
        </div>
    `;

    document.body.appendChild(emailMenu);

    // Close-Button Event
    document.getElementById('closeModal').addEventListener('click', closeEmailMenu);
    
    // Bestehende Events
    document.getElementById('defaultMailClient').addEventListener('click', () => {
        sendEmail(fileName, validEmails, 'default');
        closeEmailMenu();
    });
    document.getElementById('cancel').addEventListener('click', closeEmailMenu);
    
    // Overlay schließt Modal bei Klick
    overlay.addEventListener('click', closeEmailMenu);
}


function closeEmailMenu() {
    const emailMenu = document.getElementById('emailMenu');
    const overlay = document.getElementById('emailMenuOverlay');
    if (emailMenu) emailMenu.remove();
    if (overlay) overlay.remove();
}


function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


function findValidEmails() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const validEmails = [];

    emailInputs.forEach(input => {
        const email = input.value.trim();
        if (validateEmail(email)) {
            validEmails.push(email);
        }
    });

    return validEmails;
}


const style = document.createElement('style');
style.textContent = `
    #emailMenu {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1001;
        width: 80%;
        max-width: 500px;
    }
    
    .modal-header {
        display: flex;
        justify-content: flex-end;
    }
    
    .close-button {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        padding: 0 10px;
    }
    
    .modal-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
    
    #emailMenuOverlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 1000;
    }
`;
document.head.appendChild(style);
document.getElementById('sendEmailButton').addEventListener('click', function () {
    const fileName = localStorage.getItem('lastGeneratedPdfName');
    showEmailMenu(fileName);
});
