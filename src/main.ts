import './style.css'

window.addEventListener('DOMContentLoaded', () => {
// Definimos la estructura que tendrá cada personaje según la API
interface Personaje {
  id: number;
  Nombre: string;
  Imagen: string;
  Genero: string;
  Estado: string;
  Ocupacion: string;
  Historia: string;
}

// Constantes de control para el scroll infinito
const LIMIT: number = 20;        // Cantidad de personajes a cargar por petición
let page: number = 1;          // Desplazamiento actual (cuántos personajes ya se cargaron)
let loading: boolean = false;     // Bandera para evitar múltiples cargas simultáneas
let allCharacters: Personaje[] = [];  // Lista completa de personajes cargados

// Creamos un contenedor <div> para insertar los personajes
const container = document.createElement('div');
container.className = 'character-container';
document.body.appendChild(container); // Lo añadimos al <body>

// Comprobamos si hay datos guardados en sessionStorage
// const stored = sessionStorage.getItem('simpsons_characters');
// if (stored) {
//   // Si hay, los parseamos y usamos
  // const parsed = JSON.parse(stored);
  // allCharacters = parsed.characters;  // Personajes previamente cargados
  // page = parsed.page;             // Offset previo
  // renderCharacters(allCharacters);    // Los mostramos en pantalla
// } else {
  // Si no hay nada en sessionStorage, hacemos la primera carga
  loadCharacters();
// }

// Función que obtiene personajes desde la API usando fetch
async function fetchCharacters(page: number, limit: number): Promise<Personaje[]> {
  const res = await fetch(`https://apisimpsons.fly.dev/api/personajes?limit=${limit}&page=${page}`);
  const data = await res.json();

  console.log(data.docs);
  return data.docs; // Solo devolvemos el array de personajes
}

// Función que renderiza una lista de personajes en el DOM
function renderCharacters(characters: Personaje[]) {
  characters.forEach(char => {
    // Creamos un div por cada personaje
    const card = document.createElement('div');
    card.className = 'character-card';

    console.log(char);

    // Le añadimos la imagen, nombre y género como HTML
    card.innerHTML = `
      <h3>${char.Nombre}</h3>
      <img src="${char.Imagen}" alt="${char.Nombre}" />
      <p>Género: ${char.Genero}</p>
      <p>Estado: ${char.Estado}</p>
      <p>Ocupacion: ${char.Ocupacion}</p>
    `;

    // Lo añadimos al contenedor principal
    container.appendChild(card);
  });
}

// Función que gestiona la carga de nuevos personajes
async function loadCharacters() {
  if (loading) return; // Si ya estamos cargando, salimos
  loading = true;      // Marcamos que estamos cargando

  // Obtenemos nuevos personajes desde la API
  const newCharacters = await fetchCharacters(page, LIMIT);

  // Los añadimos a la lista total
  allCharacters = [...allCharacters, ...newCharacters];

  // Los renderizamos en el DOM
  renderCharacters(newCharacters);

  // Aumentamos el offset para la próxima carga
  ++page;

  // Guardamos los datos actualizados en sessionStorage
  sessionStorage.setItem('simpsons_characters', JSON.stringify({
    characters: allCharacters,
    page: page,
  }));

  loading = false; // Terminamos la carga
}

// Listener que detecta si estamos cerca del final de la página (scroll infinito)
window.addEventListener('scroll', () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

  // Si estamos cerca del fondo y no se está cargando, cargamos más
  if (nearBottom && !loading) {
    loadCharacters();
  }
});
});

// Jeynner-------------------



/*---------------------DIVISION DE TAREAS---------------------*/
// Jordi-----------------------