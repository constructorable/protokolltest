/* Copyright - Oliver Acker, acker_oliver@yahoo.de
connection.js
Version 3.36_beta */

document.addEventListener('DOMContentLoaded', function () {
    const connectionIcon = document.getElementById('connection-status');
    
    // Container für Icon und Text erstellen
    const connectionContainer = document.createElement('div');
    Object.assign(connectionContainer.style, {
        position: 'sticky',
        top: '10px',
        left: '10px',
        zIndex: '1000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
    });
    
    // Ursprüngliches Icon in den Container verschieben
    connectionIcon.parentNode.insertBefore(connectionContainer, connectionIcon);
    connectionContainer.appendChild(connectionIcon);

    // Text-Element für Online/Offline-Status erstellen
    const statusText = document.createElement('div');
    Object.assign(statusText.style, {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        width: '100%'
    });
    connectionContainer.appendChild(statusText);

    // Stil für das Icon setzen
    Object.assign(connectionIcon.style, {
        width: '40px',
        height: '40px',
        borderRadius: '4px',
        backgroundColor: '#FFEB3B', // Gelb als Ausgangszustand
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        padding: '4px',
        margin: '0' // Margin entfernen für bessere Ausrichtung
    });

    const signalContainer = connectionIcon.querySelector('.signal-container');
    Object.assign(signalContainer.style, {
        backgroundColor: 'white',
        borderRadius: '2px',
        padding: '2px',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    });

    // Initialisiere Balken (alle grau)
    updateSignalBars(0);

    function checkConnection() {
        connectionIcon.title = "Verbindung wird geprüft...";
        statusText.textContent = "Prüfe...";

        if (navigator.onLine) {
            fetch('https://httpbin.org/get', {
                method: 'HEAD',
                cache: 'no-store',
                mode: 'no-cors'
            }).then(() => {
                connectionIcon.style.backgroundColor = '#4CAF50';
                connectionIcon.title = 'Online - Verbindung besteht';
                statusText.textContent = 'Online';
                statusText.style.color = '#4CAF50';
                updateSignalBars(5);
            }).catch(() => {
                connectionIcon.style.backgroundColor = '#FF9800';
                connectionIcon.title = 'Online - Keine Internetverbindung';
                statusText.textContent = 'Eingeschränkt';
                statusText.style.color = '#FF9800';
                updateSignalBars(0);
            });
        } else {
            connectionIcon.style.backgroundColor = '#FFEB3B';
            connectionIcon.title = 'Offline - Keine Internetverbindung';
            statusText.textContent = 'Offline';
            statusText.style.color = '#F44336';
            updateSignalBars(0);
        }
    }

    function updateSignalBars(activeBars) {
        const svg = connectionIcon.querySelector('svg');
        if (svg) {
            // Setze alle Balken auf dunkelgrau (sichtbar auf weißem Hintergrund)
            svg.querySelectorAll('path').forEach(bar => {
                bar.style.stroke = '#333333';
                bar.style.opacity = '0.2';
            });
            
            // Aktiviere die entsprechenden Balken
            for (let i = 0; i < activeBars; i++) {
                const bar = svg.querySelector(`#bar${i+1}`);
                if (bar) {
                    bar.style.opacity = '1';
                }
            }
        }
    }

    connectionIcon.addEventListener('click', checkConnection);
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);

    setTimeout(checkConnection, 1000);
    setInterval(checkConnection, 60000);
});
