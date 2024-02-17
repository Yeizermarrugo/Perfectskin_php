let paso = 1;
const pasoInicial = 1,
  pasoFinal = 4,
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
    reservarCita(),
    cargarMisCitas(),
    mostrarMisCitas();
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
    : 4 === paso
    ? (e.classList.remove("ocultar"), t.classList.add("ocultar"))
    : (e.classList.remove("ocultar"), t.classList.remove("ocultar")),
    mostrarResumen(),
    mostrarSeccion();
}
function anterior() {
  document.querySelector("#anterior").addEventListener("click", () => {
    paso <= 1 || (paso--, paginador());
  });
}
function siguiente() {
  document.querySelector("#siguiente").addEventListener("click", () => {
    paso >= 4 || (paso++, paginador());
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
  e.filter((e) => "1" !== e.eliminada).forEach((e) => {
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
  if (!e) return;
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
    mostrarHorasDisponibles(c.horas_disponibles), (cita.fecha = e.target.value);
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
      cita.hora = e.target.value;
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
      const { price: a, name: o } = t,
        n = document.createElement("DIV");
      n.classList.add("contenedor-servico");
      const c = document.createElement("P");
      c.textContent = o;
      const r = document.createElement("P");
      (r.innerHTML = "<span>Precio: </span>" + a),
        n.appendChild(c),
        n.appendChild(r),
        e.appendChild(n);
    });
  const r = document.createElement("P");
  r.innerHTML = "<span>Nombre:</span>" + t;
  const i = new Date(a),
    s = i.getMonth(),
    l = i.getDate() + 2,
    d = i.getFullYear(),
    u = new Date(Date.UTC(d, s, l)).toLocaleDateString("es-ES", {
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
  if (n && e && a && o && 0 !== t.length)
    try {
      const e = `http://localhost:3000/api/citaDisponible?fecha=${a}&hora=${
        o.includes(":") ? o + ":00" : o + ":00:00"
      }`;
      if ((await fetch(e)).ok) {
        const e = new FormData();
        e.append("fecha", a),
          e.append("hora", o),
          e.append("userId", n),
          e.append("servicioId", c);
        try {
          const t = "http://localhost:3000/api/citas",
            a = await fetch(t, { method: "POST", body: e });
          (await a.json()).resultado &&
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
          console.log(e),
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un error al guardar la cita",
            });
        }
      } else
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Fecha y hora no disponible",
        });
    } catch (e) {
      return (
        console.log(e),
        void mostrarAlerta(
          "Hubo un error al verificar la disponibilidad de la cita",
          "error",
          ".form"
        )
      );
    }
  else mostrarAlerta("Faltan datos", "error", ".contenido-resumen", !1);
}
async function cargarMisCitas() {
  try {
    const e = "http://localhost:3000/api/citas/mis-citas",
      t = await fetch(e),
      a = await t.json();
    a.sort((e, t) => new Date(e.fecha) - new Date(t.fecha)), mostrarMisCitas(a);
  } catch (e) {
    console.log(e),
      mostrarAlerta("Hubo un error al cargar tus citas", "error", ".form");
  }
}
function mostrarMisCitas(e) {
  const t = document.getElementById("lista-citas");
  if (((t.innerHTML = ""), 0 === e.length)) {
    const e = document.createElement("p");
    return (
      (e.textContent = "No tienes citas programadas"), void t.appendChild(e)
    );
  }
  e.filter((e) => "1" !== e.eliminada).forEach((e) => {
    const { servicio: t, precio: a, fecha: o, hora: n } = e,
      c = new Date(o);
    if (c < new Date()) return;
    const r = c.getMonth(),
      i = c.getDate() + 2,
      s = c.getFullYear(),
      l = new Date(Date.UTC(s, r, i)).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      d = document.createElement("P");
    d.classList.add("nombre-servicio"), (d.textContent = l);
    const u = document.createElement("P");
    u.classList.add("nombre-servicio"), (u.textContent = n);
    const m = document.createElement("P");
    m.classList.add("nombre-servicio"), (m.textContent = t);
    const p = document.createElement("P");
    p.classList.add("precio-cita"), (p.textContent = "" + a);
    const h = document.createElement("DIV");
    h.classList.add("servicio"),
      (h.dataset.idServicio = id),
      (h.onclick = function () {
        seleccionarServicio(t);
      }),
      h.appendChild(m),
      h.appendChild(u),
      h.appendChild(d),
      h.appendChild(p),
      document.querySelector("#lista-citas").appendChild(h);
  });
}
document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});
