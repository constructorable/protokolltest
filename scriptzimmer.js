/* Copyright - Oliver Acker, acker_oliver@yahoo.de
scriptzimmer.js
Version 3.34_beta */

function initializeSuggestionInputs() {
    document.querySelectorAll(".sugin").forEach(inputField => {
        const suggestionListId = inputField.getAttribute("data-sugl");
        const suggestionList = document.getElementById(suggestionListId);
        const dataType = inputField.getAttribute("data-type");

        let suggestionsArray = [];
        switch (dataType) {
            case "farbe":
                suggestionsArray = farben;
                break;
            case "mitarbeiter":
                suggestionsArray = mitarbeiternamen;
                break;
            case "fubo":
                suggestionsArray = fuboMaterialien;
                break;
            case "stockwerk":
                suggestionsArray = stockwerke;
                break;
            default:
                console.warn(`Unbekannter Datentyp: ${dataType}`);
                return;
        }

        inputField.addEventListener("input", function (event) {
            showSuggestions(event.target, suggestionsArray, suggestionList);
        });

        inputField.addEventListener("focus", function () {
            showAllSuggestions(inputField, suggestionsArray, suggestionList);
        });
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initializeSuggestionInputs();
});

let roomCount = 0;
let specialRoomCount = 7;


function getRandomLetters(length = 3) {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
}

function addRoom() {
    roomCount++;
    specialRoomCount++;
    const roomId = "zimm" + String(roomCount).padStart(2, '0');
    const roomsuf3 = getRandomLetters();
    const container = document.getElementById("room-container");
    const roomIdnumber = String(roomCount).padStart(1, '0');

    const roomDiv = document.createElement("div");
    roomDiv.classList.add("room-container");
    roomDiv.setAttribute("id", roomId);

    const table = document.createElement("table");
    table.innerHTML = `
<tr>
    <td>Bezeichnung / Lage</td>
    <td colspan="5" style="background-color:#fff;">
        <input type="text" id="dupli-lage-${roomId}" name="bezeich-lage">
    </td>
</tr>

<tr>
    <th>allgemeiner Zustand</th>
    <th>renoviert</th>
    <th>neuwertig</th>
    <th>geringe Gebrauchs - spuren</th>
    <th>stärkerer Gebrauchs - spuren</th>
    <th>nicht renoviert</th>
</tr>

<tr>
    <td></td>
    <td>
        <input type="radio" id="${roomId}-zus01" name="${roomId}-zus">
        <label for="${roomId}-zus01" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-zus02" name="${roomId}-zus">
        <label for="${roomId}-zus02" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-zus03" name="${roomId}-zus">
        <label for="${roomId}-zus03" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-zus04" name="${roomId}-zus">
        <label for="${roomId}-zus04" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-zus05" name="${roomId}-zus">
        <label for="${roomId}-zus05" class="rdl"></label>
    </td>

</tr>

<tr style="display: table-row;">
 <td colspan="6" style="border-top: 25px solid rgb(255, 255, 255);"></td>
</tr>

<tr class="trennlinie">
    <td class="keine-linie"></td>

</tr>

<tr>
    <th>Bereich</th>
    <th>in Ordnung</th>
    <th>geringe Gebrauchs - spuren</th>
    <th>repa. - bedürftig</th>
    <th>Reparatur durch den Mieter oder Vermieter</th>
    <th>nicht vor handen</th>
</tr>

<tr>
    <td>Tür / Zarge / Beschläge</td>
    <td>
        <input type="radio" id="${roomId}-tur1" name="${roomId}-tur">
        <label for="${roomId}-tur1" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-tur2" name="${roomId}-tur">
        <label for="${roomId}-tur2" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-tur3" name="${roomId}-tur00">
        <label for="${roomId}-tur3" class="rdl"></label>
    </td>
    <td><select id="pro${roomId}tuer" class="dds2">
            <option>-</option>
            <option>Mieter</option>
            <option>Vermieter</option>
            <option>in Klärung</option>
        </select></td>
    <td>
        <input type="radio" id="${roomId}-tur5" name="${roomId}-tur">
        <label for="${roomId}-tur5" class="rdl"></label>
    </td>
</tr>

<tr>
    <td>Schlüssel vorhanden</td>
                        <td colspan="2"><select id="pro${roomId}a" id="pro${roomId}key" class="dds2">
                                <option>-</option>
                                <option>ja</option>
                                <option>nein</option>
                            </select></td>
</tr>

<tr>
    <td>Fenster / Beschläge / Glas</td>
    <td>
        <input type="radio" id="${roomId}-fen1" name="${roomId}-fen">
        <label for="${roomId}-fen1" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-fen2" name="${roomId}-fen">
        <label for="${roomId}-fen2" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-fen3" name="${roomId}-fen00">
        <label for="${roomId}-fen3" class="rdl"></label>
    </td>
    <td><select id="pro${roomId}glas" class="dds2">
            <option>-</option>
            <option>Mieter</option>
            <option>Vermieter</option>
            <option>in Klärung</option>
        </select></td>
    <td>
        <input type="radio" id="${roomId}-fen5" name="${roomId}-fen">
        <label for="${roomId}-fen5" class="rdl"></label>
    </td>
</tr>

<tr>
    <td>Jalousie / Rolläden / Klappäden</td>
    <td>
        <input type="radio" id="${roomId}-rol1" name="${roomId}-rol">
        <label for="${roomId}-rol1" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-rol2" name="${roomId}-rol">
        <label for="${roomId}-rol2" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-rol3" name="${roomId}-rol00">
        <label for="${roomId}-rol3" class="rdl"></label>
    </td>
    <td><select id="pro${roomId}rol" class="dds2">
            <option>-</option>
            <option>Mieter</option>
            <option>Vermieter</option>
            <option>in Klärung</option>
        </select></td>
    <td>
        <input type="radio" id="${roomId}-rol5" name="${roomId}-rol">
        <label for="${roomId}-rol5" class="rdl"></label>
    </td>
</tr>

<tr>
    <td>Decke</td>
    <td>
        <input type="radio" id="${roomId}-dec1" name="${roomId}-dec">
        <label for="${roomId}-dec1" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-dec2" name="${roomId}-dec">
        <label for="${roomId}-dec2" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-dec3" name="${roomId}-dec00">
        <label for="${roomId}-dec3" class="rdl"></label>
    </td>
    <td><select id="pro${roomId}dec" class="dds2">
            <option>-</option>
            <option>Mieter</option>
            <option>Vermieter</option>
            <option>in Klärung</option>
        </select></td>
    <td>
        <input type="radio" id="${roomId}-dec5" name="${roomId}-dec">
        <label for="${roomId}-dec5" class="rdl"></label>
    </td>
</tr>

<tr>
    <td>Wände / Tapeten</td>
    <td>
        <input type="radio" id="${roomId}-wan1" name="${roomId}-wan">
        <label for="${roomId}-wan1" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-wan2" name="${roomId}-wan">
        <label for="${roomId}-wan2" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-wan3" name="${roomId}-wan00">
        <label for="${roomId}-wan3" class="rdl"></label>
    </td>
    <td><select id="pro${roomId}wand" class="dds2">
            <option>-</option>
            <option>Mieter</option>
            <option>Vermieter</option>
            <option>in Klärung</option>
        </select></td>
    <td>
        <input type="radio" id="${roomId}-wan5" name="${roomId}-wan">
        <label for="${roomId}-wan5" class="rdl"></label>
    </td>
</tr>

<tr>
    <td>Farbe der Wände</td>
    <td colspan="5">
        <input id="farin${specialRoomCount}" type="text" name="farbe"
            class="tez lain atsc sugin" style="width: 350px;" data-type="farbe"
            data-sugl="fsug${specialRoomCount}">
        <div id="fsug${specialRoomCount}" class="sugl"></div>
    </td>
</tr>

<tr>
    <td style="padding-bottom: 20px; padding-top:20px">Heizkörper / Ventile / Rohre</td>
    <td>
        <input type="radio" id="${roomId}-heik1" name="${roomId}-heik">
        <label for="${roomId}-heik1" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-heik2" name="${roomId}-heik">
        <label for="${roomId}-heik2" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-heik3" name="${roomId}-heik00">
        <label for="${roomId}-heik3" class="rdl"></label>
    </td>
    <td><select id="pro${roomId}farb" class="dds2">
            <option>-</option>
            <option>Mieter</option>
            <option>Vermieter</option>
            <option>in Klärung</option>
        </select></td>
    <td>
        <input type="radio" id="${roomId}-heik5" name="${roomId}-heik">
        <label for="${roomId}-heik5" class="rdl"></label>
    </td>
</tr>

<tr>
    <td>Fußboden Material</td>
    <td colspan="5">
        <input id="fuboin${specialRoomCount}" type="text" name="fubo"
            class="tez lain atsc sugin" style="width: 350px;" data-type="fubo"
            data-sugl="fusug${specialRoomCount}">
        <div id="fusug${specialRoomCount}" class="sugl"></div>
    </td>
</tr>

<tr>
    <td>Fußboden / Leisten</td>
    <td>
        <input type="radio" id="${roomId}-fubo1" name="${roomId}-fubo">
        <label for="${roomId}-fubo1" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-fubo2" name="${roomId}-fubo">
        <label for="${roomId}-fubo2" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-fubo3" name="${roomId}-fubo00">
        <label for="${roomId}-fubo3" class="rdl"></label>
    </td>
    <td><select id="pro${roomId}fussb" class="dds2">
            <option>-</option>
            <option>Mieter</option>
            <option>Vermieter</option>
            <option>in Klärung</option>
        </select></td>
    <td>
        <input type="radio" id="${roomId}-fubo5" name="${roomId}-fubo">
        <label for="${roomId}-fubo5" class="rdl"></label>
    </td>
</tr>

<tr>
    <td style="padding-bottom: 20px; padding-top:20px">Radio- / Fernseh- / Internetdose</td>
    <td>
        <input type="radio" id="${roomId}-internet1" name="${roomId}-internet">
        <label for="${roomId}-internet1" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-internet2" name="${roomId}-internet">
        <label for="${roomId}-internet2" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-internet3" name="${roomId}-internet00">
        <label for="${roomId}-internet3" class="rdl"></label>
    </td>
    <td><select id="pro${roomId}fuss2" class="dds2">
            <option>-</option>
            <option>Mieter</option>
            <option>Vermieter</option>
            <option>in Klärung</option>
        </select></td>
    <td>
        <input type="radio" id="${roomId}-internet5" name="${roomId}-internet">
        <label for="${roomId}-internet5" class="rdl"></label>
    </td>
</tr>

<tr>

<tr>
    <td style="padding-bottom: 20px;">Steckdosen / Lichtschalter</td>
    <td>
        <input type="radio" id="${roomId}-etk1" name="${roomId}-etk">
        <label for="${roomId}-etk1" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-etk2" name="${roomId}-etk">
        <label for="${roomId}-etk2" class="rdl"></label>
    </td>
    <td>
        <input type="radio" id="${roomId}-etk3" name="${roomId}-etk00">
        <label for="${roomId}-etk3" class="rdl"></label>
    </td>
    <td><select id="pro${roomId}dose" class="dds2">
            <option>-</option>
            <option>Mieter</option>
            <option>Vermieter</option>
            <option>in Klärung</option>
        </select></td>
    <td>
        <input type="radio" id="${roomId}-etk5" name="${roomId}-etk">
        <label for="${roomId}-etk5" class="rdl"></label>
    </td>
</tr>

<tr>

<tr>
    <td class="rwm-label">Anzahl der Rauchwarnmelder</td>
    <td colspan="4" class="rwmin">
        <input type="number" id="rwmc${roomId}" name="rwmc" min="1" class="rwminp">
    </td>
</tr>

<tr>
    <td colspan="6" style="vertical-align: top; font-weight:600; padding-top:15px;">Bemerkungen zu Zimmer
        ${roomIdnumber}:</td>
</tr>
    `;

    const mainButtonContainer = document.createElement("div");
    mainButtonContainer.classList.add("main-button-container");

    const mainButton = document.createElement("button");
    mainButton.classList.add("main-upload-button");
    mainButton.innerHTML = "+ Bilder hinzufügen (Zimmer " + roomCount + ")";

    const choiceMenu = document.createElement("div");
    choiceMenu.classList.add("choice-menu");
    choiceMenu.style.display = "none";

    const cameraChoice = document.createElement("label");
    cameraChoice.setAttribute("for", `camera-${roomId}`);
    cameraChoice.classList.add("menu-choice");
    cameraChoice.innerHTML = "📷 Kamera verwenden";

    const cameraInput = document.createElement("input");
    cameraInput.type = "file";
    cameraInput.accept = "image/*";
    cameraInput.id = `camera-${roomId}`;
    cameraInput.hidden = true;
    cameraInput.setAttribute("capture", "environment");

    const fileChoice = document.createElement("label");
    fileChoice.setAttribute("for", `file-${roomId}`);
    fileChoice.classList.add("menu-choice");
    fileChoice.innerHTML = "📁 Dateien auswählen";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.multiple = true;
    fileInput.id = `file-${roomId}`;
    fileInput.hidden = true;

    mainButton.addEventListener("click", function (e) {
        e.stopPropagation();
        choiceMenu.style.display = choiceMenu.style.display === "none" ? "block" : "none";
    });

    document.addEventListener("click", function () {
        choiceMenu.style.display = "none";
    });

    const handleUpload = (event) => {
        choiceMenu.style.display = "none";
        handleFileUpload(event, roomId);
    };

    cameraInput.addEventListener("change", handleUpload);
    fileInput.addEventListener("change", handleUpload);

    choiceMenu.appendChild(cameraChoice);
    choiceMenu.appendChild(cameraInput);
    choiceMenu.appendChild(fileChoice);
    choiceMenu.appendChild(fileInput);

    mainButtonContainer.appendChild(mainButton);
    mainButtonContainer.appendChild(choiceMenu);




    /*     const roomTitle = document.createElement("h3");
        roomTitle.textContent = "Zimmer " + roomCount;
    
        const remarkSection = document.createElement("div");
        remarkSection.classList.add("remark-row");
        remarkSection.innerHTML = `
            <input type="text" name="remark" id="dupli${roomId}-zeile1" class="atsc" placeholder=""> 
        `; */

    const roomTitle = document.createElement("h3");
    roomTitle.textContent = "Zimmer " + roomCount;

    const remarkSection = document.createElement("div");
    remarkSection.classList.add("remark-row");

    // Container für Input + Button erstellen
    const inputContainer = document.createElement("div");
    inputContainer.style.position = "relative";
    inputContainer.style.display = "inline-block";
    inputContainer.style.width = "100%";

    // Input-Feld erstellen
    const remarkInput = document.createElement("input");
    remarkInput.type = "text";
    remarkInput.name = "remark";
    remarkInput.id = `dupli${roomId}-zeile1`;
    remarkInput.classList.add("atsc");
    remarkInput.placeholder = "";
    remarkInput.style.paddingRight = "35px"; // Platz für den Button

    // Löschbutton erstellen
    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
             style="color: #777; transition: opacity 0.2s;"
             onmouseover="this.style.color='#333'" onmouseout="this.style.color='#777'">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
    `;
    clearButton.title = "Text löschen";
    clearButton.style.position = "absolute";
    clearButton.style.right = "18px";
    clearButton.style.top = "50%";
    clearButton.style.transform = "translateY(-50%)";
    clearButton.style.background = "none";
    clearButton.style.border = "none";
    clearButton.style.cursor = "pointer";
    clearButton.style.padding = "0";

    // Click-Event für den Button
    clearButton.addEventListener("click", function () {
        remarkInput.value = "";
    });

    // Elemente zusammenbauen
    inputContainer.appendChild(remarkInput);
    inputContainer.appendChild(clearButton);
    remarkSection.appendChild(inputContainer);



    const addRemarkButton = document.createElement("button");
    addRemarkButton.classList.add("add-remark-btn");
    addRemarkButton.textContent = "+";
    addRemarkButton.onclick = function () { addRemark(roomDiv); };

    roomDiv.appendChild(roomTitle);
    roomDiv.appendChild(table);
    roomDiv.appendChild(remarkSection);
    roomDiv.appendChild(addRemarkButton);
    roomDiv.appendChild(mainButtonContainer);

    const imageSection = document.createElement("div");
    imageSection.classList.add("image-preview");

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    imageContainer.id = `preview-${roomId}`;

    imageSection.appendChild(imageContainer);
    roomDiv.appendChild(imageSection);
    container.appendChild(roomDiv);
}

/* function addRemark(roomDiv) {
    const newRemarkRow = document.createElement("div");
    newRemarkRow.classList.add("remark-row");
    newRemarkRow.innerHTML = `
        <input type="text" name="remark" class="atsc" placeholder="">
    `;

    roomDiv.insertBefore(newRemarkRow, roomDiv.querySelector('button.add-remark-btn'));
} */












/* function addRemark(roomDiv) {
    const newRemarkRow = document.createElement("div");
    newRemarkRow.classList.add("remark-row");

    // Hole die Raum-ID, z. B. "zimm01"
    const roomId = roomDiv.id;

    // Finde bereits vorhandene Zeilen für diesen Raum
    const existingInputs = roomDiv.querySelectorAll(`input[id^="dupli${roomId}-zeile"]`);

    // Neue Zeilennummer (beginnt bei 2)
    const newLineNumber = existingInputs.length + 2; // erste Zeile wäre 2, danach 3 usw.

    // Neue eindeutige ID
    const newId = `dupli${roomId}-zeile${newLineNumber}`;

    newRemarkRow.innerHTML = `
            <input type="text" id="${newId}" name="remark" class="atsc dupli" placeholder="">
        `;

    // Neue Bemerkungszeile vor dem "Hinzufügen"-Button einfügen
    const addButton = roomDiv.querySelector('button.add-remark-btn');
    roomDiv.insertBefore(newRemarkRow, addButton);
}
 */

function addRemark(roomDiv) {
    const newRemarkRow = document.createElement("div");
    newRemarkRow.classList.add("remark-row");

    // Hole die Raum-ID, z.B. "zimm01"
    const roomId = roomDiv.id;

    // Finde bereits vorhandene Zeilen für diesen Raum
    const existingInputs = roomDiv.querySelectorAll(`input[id^="dupli${roomId}-zeile"]`);

    // Neue Zeilennummer (beginnt bei 2)
    const newLineNumber = existingInputs.length + 2; // erste Zeile wäre 2, danach 3 usw.

    // Neue eindeutige ID
    const newId = `dupli${roomId}-zeile${newLineNumber}`;

    // Container für Input + Button
    const inputContainer = document.createElement("div");
    inputContainer.style.position = "relative";
    inputContainer.style.display = "inline-block";
    inputContainer.style.width = "100%";

    // Input-Feld erstellen
    const remarkInput = document.createElement("input");
    remarkInput.type = "text";
    remarkInput.id = newId;
    remarkInput.name = "remark";
    remarkInput.classList.add("atsc", "dupli");
    remarkInput.placeholder = "";
    remarkInput.style.paddingRight = "35px";
    remarkInput.style.width = "100%";

    // Löschbutton erstellen
    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" 
             style="color:#777;transition:all 0.2s" onmouseover="this.style.color='#333'">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2.2"/>
        </svg>
    `;
    clearButton.title = "Text löschen";
    Object.assign(clearButton.style, {
        position: "absolute",
        right: "8px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0"
    });

    // Click-Handler für den Button
    clearButton.addEventListener("click", function() {
        remarkInput.value = "";
    });

    // Elemente zusammenbauen
    inputContainer.appendChild(remarkInput);
    inputContainer.appendChild(clearButton);
    newRemarkRow.appendChild(inputContainer);

    // Neue Bemerkungszeile vor dem "Hinzufügen"-Button einfügen
    const addButton = roomDiv.querySelector('button.add-remark-btn');
    roomDiv.insertBefore(newRemarkRow, addButton);
}














async function compressImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Maximale Größe für Komprimierung
                const maxWidth = 3000;
                const maxHeight = 3000;
                let width = img.width;
                let height = img.height;

                // Skalieren wenn nötig
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = width * ratio;
                    height = height * ratio;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // Qualität auf 70% reduzieren
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    }));
                }, 'image/jpeg', 0.7);
            };
        };
        reader.readAsDataURL(file);
    });
}

async function handleFileUpload(event, roomId) {
    const previewDiv = document.getElementById("preview-" + roomId);

    let largeRoomImages = document.getElementById("large-preview-" + roomId);
    if (!largeRoomImages) {
        const largeImageContainer = document.getElementById("large-images-container");
        const largeRoomTitle = document.createElement("h3");
        largeRoomTitle.textContent = "Zimmer " + roomCount;
        largeImageContainer.appendChild(largeRoomTitle);

        largeRoomImages = document.createElement("div");
        largeRoomImages.classList.add("large-image-container");
        largeRoomImages.setAttribute("id", "large-preview-" + roomId);
        largeImageContainer.appendChild(largeRoomImages);
    }

    const files = event.target.files;
    for (let file of files) {
        try {
            // Bild komprimieren
            const compressedFile = await compressImage(file);
            const imgUrl = URL.createObjectURL(compressedFile);
            const imgId = "img-" + roomId + "-" + Math.random().toString(36).substr(2, 9);

            // Vorschaubild erstellen
            const smallImageWrapper = document.createElement("div");
            smallImageWrapper.setAttribute("id", "wrapper-" + imgId);
            smallImageWrapper.classList.add("image-wrapper");

            const imgSmall = document.createElement("img");
            imgSmall.setAttribute("src", imgUrl);
            imgSmall.style.maxWidth = "100px";
            imgSmall.style.maxHeight = "100px";

            const deleteBtnSmall = document.createElement("button");
            deleteBtnSmall.textContent = "X";
            deleteBtnSmall.classList.add("delete-btn");
            deleteBtnSmall.onclick = function () {
                deleteImage(imgId, imgUrl);
            };

            smallImageWrapper.appendChild(imgSmall);
            smallImageWrapper.appendChild(deleteBtnSmall);
            previewDiv.appendChild(smallImageWrapper);

            // Großes Bild erstellen
            const imageWrapper = document.createElement("div");
            imageWrapper.classList.add("large-image-wrapper");
            imageWrapper.setAttribute("id", "large-wrapper-" + imgId);

            const label = document.createElement("p");
            label.textContent = "Zimmer " + roomCount;

            const imgLarge = document.createElement("img");
            imgLarge.setAttribute("src", imgUrl);
            imgLarge.style.maxHeight = "600px";
            imgLarge.style.width = "auto";

            const deleteBtnLarge = document.createElement("button");
            deleteBtnLarge.textContent = "X";
            deleteBtnLarge.classList.add("delete-btn");
            deleteBtnLarge.onclick = function () {
                deleteImage(imgId, imgUrl);
            };

            imageWrapper.appendChild(label);
            imageWrapper.appendChild(imgLarge);
            imageWrapper.appendChild(deleteBtnLarge);
            largeRoomImages.appendChild(imageWrapper);

        } catch (error) {
            console.error("Fehler bei der Bildverarbeitung:", error);
            // Fallback: Originalbild verwenden
            const imgUrl = URL.createObjectURL(file);
            const imgId = "img-" + roomId + "-" + Math.random().toString(36).substr(2, 9);

            // ... (Original-Code für Bildanzeige hier einfügen)
        }
    }
}

function deleteImage(imgId, imgUrl) {
    const smallImageWrapper = document.getElementById("wrapper-" + imgId);
    const largeImageWrapper = document.getElementById("large-wrapper-" + imgId);

    if (smallImageWrapper) smallImageWrapper.remove();
    if (largeImageWrapper) largeImageWrapper.remove();

    URL.revokeObjectURL(imgUrl);
}
