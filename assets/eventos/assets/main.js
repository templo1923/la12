// function para cargar los eventos al dom
async function loadEvents() {

  // fas fa-check-circle finalizado
  // fas fa-clock pronto
  // fas fa-circle en vivo

  const response = await fetch('json/agenda123.json');
  const events = await response.json();

  events.forEach(event => {
    event.time = convertToUserTimeZone(event.time);

    const now = luxon.DateTime.local();
    const eventTime = luxon.DateTime.fromISO(event.time);

    const timeInitial = eventTime.diff(now, 'minutes').values.minutes;
    
    
    if (eventTime < now && timeInitial > -150) {
      event.status = 'en vivo';
    } else if (timeInitial < -150) {
      event.status = 'finalizado';
    } else {
      event.status = 'pronto';
    }

  });


  // ordenar por hora
  events.sort((a, b) => { return a.time.localeCompare(b.time) });

  // ordenar por status en vivo, pronto, finalizado
  events.sort((a, b) => {
    if (a.status === 'en vivo' && b.status !== 'en vivo') return -1;
    if (a.status !== 'en vivo' && b.status === 'en vivo') return 1;
    if (a.status === 'pronto' && b.status !== 'pronto') return -1;
    if (a.status !== 'pronto' && b.status === 'pronto') return 1;
    return 0;
  });

  
  const eventsContainer = document.querySelector('.events-container');
  eventsContainer.innerHTML = '';

  events.forEach(event => {
    let status_event = event.status.charAt(0).toUpperCase() + event.status.slice(1);

    const eventHtml = `
      <div class="event" data-category="${event.category}">
        <p class="event-name">${event.time} - ${event.title}</p>
        <div class="iframe-container">
          <input type="text" class="iframe-link" readonly value="${event.link}" onclick="copyToClipboard('${event.link}')">
          <p class="language_text">${event.language != null ? event.language : ''}</p>
        </div>
        <div class="buttons_container">
          <a href="${event.link}" class="copy-button" target="_blank">Ver</a>
          <button class="status-button status-${event.status === 'finalizado' ? 'finished' : event.status === 'pronto' ? 'next' : 'live'}">
          <i class="fas fa-${event.status === 'finalizado' ? 'check-circle' : event.status === 'pronto' ? 'clock' : 'circle'}"></i>
          ${status_event}</button>
        </div>
      </div>
    `;
    eventsContainer.innerHTML += eventHtml;
  });

}

// function para cargar las categorias
async function displayCategories(categorySelected = "Todos")
{
    const response = await fetch('json/categories.json');
    const categories = await response.json();

    var categoriesContainer = document.querySelector(".categories");
    var categoryHtml = "";
    categoriesContainer.innerHTML = '';

    categories.forEach((category, index) => {
        
        categoryHtml = `<button class="category ${categorySelected == category.name ? 'active' : ''}" onClick="filterByCategory('${category.name}')">${category.name}</button>`;
        
        categoriesContainer.innerHTML += categoryHtml;
    });

}

function filterByCategory(category)
{
  
  const events = document.querySelectorAll('.event');

  displayCategories(category);

  events.forEach(event => {
    if (event.dataset.category === category || category === 'Todos') {
      event.style.display = 'flex';
    } else {
      event.style.display = 'none';
    }
  });
}

//function for copy  to clipboard
function copyToClipboard(text)
{
            console.log("copiando al portapapeles: " + text);
                var copyText = text;
                const tempInput = document.createElement("input");
                tempInput.value = copyText;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);

                document.getElementById("notification").style.display = "block";
                document.getElementById("notification").style.opacity = 1;
                
                setTimeout(() => {
                  document.getElementById("notification").style.display = "none";
                  document.getElementById("notification").style.opacity = 0;
                }, 2000);

}

// function to convert utc to user timezone
function convertToUserTimeZone(utcHour) {
  const DateTime = luxon.DateTime;
  const utcDateTime = DateTime.fromISO(utcHour, { zone: "America/Lima" });
  const localDateTime = utcDateTime.toLocal();
  return localDateTime.toFormat("HH:mm");
}

// Initial load
document.addEventListener("DOMContentLoaded", function() {
                
        loadEvents();

        displayCategories();


                // Evento para copiar al portapapeles
                document.querySelectorAll(".iframe-link").forEach(button => {
                                button.addEventListener("click", copyToClipboard);
                });

                // evento buscador por titulo del evento
                document.querySelector(".input-search").addEventListener("keyup", function() {
                                
                                const searchTerm = this.value.toLowerCase();
                                const events = document.querySelectorAll('.event');

                                events.forEach(event => {
                                  const title = event.querySelector('.event-name').textContent.toLowerCase();
                                  if (!title.includes(searchTerm)) {
                                    event.style.display = 'none';
                                  }else{
                                    event.style.display = 'flex';
                                  }
                                });
                });

                // refrescar cada 1 minuto los eventos
                setTimeout(() => { 
                  loadEvents();
                }, 60000);

});
