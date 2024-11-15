const API_URL = "https://pokeapi.co/api/v2/pokedex/";
let listado;
let equipo = JSON.parse(localStorage.getItem("equipo")) || [];

// Función para agregar las opciones de regiones al <select>
function agregarOpciones(data) {
  let opcionesSelect = "";

  data.results.forEach((region) => {
    opcionesSelect += `<option value="${region.url}">${region.name.toUpperCase()}</option>`;
  });

  document.getElementById("regionSelect").innerHTML += opcionesSelect;
}

// Función para obtener datos desde la API
let getJSONData = function (url) {
  let result = {};

  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then((response) => {
      result.status = "ok";
      result.data = response;
      return result;
    })
    .catch((error) => {
      result.status = "error";
      result.data = error;
      return result;
    });
};

// Función para mostrar los Pokémon de la región seleccionada
function mostrarPokemon(pokemons) {
  const pokemonList = document.getElementById("pokemonList");
  pokemonList.innerHTML = ""; // Limpiar el listado anterior

  pokemons.slice(0, 50).forEach(async (entry) => {
    const pokemonData = await getJSONData(
      entry.pokemon_species.url.replace("pokemon-species", "pokemon")
    );

    if (pokemonData.status === "ok") {
      const pokemon = pokemonData.data;

      const card = document.createElement("div");
      card.className = "col-md-3 pokemon-card";
      card.innerHTML = `
        <div class="card text-center">
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-image">
          <div class="card-body">
            <h5>${pokemon.name.toUpperCase()}</h5>
            <p>Tipos: ${pokemon.types.map((t) => t.type.name).join(", ")}</p>
            <button class="btn btn-success" onclick="agregarAPokemon('${pokemon.name}')">Agregar a mi equipo</button>
          </div>
        </div>
      `;
      pokemonList.appendChild(card);
    }
  });
}

// Función para agregar Pokémon al equipo
function agregarAPokemon(nombre) {
  getJSONData(`https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`).then(pokemonDataResponse => {
    if (pokemonDataResponse.status === "ok") {
      const pokemonData = {
        name: pokemonDataResponse.data.name,
        id: pokemonDataResponse.data.id // Guardamos el ID
      };

      const pokemonExistente = equipo.find((p) => p.name === pokemonData.name);
      if (pokemonExistente) {
        alert(`${pokemonData.name.toUpperCase()} ya está en tu equipo.`);
        return;
      }

      equipo.push(pokemonData);
      localStorage.setItem("equipo", JSON.stringify(equipo));
      alert(`Agregaste a ${pokemonData.name} a tu equipo!`);
    }
  });
}

// Evento que se dispara cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("regionSelect");

  // Cargar las regiones al iniciar la página
  getJSONData(API_URL).then((resultObj) => {
    if (resultObj.status === "ok") {
      listado = resultObj.data;
      agregarOpciones(listado);
    }
  });

  // Evento para cuando se selecciona una región
  select.addEventListener("change", (event) => {
    const regionUrl = event.target.value;

    if (regionUrl) {
      getJSONData(regionUrl).then((resultObj) => {
        if (resultObj.status === "ok") {
          mostrarPokemon(resultObj.data.pokemon_entries);
        }
      });
    }
  });
});
