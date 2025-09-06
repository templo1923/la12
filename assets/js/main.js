$(document).ready(function() {
    loadInitialStructure();
    
    const eventosBox = `
<div class="m-6 cardsection">
    <div class="header-title">
        <h3 class="item-game">EVENTOS</h3>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2">
        <div class="mt-1 mb-1">
            <div class="grid grid-cols-3 m-3 shadow shadow-2xl canal items-center h-20">
                <div class="max-w-sm rounded overflow-hidden">
                    <div class="px-2 sm:px-4">
                        <span class="status-indicator inlive"></span>
                        <span class="inline-block text-md font-semibold status-text text-inlive">Activo</span>
                    </div>
                </div>

                <div class="max-w-sm rounded overflow-hidden text-center">
                    <div class="font-bold text-md text-white">AGENDA DEPORTIVA</div>
                </div>

                <div class="flex justify-end mr-1 sm:mr-10">
                    <div class="max-w-sm rounded overflow-hidden shadow-lg">
                        <a href="https://la12hd.com/eventos/" target="_blank" class="text-center" rel="noopener noreferrer">
                            <div class="text-base p-2 text-white rounded-lg shadow-lg w-20 hover:bg-white hover:text-gray-900 btn-red">
                                <p>Link</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

$(".main").prepend(eventosBox);

    // Aumentamos el intervalo a 15 segundos para reducir la carga en el servidor
    setInterval(updateChannelStatus, 15000);
});

function loadInitialStructure() {
    var url = 'status.json';
    
    // Agregamos parámetros para evitar el caché
    fetchWithCache(url)
    .then(data => {
        var htmlString = "";
        
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                var htmlStringContent = "";
                data[key].forEach(element => {
                    var classEstado = element.Estado == "Activo" ? "text-inlive" : "text-offline";
                    var classColor = element.Estado == "Activo" ? "inlive" : "offline";
                    
                    htmlStringContent += `
                    <div class="mt-1 mb-1" data-canal="${element.Canal}">
                        <div class="grid grid-cols-3 m-3 shadow shadow-2xl canal items-center h-20">
                            <div class="max-w-sm rounded overflow-hidden">
                                <div class="px-2 sm:px-4">
                                    <span class="status-indicator ${classColor}"></span>
                                    <span class="inline-block text-md font-semibold status-text ${classEstado}">${element.Estado}</span>
                                </div>
                            </div>

                            <div class="max-w-sm rounded overflow-hidden text-center">
                                <div class="font-bold text-md text-white">${element.Canal}</div>
                            </div>

                            <div class="flex justify-end mr-1 sm:mr-10">
                                <div class="max-w-sm rounded overflow-hidden shadow-lg">
                                    <a href="${element.Link}" target="_blank" class="text-center">
                                        <div class="text-base p-2 text-white rounded-lg shadow-lg w-20 hover:bg-white hover:text-gray-900 btn-red">
                                            <p>Link</p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>`;
                });

                htmlString += `
                <div class="m-6 cardsection">
                    <div class="header-title">
                        <h3 class="item-game">${key}</h3>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2">
                        ${htmlStringContent}
                    </div>
                </div>`;
            }
        }
        
        $(".main").append(htmlString);
    })
    .catch(error => {
        console.error('Error cargando estructura inicial:', error);
        // Agregar manejo de error visual si es necesario
        $(".main").append('<div class="error-message">Error al cargar los canales. Por favor, recarga la página.</div>');
    });
}

// Nueva función para manejar las solicitudes fetch con caché-busting
function fetchWithCache(url) {
    // Agregamos un timestamp para evitar el caché
    const timestamp = new Date().getTime();
    const urlWithCache = `${url}?_=${timestamp}`;
    
    return fetch(urlWithCache, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
        credentials: 'same-origin' // Importante para cookies y autenticación
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    });
}

function updateChannelStatus() {
    fetchWithCache('status.json')
    .then(data => {
        let actualizaciones = false;

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                data[key].forEach(element => {
                    const channelElement = $(`.mt-1[data-canal="${element.Canal}"]`);
                    if (channelElement.length) {
                        const statusIndicator = channelElement.find('.status-indicator');
                        const statusText = channelElement.find('.status-text');
                        
                        const currentStatus = statusText.text();
                        if (currentStatus !== element.Estado) {
                            actualizaciones = true;
                            
                            if (element.Estado === "Activo") {
                                statusIndicator.removeClass('offline').addClass('inlive');
                                statusText.removeClass('text-offline').addClass('text-inlive');
                            } else {
                                statusIndicator.removeClass('inlive').addClass('offline');
                                statusText.removeClass('text-inlive').addClass('text-offline');
                            }
                            
                            // Agregamos una animación sutil para indicar el cambio
                            statusText.fadeOut(200, function() {
                                $(this).text(element.Estado).fadeIn(200);
                            });
                        }
                    }
                });
            }
        }

        // Si hubo actualizaciones, podemos mostrar una notificación sutil
        if (actualizaciones) {
            console.log('Estados actualizados:', new Date().toLocaleTimeString());
        }
    })
    .catch(error => {
        console.error('Error actualizando estados:', error);
    });
}
