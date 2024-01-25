let paso = 1;
const pasoInicial = 1,
  pasoFinal = 3;
function iniciarApp() {
  mostrarSeccion(),
    tabs(),
    paginador(),
    siguiente(),
    anterior(),
    consultarAPI();
}
function mostrarSeccion() {
  const t = document.querySelector(".mostrar");
  t && t.classList.remove("mostrar");
  const e = "#paso-" + paso;
  document.querySelector(e).classList.add("mostrar");
  const o = document.querySelector(".actual");
  o && o.classList.remove("actual");
  document.querySelector(`[data-paso="${paso}"]`).classList.add("actual");
}
function tabs() {
  document.querySelectorAll(".tabs button").forEach((t) => {
    t.addEventListener("click", function (t) {
      (paso = parseInt(t.target.dataset.paso)), mostrarSeccion(), paginador();
    });
  });
}
function paginador() {
  const t = document.querySelector("#anterior"),
    e = document.querySelector("#siguiente");
  1 === paso
    ? (t.classList.add("ocultar"), e.classList.remove("ocultar"))
    : 3 === paso
    ? (t.classList.remove("ocultar"), e.classList.add("ocultar"))
    : (t.classList.remove("ocultar"), e.classList.remove("ocultar")),
    mostrarSeccion();
}
function anterior() {
  document.querySelector("#anterior").addEventListener("click", () => {
    paso <= 1 || (paso--, paginador());
  });
}
function siguiente() {
  document.querySelector("#siguiente").addEventListener("click", () => {
    paso >= 3 || (paso++, paginador());
  });
}
document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

async function consultarAPI() {
  try {
    const url = "http://localhost:3000/api/servicios";
    const response = await fetch(url);
    const servicios = await response.json();
    mostrarServicios(servicios);
  } catch (error) {
    console.log("Error al realizar la petición: " + error);
  }
}
function mostrarServicios(servicios) {
  servicios.forEach((servicio) => {
    const { id, name, price } = servicio;
    const nombreServicio = document.createElement("P");
    nombreServicio.classList.add("nombre-servicio");
    nombreServicio.textContent = name;

    const precioServicio = document.createElement("P");
    precioServicio.classList.add("precio-servicio");
    precioServicio.textContent = `$${price}`;

    const servicioDiv = document.createElement("DIV");
    servicioDiv.classList.add("servicio");
    servicioDiv.dataset.idServicio = id;

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector("#servicios").appendChild(servicioDiv);
  });
}
