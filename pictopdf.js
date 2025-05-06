/* Copyright - Oliver Acker, acker_oliver@yahoo.de
pictopdf.js
Version 3.4_turbo */

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('pictopdfButton').addEventListener('click', async function () {
        const qualityDialog = createQualityDialog();
        document.body.appendChild(qualityDialog);

        setTimeout(() => {
            qualityDialog.style.opacity = '1';
            qualityDialog.style.pointerEvents = 'auto';
            qualityDialog.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);
    });

    function createQualityDialog() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none'
        });

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        Object.assign(modalContent.style, {
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            width: '90%',
            textAlign: 'center',
            transform: 'translateY(-20px)',
            transition: 'transform 0.3s ease'
        });

        const titleText = document.createElement('h2');
        titleText.textContent = 'PDF Qualität wählen';
        Object.assign(titleText.style, {
            marginTop: '0',
            color: '#333',
            fontSize: '26px',
            fontFamily: 'sans-serif'
        });

        const qualityOptions = [
            { value: 'low', label: 'Geringe Qualität (kleinere Dateigröße)', jpegQuality: 0.5, scale: 1.5, turbo: true },
            { value: 'medium', label: 'Mittlere Qualität (empfohlen)', jpegQuality: 0.6, scale: 2, turbo: false },
            { value: 'high', label: 'Hohe Qualität (größere Dateigröße)', jpegQuality: 0.75, scale: 4, turbo: false }
        ];

        let selectedQuality = qualityOptions[1];

        const radioContainer = document.createElement('div');
        Object.assign(radioContainer.style, {
            margin: '20px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
        });

        qualityOptions.forEach(option => {
            const optionContainer = document.createElement('label');
            optionContainer.htmlFor = `quality-${option.value}`;
            optionContainer.className = 'modalpic-option';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'pdfQuality';
            radio.id = `quality-${option.value}`;
            radio.value = option.value;
            radio.style.display = 'none';
            if (option.value === 'medium') radio.checked = true;

            const customCheckbox = document.createElement('div');
            Object.assign(customCheckbox.style, {
                width: '20px',
                height: '20px',
                border: '2px solid #4CAF50',
                borderRadius: '50%',
                marginRight: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s, border-color 0.2s'
            });

            const innerDot = document.createElement('div');
            Object.assign(innerDot.style, {
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                opacity: radio.checked ? '1' : '0',
                transition: 'opacity 0.2s'
            });
            customCheckbox.appendChild(innerDot);

            const labelText = document.createElement('span');
            labelText.textContent = option.label;
            Object.assign(labelText.style, {
                flex: '1',
                textAlign: 'left',
                fontFamily: 'sans-serif'
            });

            radio.addEventListener('change', () => {
                if (radio.checked) {
                    selectedQuality = option;
                    document.querySelectorAll('input[name="pdfQuality"]').forEach(input => {
                        const parent = input.closest('label');
                        if (parent) {
                            parent.style.borderColor = '#ccc';
                            const dot = parent.querySelector('div > div');
                            if (dot) dot.style.opacity = '0';
                        }
                    });
                    optionContainer.style.borderColor = '#4CAF50';
                    innerDot.style.opacity = '1';
                }
            });

            optionContainer.appendChild(radio);
            optionContainer.appendChild(customCheckbox);
            optionContainer.appendChild(labelText);
            radioContainer.appendChild(optionContainer);
        });

        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, {
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '10px'
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Abbrechen';
        cancelButton.className = 'modalpic01';

        cancelButton.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'PDF erstellen';
        confirmButton.className = 'modalpic02';

        confirmButton.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                createPDF(selectedQuality);
            }, 300);
        });

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(confirmButton);

        modalContent.appendChild(titleText);
        modalContent.appendChild(radioContainer);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);

        return modal;
    }

    async function createPDF(qualitySettings) {
        const progressData = createProgressModal();
        const progressModal = progressData.modal;
        const timeElapsedText = progressData.timeElapsedText;
        document.body.appendChild(progressModal);

        const startTime = Date.now();
        let timerInterval = setInterval(() => {
            const secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
            timeElapsedText.textContent = `${secondsElapsed} Sekunden vergangen`;
        }, 1000);

        setTimeout(() => {
            progressModal.style.opacity = '1';
            progressModal.style.pointerEvents = 'auto';
            progressModal.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);

        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 10;
            const usableWidth = pageWidth - (2 * margin);
            const maxPageHeight = pageHeight - 2 * margin;

            const progressBar = progressModal.querySelector('.progress-bar');
            const progressText = progressModal.querySelector('.progress-text');

            // Turbo-Modus Funktionen
            async function turboRender(element) {
                const canvas = await html2canvas(element, {
                    scale: qualitySettings.scale * (qualitySettings.turbo ? 0.8 : 1),
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    ignoreElements: el => el.style.display === 'none' || el.style.opacity === '0',
                    backgroundColor: '#FFFFFF',
                    removeContainer: true
                });
                return canvas;
            }

            async function processImageBatch(batch, batchIndex, totalBatches) {
                const canvases = await Promise.all(batch.map(element => turboRender(element)));
                
                canvases.forEach((canvas, index) => {
                    const imgData = canvas.toDataURL('image/jpeg', qualitySettings.jpegQuality);
                    const imgWidth = canvas.width;
                    const imgHeight = canvas.height;
                    let scaledHeight = (imgHeight * usableWidth) / imgWidth;

                    if (batchIndex === 0 && index === 0) {
                        // Erste Seite
                    } else {
                        pdf.addPage();
                    }

                    if (scaledHeight > maxPageHeight) {
                        const scaleFactor = maxPageHeight / scaledHeight;
                        const scaledWidth = usableWidth * scaleFactor;
                        scaledHeight = maxPageHeight;
                        pdf.addImage(imgData, 'JPEG',
                            margin + (usableWidth - scaledWidth) / 2,
                            margin,
                            scaledWidth,
                            scaledHeight,
                            undefined,
                            qualitySettings.turbo ? 'FAST' : 'SLOW'
                        );
                    } else {
                        pdf.addImage(imgData, 'JPEG',
                            margin,
                            margin,
                            usableWidth,
                            scaledHeight,
                            undefined,
                            qualitySettings.turbo ? 'FAST' : 'SLOW'
                        );
                    }

                    // Memory freigeben
                    canvas.width = 1;
                    canvas.height = 1;
                });
            }

            // Bilder sammeln
            const bilderZimmer = document.querySelector('.bilderzimmer');
            const largeImages = document.querySelectorAll('[id^="large-wrapper-img"]');
            const bilder = [];

            if (bilderZimmer) {
                bilder.push(...bilderZimmer.children);
            }
            if (largeImages.length > 0) {
                bilder.push(...largeImages);
            }

            // Batch-Verarbeitung
            const BATCH_SIZE = qualitySettings.turbo ? 4 : 1;
            let processedCount = 0;

            for (let i = 0; i < bilder.length; i += BATCH_SIZE) {
                const batch = bilder.slice(i, i + BATCH_SIZE);
                await processImageBatch(batch, i, bilder.length);
                
                processedCount += batch.length;
                const percent = Math.round((processedCount / bilder.length) * 100);
                progressBar.style.width = percent + '%';
                progressText.textContent = `${processedCount} von ${bilder.length} Bildern verarbeitet (${percent} %)`;

                // Event Loop nicht blockieren
                if (i % (BATCH_SIZE * 2) === 0) {
                    await new Promise(resolve => setTimeout(resolve, 0));
                }
            }

            // Dateiname generieren
            const strasseInput = document.getElementById('strasseeinzug');
            const strasse = strasseInput ? strasseInput.value.trim() : 'Unbekannte_Straße';

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

            let protokollTyp = '';
            const isAbnahme = document.getElementById('abnahme')?.checked;
            const isUebergabe = document.getElementById('uebergabe')?.checked;

            if (isAbnahme && isUebergabe) {
                protokollTyp = 'Abnahme- und Übergabeprotokoll';
            } else if (isAbnahme) {
                protokollTyp = 'Abnahmeprotokoll';
            } else if (isUebergabe) {
                protokollTyp = 'Übergabeprotokoll';
            } else {
                protokollTyp = 'Protokoll';
            }

            const fileName = `${strasse}_Bilder_${protokollTyp}_${datumZeit}.pdf`.replace(/\s+/g, '_');

            pdf.save(fileName);
            clearInterval(timerInterval);

            progressModal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(progressModal);
            }, 300);

            const successModal = createSuccessModal();
            document.body.appendChild(successModal);

            setTimeout(() => {
                successModal.style.opacity = '1';
                successModal.style.pointerEvents = 'auto';
                successModal.querySelector('.modal-content').style.transform = 'translateY(0)';
            }, 10);

        } catch (error) {
            console.error("Fehler beim PDF-Erstellen:", error);
            clearInterval(timerInterval);

            const errorModal = createErrorModal(error.message);
            document.body.appendChild(errorModal);

            setTimeout(() => {
                errorModal.style.opacity = '1';
                errorModal.style.pointerEvents = 'auto';
                errorModal.querySelector('.modal-content').style.transform = 'translateY(0)';
            }, 10);
        }
    }

    function createProgressModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
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
    
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '2rem';
        modalContent.style.borderRadius = '8px';
        modalContent.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        modalContent.style.maxWidth = '600px';
        modalContent.style.width = '90%';
        modalContent.style.textAlign = 'center';
        modalContent.style.transform = 'translateY(-20px)';
        modalContent.style.transition = 'transform 0.3s ease';
    
        const titleText = document.createElement('h2');
        titleText.textContent = 'Bilder werden als PDF erstellt...';
        titleText.style.marginTop = '0';
        titleText.style.color = '#4CAF50';
        titleText.style.fontSize = '24px';
        titleText.style.fontFamily = 'sans-serif';
    
        const progressOuter = document.createElement('div');
        progressOuter.style.width = '100%';
        progressOuter.style.height = '20px';
        progressOuter.style.backgroundColor = '#eee';
        progressOuter.style.borderRadius = '10px';
        progressOuter.style.margin = '20px 0';
        progressOuter.style.overflow = 'hidden';
    
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.height = '100%';
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#4CAF50';
        progressBar.style.transition = 'width 0.3s ease';
    
        progressOuter.appendChild(progressBar);
    
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        progressText.textContent = '0 %';
        progressText.style.fontFamily = 'sans-serif';
        progressText.style.fontSize = '22px';
        progressText.style.marginBottom = '10px';
    
        const timeElapsedText = document.createElement('div');
        timeElapsedText.className = 'time-elapsed';
        timeElapsedText.textContent = '0 Sekunden vergangen';
        timeElapsedText.style.fontFamily = 'sans-serif';
        timeElapsedText.style.fontSize = '22px';
        timeElapsedText.style.marginBottom = '10px';
        timeElapsedText.style.color = '#666';
    
        modalContent.appendChild(titleText);
        modalContent.appendChild(progressOuter);
        modalContent.appendChild(progressText);
        modalContent.appendChild(timeElapsedText);
        modal.appendChild(modalContent);
    
        return {
            modal: modal,
            timeElapsedText: timeElapsedText
        };
    }

    function createSuccessModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
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

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '2rem';
        modalContent.style.borderRadius = '8px';
        modalContent.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        modalContent.style.maxWidth = '500px';
        modalContent.style.width = '90%';
        modalContent.style.textAlign = 'center';
        modalContent.style.transform = 'translateY(-20px)';
        modalContent.style.transition = 'transform 0.3s ease';

        const titleText = document.createElement('h2');
        titleText.textContent = 'Bilder erfolgreich als PDF abgespeichert!';
        titleText.style.marginTop = '0';
        titleText.style.color = '#4CAF50';
        titleText.style.fontSize = '26px';
        titleText.style.fontFamily = 'sans-serif';

        const messageText = document.createElement('p');
        messageText.textContent = 'Die Datei ist im Ordner Downloads abgespeichert';
        messageText.style.fontFamily = 'sans-serif';
        messageText.style.fontSize = '22px';
        messageText.style.marginBottom = '20px';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'OK';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#4CAF50';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '22px';
        closeButton.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });

        modalContent.appendChild(titleText);
        modalContent.appendChild(messageText);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);

        return modal;
    }

    function createErrorModal(errorMessage) {
        const modal = document.createElement('div');
        modal.className = 'modal';
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

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '2rem';
        modalContent.style.borderRadius = '8px';
        modalContent.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        modalContent.style.maxWidth = '500px';
        modalContent.style.width = '90%';
        modalContent.style.textAlign = 'center';
        modalContent.style.transform = 'translateY(-20px)';
        modalContent.style.transition = 'transform 0.3s ease';

        const titleText = document.createElement('h2');
        titleText.textContent = 'Fehler!';
        titleText.style.marginTop = '0';
        titleText.style.color = '#F44336';
        titleText.style.fontFamily = 'sans-serif';

        const messageText = document.createElement('p');
        messageText.textContent = `Fehler beim Erstellen des PDFs: ${errorMessage}`;
        messageText.style.fontFamily = 'sans-serif';
        messageText.style.fontSize = '22px';
        messageText.style.marginBottom = '20px';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'OK';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#F44336';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '22px';
        closeButton.addEventListener('click', () => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });

        modalContent.appendChild(titleText);
        modalContent.appendChild(messageText);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);

        return modal;
    }
});
