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
  const container = document.createElement('div');
  container.className = 'character-container';
  document.body.appendChild(container);

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
      const card = document.createElement('div');
      card.className = 'character-card';

      card.innerHTML = `
        <h3>${personaje.Nombre}</h3>
        <img src="${personaje.Imagen}" alt="${personaje.Nombre}" />
        <p>Género: ${personaje.Genero}</p>
        <p>Estado: ${personaje.Estado}</p>
        <p>Ocupación: ${personaje.Ocupacion}</p>
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