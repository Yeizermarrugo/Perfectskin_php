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
    nombreCliente(),
    seleccionarFecha(),
    seleccionarHora();
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
    ? (e.classList.remove("ocultar"), t.classList.add("ocultar"))
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
      c = document.createElement("P");
    c.classList.add("nombre-servicio"), (c.textContent = a);
    const n = document.createElement("P");
    n.classList.add("precio-servicio"), (n.textContent = "" + o);
    const r = document.createElement("DIV");
    r.classList.add("servicio"),
      (r.dataset.idServicio = t),
      (r.onclick = function () {
        seleccionarServicio(e);
      }),
      r.appendChild(c),
      r.appendChild(n),
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
function nombreCliente() {
  cita.name = document.querySelector("#nombre").value;
}
function seleccionarFecha() {
  const e = document.querySelector("#fecha"),
    t = document.querySelector("#hora");
  let a = !1;
  e.addEventListener("input", function (e) {
    t.value = "";
    const o = new Date(e.target.value).getUTCDay();
    [0].includes(o)
      ? (a ||
          ((a = !0),
          mostrarAlerta("Domingo no hay servicio disponible", "error")),
        (e.target.value = ""))
      : [6].includes(o)
      ? (a ||
          ((a = !0),
          mostrarAlerta("Sabado atendemos de 09:00 AM a 03:00 PM", "warning")),
        (cita.fecha = e.target.value))
      : ((a = !1), (cita.fecha = e.target.value));
  });
}
function seleccionarHora() {
  const e = document.querySelector("#hora"),
    t = document.querySelector("#fecha");
  let a = !1;
  e.addEventListener("input", function (o) {
    const c = new Date(t.value).getUTCDay(),
      n = o.target.value,
      r = parseInt(n.split(":")[0]);
    6 === c && (r < 9 || r > 15)
      ? (a ||
          ((a = !0),
          mostrarAlerta(
            "La hora debe ser entre las 09:00 AM y 3:00 PM",
            "error"
          )),
        (e.value = ""))
      : ((a = !1), (cita.hora = o.target.value)),
      console.log(cita);
  });
}
function mostrarAlerta(e, t) {
  const a = document.createElement("DIV");
  (a.textContent = e), a.classList.add("alerta"), a.classList.add(t);
  document.querySelector("#paso-2 p").appendChild(a),
    setTimeout(() => {
      a.classList.add("desvanecer");
    }, 3e3),
    a.addEventListener("transitionend", () => {
      a.remove();
    });
}
document.addEventListener("DOMContentLoaded", function () {
  iniciarApp(),
    flatpickr("#hora", {
      enableTime: !0,
      noCalendar: !0,
      dateFormat: "H:i",
      minuteIncrement: 60,
      minTime: "08:00",
      maxTime: "17:00",
    });
});
