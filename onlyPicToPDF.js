document.getElementById('exportImagesButton').addEventListener('click', async function() {
    try {
        // Alle gespeicherten Bilder aus dem localStorage holen
        const storedImages = JSON.parse(localStorage.getItem('uploadedImages')) || [];
        
        if (storedImages.length === 0) {
            alert("Keine Bilder zum Exportieren gefunden!");
            return;
        }

        // PDF erstellen
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 10;
        const usableWidth = pageWidth - (2 * margin);
        
        let currentY = margin;

        // Jedes Bild zur PDF hinzufügen
        for (const imageData of storedImages) {
            try {
                // Bild von URL laden
                const response = await fetch(imageData.imageUrl);
                const blob = await response.blob();
                const imgUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });

                // Bildgröße berechnen
                const img = new Image();
                await new Promise((resolve) => {
                    img.onload = resolve;
                    img.src = imgUrl;
                });

                const ratio = img.width / img.height;
                let imgWidth = usableWidth;
                let imgHeight = imgWidth / ratio;

                // Neue Seite falls nötig
                if (currentY + imgHeight > pdf.internal.pageSize.getHeight() - margin) {
                    pdf.addPage();
                    currentY = margin;
                }

                // Titel hinzufügen
                pdf.setFontSize(12);
                pdf.text(imageData.title, margin, currentY);
                currentY += 5;

                // Bild hinzufügen
                pdf.addImage(
                    imgUrl,
                    'JPEG',
                    margin,
                    currentY,
                    imgWidth,
                    imgHeight,
                    undefined,
                    'SLOW' // Bessere Qualität
                );

                currentY += imgHeight + margin;

            } catch (error) {
                console.error(`Fehler beim Verarbeiten von Bild ${imageData.title}:`, error);
            }
        }

        // PDF speichern
        pdf.save('Protokoll_Bilder_' + new Date().toISOString().slice(0, 10) + '.pdf');
        
    } catch (error) {
        console.error("Fehler beim PDF-Export:", error);
        alert("Fehler beim Erstellen des PDFs!");
    }
});