import './style.css';

window.addEventListener('DOMContentLoaded', () => {
  interface Personaje {
    id: number;
    Nombre: string;
    Imagen: string;
    Genero: string;
    Estado: string;
    Ocupacion: string;
    Historia: string;
  }

  const LIMIT: number = 20;
  const TOTAL: number = 676;
  let index: number = 0;
  let loading: boolean = false;
  let allCharacters: Personaje[] = [];
  let activeCharacters: Personaje[] = [];
  const sonidoCargaCompleta = new Audio('./src/sounds/abriendoLata.wav');
  // Pantalla de carga-----------------------------------------------------------
  // Crear el contenedor principal para las rosquillas y el mensaje de error
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';
  document.body.appendChild(loadingScreen);

  // Contenedor para las rosquillas y el mensaje
  const containerForMessagesAndSpinners = document.createElement('div');
  containerForMessagesAndSpinners.style.display = 'flex';
  containerForMessagesAndSpinners.style.flexDirection = 'column';
  containerForMessagesAndSpinners.style.alignItems = 'center';
  containerForMessagesAndSpinners.style.justifyContent = 'center';
  loadingScreen.appendChild(containerForMessagesAndSpinners);

  // Ahora dentro de este contenedor, agregamos el contenedor de rosquillas
  const spinnerContainer = document.createElement('div');
  containerForMessagesAndSpinners.appendChild(spinnerContainer);

  // Añadir estilo de flexbox al contenedor de rosquillas
  spinnerContainer.style.display = 'flex';

  spinnerContainer.style.gap = '10px';  // Ajusta el espacio entre las rosquillas

// Pantalla de carga-----------------------------------------------------------
  function iniciarAnimacionDeCarga(): { detener: () => void } {
    let detenerAnimacion = false;
    let ciclosCompletos = 0;
    let mostrarErrorMostrado = false;
  
    function iniciarCiclo() {
      if (detenerAnimacion) return;
  
      spinnerContainer.innerHTML = ''; // Limpiar antes de cada nuevo ciclo
  
      let rosquillasCargadas = 0;
  
      function mostrarRosquilla() {
        if (detenerAnimacion) return;
  
        const img = document.createElement('img');
        img.src = './src/img/rosquilla.png';
        img.alt = 'Cargando';
        img.className = 'rotar';
        img.style.width = '40px';
        img.style.height = '40px';
  
        img.addEventListener('animationend', () => {
          rosquillasCargadas++;
  
          // Mostrar la siguiente rosquilla si aún faltan
          if (rosquillasCargadas < 3) {
            setTimeout(() => {
              mostrarRosquilla();
            }, 200); // pequeño delay entre una y otra
          } else {
            ciclosCompletos++;
            if (ciclosCompletos >= 5 && !mostrarErrorMostrado) {
              mostrarErrorMostrado = true;
              mostrarMensajeError("⚠️ La API externa no está respondiendo actualmente");
            }
  
            // Esperar un momento antes de reiniciar el ciclo
            setTimeout(() => {
              iniciarCiclo();
            }, 500);
          }
        });
  
        spinnerContainer.appendChild(img);
      }
  
      mostrarRosquilla(); // Comenzar con la primera
    }
  
    iniciarCiclo();
  
    return {
      detener: () => {
        detenerAnimacion = true;
        spinnerContainer.innerHTML = '';
      }
    };
  }
// MENSAJE DE ERROR-----------------------------------------------------------
function mostrarMensajeError(mensaje: string) {
  // Evitar que se cree más de una vez
  const yaExiste = document.getElementById('mensaje-error-api');
  if (yaExiste) return;

  const mensajeDiv = document.createElement('div');
  mensajeDiv.id = 'mensaje-error-api';
  mensajeDiv.textContent = mensaje;
  mensajeDiv.style.color = 'red';
  mensajeDiv.style.fontWeight = 'bold';
  mensajeDiv.style.marginTop = '20px';  // Añadir espacio entre las rosquillas y el mensaje
  mensajeDiv.style.textAlign = 'center';
  mensajeDiv.style.fontSize = '16px';

  // Asegurarnos de que el mensaje aparezca fuera de `spinnerContainer` y debajo de las rosquillas
  spinnerContainer.parentElement?.appendChild(mensajeDiv);
}
// INICIAR ANIMACION-----------------------------------------------------------
const animacion = iniciarAnimacionDeCarga();


  // Contenedor principal
  const container = document.getElementsByClassName('container')[0] as HTMLElement;

  // Obtener todos los personajes de golpe
  async function fetchAllCharacters(): Promise<Personaje[]> {
    console.log(`Cargando todos los personajes del 1 al ${TOTAL}...`);
    const res = await fetch(`https://apisimpsons.fly.dev/api/personajes?limit=${TOTAL}&page=1`);
    const data = await res.json();
    return data.docs;
  }

  // Renderizar siguiente grupo de personajes desde una lista
  function renderNextCharacters(personajes: Personaje[] = allCharacters): void {
    if (index >= personajes.length) return;

    const siguiente = personajes.slice(index, index + LIMIT);
    siguiente.forEach(personaje => {
      const card = document.createElement('div');

      card.className = `
        carta
        p-4
        rounded-2xl
        bg-sky-100
        shadow
        w-[450px]
        //h-[345px]
        flex flex-col
        items-center
        space-y-4
        border-1 border-gray-400
      `.trim();

      card.innerHTML = `
        <div class="titulo text-center text-black font-bold text-xl line-clamp-1" title="${personaje.Nombre}">
          ${personaje.Nombre}
        </div>
        <div class="contenido flex flex-col sm:flex-row w-full justify-between items-center gap-4">
          <div class="imagen-container w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
            <img
              class="imagen w-full h-full object-contain"
              src="${personaje.Imagen}"
              alt="${personaje.Nombre}"
            />
          </div>
          <div class="leyenda flex-1 h-auto p-4 bg-white rounded-xl border border-gray-200 shadow text-left flex flex-col justify-center">
            <p class="text-md text-gray-700 mb-2">
              <span class="font-semibold">Género:</span> ${personaje.Genero}
            </p>
            <p class="text-md text-gray-700 mb-2">
              <span class="font-semibold">Estado:</span> ${personaje.Estado}
            </p>
            <p class="text-md text-gray-700 mb-2 line-clamp-3" title="${personaje.Ocupacion}">
              <span class="font-semibold">Ocupación:</span> ${personaje.Ocupacion}
            </p>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    index += LIMIT;
  }

  // Scroll infinito
  window.addEventListener('scroll', () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

    if (nearBottom && !loading) {
      loading = true;
      setTimeout(() => {
        renderNextCharacters(activeCharacters);
        loading = false;
      }, 100);
    }
  });


  const generoInputs = document.querySelectorAll('input[name="genero"]');
const estadoInputs = document.querySelectorAll('input[name="estado"]');

let generosSeleccionados: string[] = [];
let estadosSeleccionados: string[] = [];

function actualizarSeleccion() {
  // ✅ Obtener géneros marcados
  generosSeleccionados = Array.from(generoInputs)
    .filter(i => (i as HTMLInputElement).checked)
    .map(i => (i as HTMLInputElement).value);

  // ✅ Obtener estados marcados (pueden ser múltiples)
  estadosSeleccionados = Array.from(estadoInputs)
    .filter(i => (i as HTMLInputElement).checked)
    .flatMap(i => (i as HTMLInputElement).value.split(" ")); // Soporta "Muerto Fallecido"

  aplicarFiltros();
}

function aplicarFiltros() {
  let filtrados: Personaje[] = [];

  if (generosSeleccionados.length === 0 && estadosSeleccionados.length === 0) {
    // ✅ Ningún filtro activo: mostrar todos
    index = 0;
    activeCharacters = allCharacters;
    container.innerHTML = '';
    renderNextCharacters(activeCharacters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (generosSeleccionados.length > 0 && estadosSeleccionados.length === 0) {
    // ✅ Solo filtrado por género
    generosSeleccionados.forEach(g => {
      if (g === "Otros") {
        const excluidos = ["Masculino", "Femenino"];
        filtrados = filtrados.concat(allCharacters.filter(p => !excluidos.includes(p.Genero)));
      } else {
        filtrados = filtrados.concat(allCharacters.filter(p => p.Genero === g));
      }
    });
  } else if (generosSeleccionados.length === 0 && estadosSeleccionados.length > 0) {
    // ✅ Solo filtrado por estado
    estadosSeleccionados.forEach(e => {
      if (e === "Otros") {
        const excluidos = ["Vivo", "vivo", "Viva", "Muerto", "Fallecido", "Robot", "Robots", "Biblico", "Divino"];
        filtrados = filtrados.concat(allCharacters.filter(p => !excluidos.includes(p.Estado)));
      } else {
        filtrados = filtrados.concat(allCharacters.filter(p => p.Estado === e));
      }
    });
  } else {
    // ✅ Filtrado combinado: género y estado
    generosSeleccionados.forEach(g => {
      let generoFiltrados: Personaje[];

      if (g === "Otros") {
        const excluidos = ["Masculino", "Femenino"];
        generoFiltrados = allCharacters.filter(p => !excluidos.includes(p.Genero));
      } else {
        generoFiltrados = allCharacters.filter(p => p.Genero === g);
      }

      estadosSeleccionados.forEach(e => {
        filtrados = filtrados.concat(generoFiltrados.filter(p => p.Estado === e));
      });
    });
  }

  // ✅ Mostrar filtrados
  index = 0;
  activeCharacters = filtrados;
  container.innerHTML = '';
  renderNextCharacters(activeCharacters);

  window.scrollTo({ top: 0, behavior: 'smooth' });

}


// Escuchar cambios
generoInputs.forEach(input => input.addEventListener('change', actualizarSeleccion));
estadoInputs.forEach(input => input.addEventListener('change', actualizarSeleccion));

//   // Filtros-----------------------
//   // 🎯 FILTRO POR GÉNERO
// const filtroGeneroBtns = document.querySelectorAll('.filtro-genero-btn');

// filtroGeneroBtns.forEach(btn => {
//   btn.addEventListener('click', () => {
//     const genero = btn.getAttribute('data-genero')!;
//     index = 0;
//     filtroActivo = true;

//     if (genero === 'Todos') {
//       activeCharacters = allCharacters;
//     } else if (genero === 'Otros') {
//       const excluidos = ['Masculino', 'Femenino'];
//       activeCharacters = allCharacters.filter(personaje =>
//         !excluidos.includes(personaje.Genero)
//       );
//     } else {
//       activeCharacters = allCharacters.filter(p =>
//         p.Genero === genero
//       );
//     }

//     container.innerHTML = '';
//     renderNextCharacters(activeCharacters);
//   });
// });
// // -------------------------
//   // 🎯 FILTRO POR ESTADO
//   const filtroRadios = document.querySelectorAll('input[name="estado"]');

//   filtroRadios.forEach(radio => {
//     radio.addEventListener('change', () => {
//       const input = radio as HTMLInputElement;
//       const estado = input.value;
//       index = 0;
//       filtroActivo = true;

//       if (estado === 'Todos') {
//         filtroActivo = false;
//         activeCharacters = allCharacters;
//       } else if (estado === 'Otros') {
//         const excluidos = ['Vivo', 'vivo', 'Viva', 'Muerto', 'Fallecido', 'Robot', 'Robots', 'Biblico', 'Ficticio', 'Divino'];
//         activeCharacters = allCharacters.filter(personaje =>
//           !excluidos.includes(personaje.Estado)
//         );
//       } else {
//         const estadosPermitidos = estado.split(' ');
//         activeCharacters = allCharacters.filter(p =>
//           estadosPermitidos.includes(p.Estado)
//         );
//       }

//       container.innerHTML = '';
//       renderNextCharacters(activeCharacters);
//     });
//   });
// // ----------------------------



// INICIALIZAR-----------------------------------------------------------
async function init() {
  const MIN_DISPLAY_TIME = 2000;
  const inicio = Date.now();

  try {
    const personajes = await fetchAllCharacters();
    allCharacters = personajes;
    activeCharacters = allCharacters;
    renderNextCharacters(activeCharacters);
  } catch (error) {
    mostrarMensajeError("❌ Error al obtener personajes desde la API");
  } finally {
    const elapsed = Date.now() - inicio;
    const restante = MIN_DISPLAY_TIME - elapsed;

    setTimeout(async () => {
      animacion.detener();
    
      try {
        await sonidoCargaCompleta.play();
      } catch (error) {
        console.warn('No se pudo reproducir el sonido:', error);
      }
    
      document.body.removeChild(loadingScreen);
    }, Math.max(restante, 0));
  }
}



init();
});