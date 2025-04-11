import './style.css'

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

  // 🔄 Crear pantalla de carga
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';
  loadingScreen.innerHTML = `<p>Cargando personajes...</p>`;
  document.body.appendChild(loadingScreen);

  // Contenedor principal para los personajes
  const container = document.getElementsByClassName ('container')[0] as HTMLElement;
  // container.className = 'character-container';
  // document.body.appendChild(container);

  // Obtener todos los personajes de golpe
  async function fetchAllCharacters(): Promise<Personaje[]> {
    console.log(`Cargando todos los personajes del 1 al ${TOTAL}...`);
    const res = await fetch(`https://apisimpsons.fly.dev/api/personajes?limit=${TOTAL}&page=1`);
    const data = await res.json();
    return data.docs;
  }

  // Mostrar el siguiente grupo de personajes
  function renderNextCharacters(): void {
    if (index >= allCharacters.length) return;
  
    const siguiente = allCharacters.slice(index, index + LIMIT);
    siguiente.forEach(personaje => {
      // Crear la tarjeta (carta)
      const card = document.createElement('div');
  
      card.className = `
        carta
        border border-gray-200
        p-4
        mx-5
        rounded-2xl
        bg-white
        shadow
        w-[450px]
        flex flex-col
        items-center
        space-y-4
      `.trim();
  
      // Estructura interna de la tarjeta
      card.innerHTML = `
        <!-- Nombre del personaje encima de la tarjeta -->
        <div class="titulo text-center text-black font-bold text-xl">
          ${personaje.Nombre}
        </div>
        <div class="contenido flex flex-col sm:flex-row w-full justify-between items-center gap-4">
          <!-- Contenedor de la imagen -->
          <div class="imagen-container w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
            <img
              class="imagen w-full h-full object-contain"
              src="${personaje.Imagen}"
              alt="${personaje.Nombre}"
            />
          </div>
          <!-- Leyenda (ahora se ajusta para estar al lado de la imagen a partir de 'sm') -->
          <div class="leyenda flex-1 h-auto p-4 bg-white rounded-xl border border-gray-200 shadow text-left flex flex-col justify-center">
            <p class="text-md text-gray-700 mb-2">
              <span class="font-semibold">Género:</span> ${personaje.Genero}
            </p>
            <p class="text-md text-gray-700 mb-2">
              <span class="font-semibold">Estado:</span> ${personaje.Estado}
            </p>
            <p class="text-md text-gray-700">
              <span class="font-semibold">Ocupación:</span> ${personaje.Ocupacion}
            </p>
          </div>
        </div>
      `;
  
      // Añadir la tarjeta al contenedor
      container.appendChild(card);
    });
}



  

  // Scroll infinito
  window.addEventListener('scroll', () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

    if (nearBottom && !loading) {
      loading = true;
      setTimeout(() => {
        renderNextCharacters();
        loading = false;
      }, 100);
    }
  });







// Jeynner-------------------



/*---------------------DIVISION DE TAREAS---------------------*/
// Jordi-----------------------





// Inicializar
async function init() {
  allCharacters = await fetchAllCharacters();
  renderNextCharacters(); // Mostrar primeros 20
  document.body.removeChild(loadingScreen); // Quitar pantalla de carga
  console.log(allCharacters)
}

init();
});