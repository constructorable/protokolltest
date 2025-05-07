// Am Anfang der Datei den Import hinzufügen (falls ES6 Module verwendet werden)
// import { showEmailMenu } from './mailsend.js';

// ODER sicherstellen, dass mailsend.js vorher geladen wurde, z.B. im HTML:
// <script src="mailsend.js"></script>
// <script src="print.js"></script>

const checkboxState = storeCheckboxState();

function storeCheckboxState() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    const states = [];
    checkboxes.forEach(checkbox => {
        states.push({
            id: checkbox.id,
            checked: checkbox.checked,
            type: checkbox.type
        });
    });
    return states;
}
function restoreCheckboxState(states) {
    states.forEach(state => {
        const checkbox = document.getElementById(state.id);
        if (checkbox) {
            checkbox.checked = state.checked;
        }
    });
}
document.getElementById('savePdfButton').addEventListener('click', async function (event) {
    if (!validateStrasseeinzug()) {
        event.preventDefault();
        return;
    }
    // NEUE FUNKTION: Zeige sofort ein Hinweis-Modal an
    showPrepareModal();


    await new Promise(resolve => setTimeout(resolve, 3000));

    const bilderVorhanden = document.querySelector('.bilderzimmer')?.children.length > 0 ||
        document.querySelectorAll('[id^="large-wrapper-img"]').length > 0;
    let includeImages = false;

    if (bilderVorhanden) {
        hidePreparingModal(); // Modal ausblenden während der Benutzer auswählt
        includeImages = await showImageModal();
        if (includeImages === null) {
            return;
        }
        /* showPrepareModal(); */ // Modal wieder einblenden nach der Benutzerauswahl
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wieder ein 3-Sekunden-Delay
    }
    exportPDF(includeImages);

    function showPrepareModal() {
        const prepareModal = document.getElementById('prepareModal');
        if (!prepareModal) {
            console.error('Prepare Modal nicht gefunden');
            return;
        }
        
        // Sicherstellen, dass das Modal sichtbar ist
        prepareModal.style.display = 'flex';
        
        // Countdown starten
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            let seconds = 3;
            countdownElement.textContent = seconds.toString();
            
            const countdownInterval = setInterval(() => {
                seconds--;
                if (seconds > 0) {
                    countdownElement.textContent = seconds.toString();
                } else {
                    clearInterval(countdownInterval);
                    // Automatisch ausblenden nach Countdown
                    hidePreparingModal();
                }
            }, 1000);
        }
    }

    function hidePreparingModal() {
        console.log('Hide modal called'); // Debug
        const prepareModal = document.getElementById('prepareModal');
        if (!prepareModal) {
            console.error('Prepare Modal nicht gefunden beim Ausblenden');
            return;
        }
        
        // Sicherstellen, dass das Modal ausgeblendet wird
        prepareModal.style.display = 'none';
        console.log('Modal sollte jetzt ausgeblendet sein'); // Debug
    }







    async function exportPDF(includeImages) {
        if (exportInProgress) {
            console.log("Ein Export läuft bereits.");
            hidePreparingModal();
            return;
        }
        exportInProgress = true;
        const domChanges = prepareDOMForPDF();
        hidePreparingModal();

        const progressBarContainer = document.getElementById('progress-bar');
        progressBarContainer.style.display = 'block';

        const bar = new ProgressBar.Line(progressBarContainer, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 1400,
            color: '#FFEA82',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: { width: '100%', height: '100%' },
            text: {
                style: {
                    color: '#999',
                    position: 'absolute',
                    right: '0',
                    top: '30px',
                    padding: 0,
                    margin: 0,
                    transform: null,
                },
                autoStyleContainer: false
            },
            from: { color: '#FFEA82' },
            to: { color: '#ED6A5A' },
            step: (state, bar) => {
                bar.setText(Math.round(bar.value() * 100) + ' %');
            }
        });

        bar.animate(1.0, async function () {
            try {
                if (includeImages) {
                    await printJS({
                        printable: 'printable',
                        type: 'html',
                        style: '@page { size: auto; margin: 20mm; }',
                        targetStyles: ['*'],
                        scanStyles: false,
                    });
                } else {
                    const printableElement = document.getElementById('printable').cloneNode(true);
                    const images = printableElement.querySelectorAll('img');
                    images.forEach(img => img.remove());
                    const printContainer = document.createElement('div');
                    printContainer.appendChild(printableElement);
                    document.body.appendChild(printContainer);
                    await printJS({
                        printable: printContainer.innerHTML,
                        type: 'raw-html',
                        style: '@page { size: auto; margin: 20mm; }',
                        scanStyles: false,
                    });
                    document.body.removeChild(printContainer);
                }
            } catch (error) {
                console.error("Fehler beim PDF-Export:", error);
            } finally {
                restoreCheckboxState(checkboxState);
                progressBarContainer.style.display = 'none';
                progressBarContainer.innerHTML = '';
                exportInProgress = false;
            }
        });
    }



    function showImageModal() {
        hidePreparingModal();
        return new Promise((resolve) => {
            const modal = document.getElementById('imageModal');
            const withImagesBtn = document.getElementById('withImagesBtn');
            const withoutImagesBtn = document.getElementById('withoutImagesBtn');
            const cancelModalBtn = document.getElementById('cancelModalBtn');
            modal.style.display = 'flex';

            function closeModal() {
                modal.style.display = 'none';
                withImagesBtn.removeEventListener('click', onWithImages);
                withoutImagesBtn.removeEventListener('click', onWithoutImages);
                cancelModalBtn.removeEventListener('click', onCancel);
            }

            function onWithImages() {
                closeModal();
                resolve(true);
            }

            function onWithoutImages() {
                closeModal();
                resolve(false);
            }

            function onCancel() {
                closeModal();
                resolve(null);
            }

            withImagesBtn.addEventListener('click', onWithImages);
            withoutImagesBtn.addEventListener('click', onWithoutImages);
            cancelModalBtn.addEventListener('click', onCancel);
        });
    }

    initializeProgressBar();
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';
    const inputsWithPlaceholders = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    const originalPlaceholders = [];
    inputsWithPlaceholders.forEach(input => {
        originalPlaceholders.push({
            element: input,
            placeholder: input.getAttribute('placeholder')
        });
        input.removeAttribute('placeholder');
    });

    const closeButton = document.getElementById('closeLoadingOverlay');
    closeButton.addEventListener('click', function () {
        loadingOverlay.style.display = 'none';
    });

    const stickyContainer = document.querySelector('.sticky-container');
    if (stickyContainer) {
        stickyContainer.style.display = 'none';
    }

    const elements = {
        allgemein: document.querySelector('#zzzallgemein'),
        kueche: document.querySelector('#zzzkueche'),
        bad: document.querySelector('#zzzbad'),
        wc: document.querySelector('#zzzwc'),
        flur: document.querySelector('#zzzflur'),
        abstellraum: document.querySelector('#abstellContainer'),
        roomContainers: document.querySelectorAll('.room-container'),
        nebenraum: document.querySelector('#nebenraumContainer'),
        webem: document.querySelector('#webemContainer'),
        hptbem: document.querySelector('#hptbemContainer'),
        signtoggle: document.querySelector('#signtoggle'),
        bilderzimmer: includeImages ? document.querySelector('.bilderzimmer') : null,
        largeImages: includeImages ? document.querySelectorAll('[id^="large-wrapper-img"]') : [],
        print1: document.querySelector('#zzzprint1'),
        stammdupli: document.querySelector('.stammdupli')
    };

    if (!elements.allgemein || !elements.kueche || !elements.bad || !elements.wc || !elements.flur || !elements.abstellraum) {
        console.error("Fehler: Ein oder mehrere erforderliche Elemente wurden nicht gefunden.");
        loadingOverlay.style.display = 'none';
        if (stickyContainer) {
            stickyContainer.style.display = '';
        }
        return;
    }

    const themeElement = document.getElementById("theme-style");
    const currentTheme = themeElement.getAttribute("href");
    themeElement.setAttribute("href", "stylesprint.css");

    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => button.style.display = 'none');

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 10;
        const usableWidth = pageWidth - (2 * margin);

        async function renderElementToPDF(element, yOffset = margin) {
            try {
                if (!includeImages) {
                    element.querySelectorAll('img').forEach(img => {
                        img.style.display = 'none';
                    });
                }
                const originalStyles = {
                    animation: element.style.animation,
                    transition: element.style.transition,
                    boxShadow: element.style.boxShadow
                };
                element.style.animation = 'none';
                element.style.transition = 'none';
                element.style.boxShadow = 'none';

                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    allowTaint: true,
                    letterRendering: true
                });
                element.style.animation = originalStyles.animation;
                element.style.transition = originalStyles.transition;
                element.style.boxShadow = originalStyles.boxShadow;
                if (!includeImages) {
                    element.querySelectorAll('img').forEach(img => {
                        img.style.display = '';
                    });
                }
                const imgData = canvas.toDataURL('image/jpeg', 0.5);
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const maxPageHeight = pageHeight - 2 * margin;
                let scaledHeight = (imgHeight * usableWidth) / imgWidth;
                if (scaledHeight > maxPageHeight) {
                    const scaleFactor = maxPageHeight / scaledHeight;
                    scaledHeight *= scaleFactor;
                    const scaledWidth = usableWidth * scaleFactor;
                    pdf.addImage(
                        imgData,
                        'JPEG',
                        margin + (usableWidth - scaledWidth) / 2,
                        yOffset,
                        scaledWidth,
                        scaledHeight,
                        undefined,
                        'FAST'
                    );
                } else {
                    pdf.addImage(imgData, 'JPEG', margin, yOffset, usableWidth, scaledHeight, undefined, 'SLOW');
                }
                return yOffset + scaledHeight + margin;
            } catch (error) {
                console.warn("Fehler beim Rendern des Elements:", element, error);
                return yOffset;
            }
        }

        const totalElements = [
            elements.allgemein,
            elements.kueche,
            elements.bad,
            elements.wc,
            elements.flur,
            elements.abstellraum,
            ...elements.roomContainers,
            elements.nebenraum,
            elements.webem,
            elements.hptbem,
            elements.print1,
            elements.signtoggle,
            ...(includeImages && elements.bilderzimmer ? Array.from(elements.bilderzimmer.children) : []),
            ...(includeImages ? Array.from(elements.largeImages) : [])
        ].length;
        let currentElement = 0;

        function updateAndIncrementProgress() {
            currentElement++;
            window.updateProgress(currentElement, totalElements);
        }

        await renderElementToPDF(elements.allgemein);
        updateAndIncrementProgress();

        function isRoomIncluded(selector) {
            return !document.querySelector(selector)?.checked;
        }

        const roomsToRender = [
            { condition: isRoomIncluded('#kitch2'), element: elements.kueche },
            { condition: isRoomIncluded('#bath2'), element: elements.bad },
            { condition: isRoomIncluded('#gwc12'), element: elements.wc },
            { condition: isRoomIncluded('#difu2'), element: elements.flur },
            { condition: isRoomIncluded('#abstell2'), element: elements.abstellraum }
        ];

        for (const room of roomsToRender) {
            if (room.condition) {
                pdf.addPage();
                await renderElementToPDF(room.element);
                currentElement++;
                window.updateProgress(currentElement, totalElements);
            }
        }

        if (elements.roomContainers.length > 0) {
            for (const room of elements.roomContainers) {
                pdf.addPage();
                await renderElementToPDF(room);
                currentElement++;
                window.updateProgress(currentElement, totalElements);
            }
        }

        const neinElements = [];
        if (document.querySelector('#kitch2')?.checked) neinElements.push(elements.kueche);
        if (document.querySelector('#bath2')?.checked) neinElements.push(elements.bad);
        if (document.querySelector('#gwc12')?.checked) neinElements.push(elements.wc);
        if (document.querySelector('#difu2')?.checked) neinElements.push(elements.flur);
        if (document.querySelector('#abstell2')?.checked) neinElements.push(elements.abstellraum);

        if (neinElements.length > 0) {
            pdf.addPage();
            let yOffset = margin;
            for (const element of neinElements) {
                yOffset = await renderElementToPDF(element, yOffset);
                currentElement++;
                window.updateProgress(currentElement, totalElements);
            }
        }

        pdf.addPage();
        let yOffset = margin;
        if (elements.nebenraum) yOffset = await renderElementToPDF(elements.nebenraum, yOffset);
        if (elements.webem) yOffset = await renderElementToPDF(elements.webem, yOffset);
        if (elements.hptbem) yOffset = await renderElementToPDF(elements.hptbem, yOffset);
        currentElement++;
        window.updateProgress(currentElement, totalElements);

        pdf.addPage();
        let yOffset2 = margin;
        if (elements.print1) yOffset2 = await renderElementToPDF(elements.print1, yOffset2);
        if (elements.signtoggle) yOffset2 = await renderElementToPDF(elements.signtoggle, yOffset2);
        currentElement++;
        window.updateProgress(currentElement, totalElements);

        if (includeImages && elements.bilderzimmer) {
            const children = Array.from(elements.bilderzimmer.children);
            for (let i = 0; i < children.length; i += 2) {
                pdf.addPage();
                const firstImage = children[i];
                const secondImage = children[i + 1];
                let yOffset = margin;
                yOffset = await renderElementToPDF(firstImage, yOffset);
                currentElement++;
                window.updateProgress(currentElement, totalElements);
                if (secondImage) {
                    yOffset = await renderElementToPDF(secondImage, yOffset + 10);
                    currentElement++;
                    window.updateProgress(currentElement, totalElements);
                }
            }
        }

        if (includeImages && elements.largeImages.length > 0) {
            const largeImages = Array.from(elements.largeImages);
            for (let i = 0; i < largeImages.length; i += 2) {
                pdf.addPage();
                const firstImage = largeImages[i];
                const secondImage = largeImages[i + 1];
                let yOffset = margin;
                yOffset = await renderElementToPDF(firstImage, yOffset);
                currentElement++;
                window.updateProgress(currentElement, totalElements);
                if (secondImage) {
                    yOffset = await renderElementToPDF(secondImage, yOffset + 10);
                    currentElement++;
                    window.updateProgress(currentElement, totalElements);
                }
            }
        }

        const inputs = document.querySelectorAll("input");
        const originalHeights = [];
        inputs.forEach(input => {
            originalHeights.push(input.style.height);
            input.style.height = "24px";
        });

        function generateFileName() {
            const strasse = document.getElementById('strasseeinzug').value;
            const now = new Date();
            const datumZeit = now.toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).replace(/, /, '_').replace(/\./g, '-').replace(/:/g, '-');
            const protokollDropdown = document.getElementById('pro1');
            let protokollTyp = protokollDropdown ? protokollDropdown.value : '';
            if (!protokollTyp || protokollTyp === '-') {
                const isAbnahme = document.getElementById('abn01')?.checked || false;
                const isUebergabe = document.getElementById('ueb01')?.checked || false;
                if (isAbnahme && isUebergabe) {
                    protokollTyp = 'Abnahme- & Uebergabe';
                } else if (isAbnahme) {
                    protokollTyp = 'Abnahme';
                } else if (isUebergabe) {
                    protokollTyp = 'Uebergabe';
                }
            } else {
                switch (protokollTyp) {
                    case 'Abnahme (Auszug)':
                        protokollTyp = 'Abnahme';
                        break;
                    case 'Übergabe (Einzug)':
                        protokollTyp = 'Uebergabe';
                        break;
                    case 'Abnahme- & Übergabe (Ein- und Auszug)':
                        protokollTyp = 'Abnahme- und Uebergabe';
                        break;
                    default:
                        protokollTyp = '';
                }
            }
            const cleanStrasse = strasse.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
            const cleanProtokollTyp = protokollTyp.replace(/\s+/g, '_').replace(/[^\w\-]/g, '');
            let fileName = `${cleanStrasse}_Protokoll_${datumZeit}`;
            if (cleanProtokollTyp && cleanProtokollTyp !== '-') {
                fileName += `_${cleanProtokollTyp}`;
            }
            fileName += '.pdf';
            return fileName;
        }

        const fileName = generateFileName();
        totalPages = pdf.internal.getNumberOfPages();
        addPageNumbers(pdf, totalPages);
        pdf.save(fileName);

        function addPageNumbers(pdf, total) {
            const logoUrl = 'https://raw.githubusercontent.com/constructorable/Protokoll/refs/heads/main/Logo.JPG';
            const logoMargins = { top: 17, right: 12, bottom: 0, left: 0 };
            for (let i = 1; i <= total; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(100);
                const pageWidth = pdf.internal.pageSize.getWidth();
                pdf.text(`Seite ${i} von ${total}`, pageWidth - 20, pdf.internal.pageSize.getHeight() - 2);
                if (i === 1) {
                    const logoWidth = 40;
                    const logoHeight = 15;
                    pdf.addImage(
                        logoUrl,
                        'JPEG',
                        pageWidth - logoWidth - logoMargins.right,
                        logoMargins.top,
                        logoWidth,
                        logoHeight
                    );
                }
            }
        }

        // Hier speichern wir den Dateinamen im localStorage
        localStorage.setItem('lastGeneratedPdfName', fileName);

        const successModal = document.getElementById('sucpdf');
        if (successModal) {
            successModal.style.display = 'flex';
        }

        const closeBtn = document.getElementById('closeSuccessModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                successModal.style.display = 'none';
            });
        }


        // Hier rufen wir die Funktion aus mailsend.js auf
        try {
            // Annahme: Die Funktion heißt showEmailMenu und ist global verfügbar
            if (typeof showEmailMenu === 'function') {
                showEmailMenu(fileName);
            } else {
                console.warn("Die Funktion showEmailMenu wurde nicht gefunden.");
            }
        } catch (error) {
            console.error("Fehler beim Aufruf der Mail-Funktion:", error);
        }

    } catch (error) {
        console.error("Fehler beim Generieren des PDFs:", error);
    } finally {
        originalPlaceholders.forEach(item => {
            item.element.setAttribute('placeholder', item.placeholder);
        });
        themeElement.setAttribute("href", currentTheme);
        buttons.forEach(button => button.style.display = '');
        if (stickyContainer) stickyContainer.style.display = '';
        loadingOverlay.style.display = 'none';
    }
});
