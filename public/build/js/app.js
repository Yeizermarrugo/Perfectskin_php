let paso = 1;
const pasoInicial = 1,
  pasoFinal = 3,
  cita = { id: "", name: "", hora: "", fecha: "", servicios: [] };
function iniciarApp() {
  mostrarSeccion(),
    tabs(),
    paginador(),
    siguiente(),
    anterior(),
    consultarAPI(),
    idCliente(),
    nombreCliente(),
    seleccionarFecha(),
    buscarHorasDisponibles(),
    mostrarResumen(),
    reservarCita();
}
function mostrarSeccion() {
  const e = document.querySelector(".mostrar");
  e && e.classList.remove("mostrar");
  const t = "#paso-" + paso;
  document.querySelector(t).classList.add("mostrar");
  const a = document.querySelector(".actual");
  a && a.classList.remove("actual");
  document.querySelector(`[data-paso="${paso}"]`).classList.add("actual");
}
function tabs() {
  document.querySelectorAll(".tabs button").forEach((e) => {
    e.addEventListener("click", function (e) {
      (paso = parseInt(e.target.dataset.paso)), mostrarSeccion(), paginador();
    });
  });
}
function paginador() {
  const e = document.querySelector("#anterior"),
    t = document.querySelector("#siguiente");
  1 === paso
    ? (e.classList.add("ocultar"), t.classList.remove("ocultar"))
    : 3 === paso
    ? (e.classList.remove("ocultar"),
      t.classList.add("ocultar"),
      mostrarResumen())
    : (e.classList.remove("ocultar"), t.classList.remove("ocultar")),
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
async function consultarAPI() {
  try {
    const e = "http://localhost:3000/api/servicios",
      t = await fetch(e);
    mostrarServicios(await t.json());
  } catch (e) {
    console.log(e);
  }
}
function mostrarServicios(e) {
  e.forEach((e) => {
    const { id: t, name: a, price: o } = e,
      n = document.createElement("P");
    n.classList.add("nombre-servicio"), (n.textContent = a);
    const c = document.createElement("P");
    c.classList.add("precio-servicio"), (c.textContent = "" + o);
    const r = document.createElement("DIV");
    r.classList.add("servicio"),
      (r.dataset.idServicio = t),
      (r.onclick = function () {
        seleccionarServicio(e);
      }),
      r.appendChild(n),
      r.appendChild(c),
      document.querySelector("#servicios").appendChild(r);
  });
}
function seleccionarServicio(e) {
  const { id: t } = e,
    { servicios: a } = cita,
    o = document.querySelector(`[data-id-servicio="${t}"]`);
  if (a.some((e) => e.id === t))
    (cita.servicios = a.filter((e) => e.id !== t)),
      o.classList.remove("seleccionado");
  else {
    if (a.length > 0)
      return void alert("Solo puedes tomar un servicio a la vez");
    (cita.servicios = [...a, e]), o.classList.add("seleccionado");
  }
}
function idCliente() {
  cita.id = document.querySelector("#id").value;
}
function nombreCliente() {
  cita.name = document.querySelector("#nombre").value;
}
function seleccionarFecha() {
  document
    .querySelector("#fecha")
    .addEventListener("change", buscarHorasDisponibles);
}
async function buscarHorasDisponibles(e) {
  const t = e.target.value,
    a = new Date(t).getUTCDay();
  try {
    const o = "http://localhost:3000/api/citasPorFecha?fecha=" + t,
      n = await fetch(o),
      c = await n.json();
    if ([6].includes(a))
      mostrarAlerta(
        "Los sábados trabajamos de 10:00 AM a 2:00 PM",
        "warning",
        ".form"
      ),
        (cita.fecha = t);
    else if ([0].includes(a))
      return (
        mostrarAlerta("Los domingos no trabajamos", "error", ".form"),
        (document.getElementById("fecha").value = ""),
        (document.getElementById("lista-horas").style.display = "none"),
        void (document.getElementById("hora-placeholder").style.display =
          "inline-block")
      );
    mostrarHorasDisponibles(c.horas_disponibles),
      (cita.fecha = e.target.value),
      console.log(cita);
  } catch (e) {
    console.log(e);
  }
}
function mostrarHorasDisponibles(e) {
  const t = document.getElementById("lista-horas"),
    a = document.getElementById("hora-placeholder");
  (t.innerHTML = ""),
    e.forEach((e) => {
      const a = document.createElement("option");
      (a.value = e), (a.textContent = e), t.appendChild(a);
    }),
    (t.style.display = "block"),
    (a.style.display = "none"),
    t.addEventListener("change", function (e) {
      (cita.hora = e.target.value), console.log(cita);
    });
}
function mostrarAlerta(e, t, a, o = !0) {
  const n = document.querySelector(".alerta");
  n && n.remove();
  const c = document.createElement("DIV");
  (c.textContent = e), c.classList.add("alerta"), c.classList.add(t);
  document.querySelector(a).appendChild(c),
    o &&
      (setTimeout(() => {
        c.classList.add("desvanecer");
      }, 3e3),
      c.addEventListener("transitionend", () => {
        c.remove();
      }));
}
function mostrarResumen() {
  const e = document.querySelector(".contenido-resumen");
  for (; e.firstChild; ) e.removeChild(e.firstChild);
  if (Object.values(cita).includes("") || 0 === cita.servicios.length)
    return void mostrarAlerta(
      "Hacen falta datos",
      "error",
      ".contenido-resumen",
      !1
    );
  const { name: t, fecha: a, hora: o, servicios: n } = cita,
    c = document.createElement("H3");
  (c.textContent = "Resumen de cita"),
    e.appendChild(c),
    n.forEach((t) => {
      const { id: a, price: o, name: n } = t,
        c = document.createElement("DIV");
      c.classList.add("contenedor-servico");
      const r = document.createElement("P");
      r.textContent = n;
      const s = document.createElement("P");
      (s.innerHTML = "<span>Precio: </span>" + o),
        c.appendChild(r),
        c.appendChild(s),
        e.appendChild(c);
    });
  const r = document.createElement("P");
  r.innerHTML = "<span>Nombre:</span>" + t;
  const s = new Date(a),
    i = s.getMonth(),
    l = s.getDate() + 2,
    d = s.getFullYear(),
    u = new Date(Date.UTC(d, i, l)).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    m = document.createElement("P");
  m.innerHTML = "<span>Fecha: </span>" + u;
  const p = document.createElement("P");
  p.innerHTML = "<span>Hora: </span>" + o;
  const h = document.createElement("BUTTON");
  h.classList.add("boton"),
    (h.textContent = "Reservar Cita"),
    (h.onclick = reservarCita),
    e.appendChild(m),
    e.appendChild(p),
    e.appendChild(r),
    e.appendChild(h);
}
async function reservarCita() {
  const { name: e, servicios: t, fecha: a, hora: o, id: n } = cita,
    c = t.map((e) => e.id);
  if (!(n && e && a && o && 0 !== t.length))
    return void mostrarAlerta(
      "Hacen falta datos",
      "error",
      ".contenido-resumen",
      !1
    );
  const r = new FormData();
  r.append("fecha", a),
    r.append("hora", o),
    r.append("userId", n),
    r.append("servicioId", c);
  try {
    const e = "http://localhost:3000/api/citas",
      t = await fetch(e, { method: "POST", body: r }),
      a = await t.json();
    console.log(a),
      a.resultado &&
        Swal.fire({
          icon: "success",
          title: "Cita Creada",
          text: "Tu cita fue creada correctamente",
          button: "OK",
        }).then(() => {
          setTimeout(() => {
            window.location.reload();
          }, 1e3);
        });
  } catch (e) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al guardar la cita",
    });
  }
}
document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});
