// Aquí guardaremos el equipo de Pokémon
let equipo = JSON.parse(localStorage.getItem("equipo")) || [];

// Función para mostrar el equipo
function mostrarEquipo() {
  const equipoList = document.getElementById("equipoList");
  equipoList.innerHTML = ""; // Limpiar el listado anterior

  if (equipo.length === 0) {
    equipoList.innerHTML = "<p>No has agregado ningún Pokémon a tu equipo.</p>";
    return;
  }

  equipo.forEach((pokemon) => {
    const card = document.createElement("div");
    card.className = "col-md-3 pokemon-card mb-4";
    card.innerHTML = `
      <div class="card text-center">
        <img src="https://pokeapi.co/media/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" class="pokemon-image">
        <div class="card-body">
          <h5>${pokemon.name.toUpperCase()}</h5>
          <button class="btn btn-danger" onclick="removerDeEquipo('${pokemon.name}')">Remover</button>
        </div>
      </div>
    `;
    equipoList.appendChild(card);
  });
}

// Función para remover Pokémon del equipo
function removerDeEquipo(nombre) {
  equipo = equipo.filter((pokemon) => pokemon.name !== nombre);
  localStorage.setItem("equipo", JSON.stringify(equipo));
  mostrarEquipo(); // Actualiza la vista
}

// Evento que se dispara cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", function () {
  mostrarEquipo();
});
