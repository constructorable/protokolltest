// Copyright - Oliver Acker, acker_oliver@yahoo.de
// Version 3.24_alpha

// suggestion.js

// Definiere das Array mit den Mitarbeiternamen
const mitarbeiternamen = [
    "Christian Adler",
    "Oliver Acker",
    "Manfred Launicke",
    "Claus Zechmeister",
    "Marli Smith",
    "Darius Andörfer"
];

// Definiere das Array mit den Farben
const farben = [
    "weiß",
    "beige",
    "grau",
    "hellgrau",
    "anthrazit",
    "creme",
    "elfenbein",
    "taubenblau",
    "mintgrün",
    "pastellrosa",
    "sand",
    "terrakotta",
    "olivgrün",
    "taupe",
    "vanille",
    "himmelblau",
    "lachs",
    "moosgrün",
    "zitronengelb",
    "sonstige"
];

// Definiere das Array mit den Fußbodenmaterialien
const fussbodenMaterialien = [
    "Parkett",
    "Laminat",
    "Fliesen",
    "Teppich",
    "Vinyl",
    "Betonoptik",
    "Kork",
    "Naturstein",
    "Marmor",
    "Granit",
    "Linoleum",
    "Dielen",
    "Eichenholz",
    "Bambus",
    "Terrazzo",
    "Zement",
    "Kunststoff",
    "Gummi",
    "Keramik",
    "sonstige"
];

const fussbodenFarben = [
    "braun",
    "holz",
    "hellbraun",
    "dunkelbraun",
    "natur",
    "eiche",
    "nussbaum",
    "kiefer",
    "fichte",
    "anthrazit",
    "grau",
    "schwarz",
    "bunt",
    "sonstige"
];

const stockwerke = [
    "EG rechts",
    "EG links",
    "EG mitte",
    "1. OG rechts",
    "1. OG links",
    "1. OG mitte",
    "2. OG rechts",
    "2. OG links",
    "2. OG mitte",
    "3. OG rechts",
    "3. OG links",
    "3. OG mitte",
    "4. OG rechts",
    "4. OG links",
    "4. OG mitte",
    "5. OG rechts",
    "5. OG links",
    "5. OG mitte",
    "6. OG rechts",
    "6. OG links",
    "6. OG mitte",
    "DG rechts",
    "DG links",
    "DG mitte",
    "Souterrain",
    "VH, EG rechts",
    "VH, EG links",
    "VH, EG mitte",
    "VH, 1. OG rechts",
    "VH, 1. OG links",
    "VH, 1. OG mitte",
    "VH, 2. OG rechts",
    "VH, 2. OG links",
    "VH, 2. OG mitte",
    "VH, 3. OG rechts",
    "VH, 3. OG links",
    "VH, 3. OG mitte",
    "VH, 4. OG rechts",
    "VH, 4. OG links",
    "VH, 4. OG mitte",
    "VH, 5. OG rechts",
    "VH, 5. OG links",
    "VH, 5. OG mitte",
    "VH, 6. OG rechts",
    "VH, 6. OG links",
    "VH, 6. OG mitte",
    "VH, DG rechts",
    "VH, DG links",
    "VH, DG mitte",
    "VH, Souterrain",
    "RG, EG rechts",
    "RG, EG links",
    "RG, EG mitte",
    "RG, 1. OG rechts",
    "RG, 1. OG links",
    "RG, 1. OG mitte",
    "RG, 2. OG rechts",
    "RG, 2. OG links",
    "RG, 2. OG mitte",
    "RG, 3. OG rechts",
    "RG, 3. OG links",
    "RG, 3. OG mitte",
    "RG, 4. OG rechts",
    "RG, 4. OG links",
    "RG, 4. OG mitte",
    "RG, 5. OG rechts",
    "RG, 5. OG links",
    "RG, 5. OG mitte",
    "RG, 6. OG rechts",
    "RG, 6. OG links",
    "RG, 6. OG mitte",
    "RG, DG rechts",
    "RG, DG links",
    "RG, DG mitte",
    "RG, Souterrain"
];

// Warte, bis das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", function () {
    // Funktion zum Aktualisieren der Signaturfelder
    function updateSignFields() {
        document.getElementById("strasseeinzugsign").textContent = document.getElementById("strasseeinzug").value;
        document.getElementById("lageeinzugsign").textContent = document.getElementById("lageeinzug2").value;
        document.getElementById("plzeinzugsign").textContent = document.getElementById("plzeinzug").value;
        document.getElementById("datumsign").textContent = document.getElementById("datum").value;
    }


    // Funktion, um Vorschläge basierend auf der Benutzereingabe anzuzeigen
    function showSuggestions(input, suggestionsArray, suggestionList) {
        const inputValue = input.value.toLowerCase();
        const suggestions = suggestionsArray.filter(item =>
            item.toLowerCase().startsWith(inputValue)
        );

        suggestionList.innerHTML = "";

        suggestions.forEach(item => {
            const option = document.createElement("div");
            option.textContent = item;
            option.classList.add("suggestion-item");
            option.addEventListener("click", () => {
                input.value = item; // Setze den ausgewählten Wert in das Input-Feld
                suggestionList.innerHTML = ""; // Leere die Vorschlagsliste
                updateSignFields(); // Aktualisiere die Signaturfelder SOFORT
            });
            suggestionList.appendChild(option);
        });

        if (suggestions.length > 0) {
            suggestionList.style.display = "block";
        } else {
            suggestionList.style.display = "none";
        }
    }

    // Funktion, um alle Vorschläge anzuzeigen (beim Fokus auf das Input-Feld)
    function showAllSuggestions(inputField, suggestionsArray, suggestionList) {
        suggestionList.innerHTML = "";

        suggestionsArray.forEach(item => {
            const option = document.createElement("div");
            option.textContent = item;
            option.classList.add("suggestion-item");
            option.addEventListener("click", () => {
                inputField.value = item; // Setze den ausgewählten Wert in das Input-Feld
                suggestionList.innerHTML = ""; // Leere die Vorschlagsliste
                updateSignFields(); // Aktualisiere die Signaturfelder SOFORT
            });
            suggestionList.appendChild(option);
        });

        suggestionList.style.display = "block";
    }

    // Funktion, um Event-Listener für Input-Felder zu registrieren
    function setupInputField(inputField, suggestionsArray, suggestionListId) {
        const suggestionList = document.getElementById(suggestionListId);

        // Zeige alle Vorschläge an, wenn das Input-Feld den Fokus erhält
        inputField.addEventListener("focus", function () {
            showAllSuggestions(inputField, suggestionsArray, suggestionList);
        });

        // Zeige gefilterte Vorschläge an, während der Benutzer tippt
        inputField.addEventListener("input", function (event) {
            showSuggestions(event.target, suggestionsArray, suggestionList);
        });
    }

    // Event-Listener für alle Input-Felder mit der Klasse "suggestion-input"
    document.addEventListener("input", function (event) {
        const target = event.target;
        if (target.classList.contains("suggestion-input")) {
            const suggestionListId = target.getAttribute("data-suggestion-list");
            const suggestionList = document.getElementById(suggestionListId);
            const dataType = target.getAttribute("data-type");

            let suggestionsArray = [];
            switch (dataType) {
                case "farbe":
                    suggestionsArray = farben;
                    break;
                case "mitarbeiter":
                    suggestionsArray = mitarbeiternamen;
                    break;
                case "fussboden":
                    suggestionsArray = fussbodenMaterialien;
                    break;
                case "fussboden-farbe":
                    suggestionsArray = fussbodenFarben;
                    break;
                case "stockwerk":
                    suggestionsArray = stockwerke;
                    break;
                default:
                    console.warn(`Unbekannter Datentyp: ${dataType}`);
                    return;
            }

            showSuggestions(target, suggestionsArray, suggestionList);
        }
    });


    document.addEventListener("focus", function (event) {
        const target = event.target;
        if (target.classList.contains("suggestion-input")) {
            const suggestionListId = target.getAttribute("data-suggestion-list");
            const suggestionList = document.getElementById(suggestionListId);
            const dataType = target.getAttribute("data-type");

            let suggestionsArray = [];
            switch (dataType) {
                case "farbe":
                    suggestionsArray = farben;
                    break;
                case "mitarbeiter":
                    suggestionsArray = mitarbeiternamen;
                    break;
                case "fussboden":
                    suggestionsArray = fussbodenMaterialien;
                    break;
                case "fussboden-farbe":
                    suggestionsArray = fussbodenFarben;
                    break;
                case "stockwerk":
                    suggestionsArray = stockwerke;
                    break;
                default:
                    console.warn(`Unbekannter Datentyp: ${dataType}`);
                    return;
            }

            showAllSuggestions(target, suggestionsArray, suggestionList);
        }
    }, true);


    document.addEventListener("click", function (event) {
        const target = event.target;
        // Prüfe, ob target ein Element ist und classList hat
        if (target && target.classList && !target.classList.contains("suggestion-input")) {
            document.querySelectorAll(".suggestion-list").forEach(list => {
                list.style.display = "none";
            });
        }
    });

    // Initialisiere die Signaturfelder beim Laden der Seite
    updateSignFields();
});











// Autovervollständigung für Lage der Zimmer
// Autovervollständigung für Lage der Zimmer
// Autovervollständigung für Lage der Zimmer
// suggestion.js - mit Teilstring-Matching
document.addEventListener('DOMContentLoaded', function() {
    // Observer für dynamisch hinzugefügte Elemente
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Nur Elementknoten prüfen
                    const inputs = node.querySelectorAll ? 
                        node.querySelectorAll('input[name="bezeich-lage"]') : [];
                    inputs.forEach(initAutocomplete);
                    
                    // Falls das Input-Feld selbst hinzugefügt wurde
                    if (node.tagName === 'INPUT' && node.name === 'bezeich-lage') {
                        initAutocomplete(node);
                    }
                }
            });
        });
    });

    // Observer für das gesamte Dokument starten
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Bereits vorhandene Input-Felder initialisieren
    document.querySelectorAll('input[name="bezeich-lage"]').forEach(initAutocomplete);
});

function initAutocomplete(input) {
    // Vermeide doppelte Initialisierung
    if (input.dataset.autocompleteInit) return;
    input.dataset.autocompleteInit = 'true';

    /* const suggestions = ['links', 'rechts', 'hinten']; */
    const suggestions = [
        'links',
        'rechts',
        'hinten',
        'vorne',
        'mitte',
        'links (hofseitig)',
        'rechts (hofseitig)',
        'vorne (hofseitig)',
        'hinten (hofseitig)',
        'mitte (hofseitig)',
        'links (straßenseitig)',
        'rechts (straßenseitig)',
        'vorne (straßenseitig)',
        'hinten (straßenseitig)',
        'mitte (straßenseitig)',
        'Wohnzimmer',
        'Arbeitszimmer',
        'Kinderzimmer',
        'Schlafzimmer',
        'Abstellraum',
        'Esszimmer',
        'Hobbyraum'  
    ];

    let activeIndex = -1;
    let currentSuggestions = [];

    // Erstelle Dropdown-Container
    const dropdown = document.createElement('div');
    dropdown.className = 'suggestion-dropdown';
    dropdown.style.display = 'none';
    
    // Positionierung relativ zum Input-Feld
    function positionDropdown() {
        const rect = input.getBoundingClientRect();
        dropdown.style.position = 'absolute';
        dropdown.style.left = `${rect.left + window.scrollX}px`;
        dropdown.style.top = `${rect.bottom + window.scrollY}px`;
        dropdown.style.width = `${rect.width}px`;
    }
    
    document.body.appendChild(dropdown);

    // Input Event Handler mit Teilstring-Suche
    input.addEventListener('input', function(e) {
        const value = e.target.value.toLowerCase();
        dropdown.innerHTML = '';
        activeIndex = -1;
        
        if (value.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        // Angepasste Filterung für Teilstrings
        currentSuggestions = suggestions.filter(item => 
            item.toLowerCase().includes(value)
        );

        if (currentSuggestions.length > 0) {
            positionDropdown();
            
            // Sortierung: Begriffe die mit dem Suchtext beginnen kommen zuerst
            currentSuggestions.sort((a, b) => {
                const aStartsWith = a.toLowerCase().startsWith(value) ? 0 : 1;
                const bStartsWith = b.toLowerCase().startsWith(value) ? 0 : 1;
                return aStartsWith - bStartsWith;
            });

            currentSuggestions.forEach((item, index) => {
                const suggestionItem = document.createElement('div');
                
                // Markiere den gefundenen Teilstring im Vorschlag
                const matchIndex = item.toLowerCase().indexOf(value);
                if (matchIndex >= 0) {
                    const before = item.substring(0, matchIndex);
                    const match = item.substring(matchIndex, matchIndex + value.length);
                    const after = item.substring(matchIndex + value.length);
                    
                    suggestionItem.innerHTML = `${before}${match}${after}`;
                } else {
                    suggestionItem.textContent = item;
                }
                
                suggestionItem.className = 'suggestion-item';
                suggestionItem.addEventListener('click', () => {
                    input.value = item;
                    dropdown.style.display = 'none';
                });
                dropdown.appendChild(suggestionItem);
            });
            dropdown.style.display = 'block';
        } else {
            dropdown.style.display = 'none';
        }
    });

    // Tastatursteuerung (wie zuvor)
    input.addEventListener('keydown', function(e) {
        const items = dropdown.querySelectorAll('.suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = (activeIndex + 1) % currentSuggestions.length;
            highlightItem(items, activeIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = (activeIndex - 1 + currentSuggestions.length) % currentSuggestions.length;
            highlightItem(items, activeIndex);
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            input.value = currentSuggestions[activeIndex];
            dropdown.style.display = 'none';
        } else if (e.key === 'Escape') {
            dropdown.style.display = 'none';
        }
    });

    function highlightItem(items, index) {
        items.forEach(item => item.classList.remove('highlighted'));
        if (index >= 0 && items[index]) {
            items[index].classList.add('highlighted');
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    // Verstecke Dropdown bei Klick außerhalb oder Blur
    input.addEventListener('blur', function() {
        setTimeout(() => {
            if (!dropdown.contains(document.activeElement)) {
                dropdown.style.display = 'none';
            }
        }, 200);
    });

    // CSS (wie zuvor)
    if (!document.getElementById('suggestion-styles')) {
        const style = document.createElement('style');
        style.id = 'suggestion-styles';
        style.textContent = `
            .suggestion-dropdown {
                border: 1px solid #ddd;
                background: white;
                z-index: 1000;
                max-height: 150px;
                overflow-y: auto;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .suggestion-item {
                padding: 8px 12px;
                cursor: pointer;
            }
            .suggestion-item:hover, .suggestion-item.highlighted {
                background-color: #f0f0f0;
            }

        `;
        document.head.appendChild(style);
    }
}
