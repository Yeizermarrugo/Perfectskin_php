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
  const o = document.querySelector(".actual");
  o && o.classList.remove("actual");
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
    const { id: t, name: o, price: a } = e,
      n = document.createElement("P");
    n.classList.add("nombre-servicio"), (n.textContent = o);
    const c = document.createElement("P");
    c.classList.add("precio-servicio"), (c.textContent = "" + a);
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
    { servicios: o } = cita,
    a = document.querySelector(`[data-id-servicio="${t}"]`);
  if (o.some((e) => e.id === t))
    (cita.servicios = o.filter((e) => e.id !== t)),
      a.classList.remove("seleccionado");
  else {
    if (o.length > 0)
      return void alert("Solo puedes tomar un servicio a la vez");
    (cita.servicios = [...o, e]), a.classList.add("seleccionado");
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
  if (!e) return void console.log("El evento no está definido");
  const t = e.target.value,
    o = new Date(t).getUTCDay();
  try {
    const a = "http://localhost:3000/api/citasPorFecha?fecha=" + t,
      n = await fetch(a),
      c = await n.json();
    if ([6].includes(o))
      mostrarAlerta(
        "Los sábados trabajamos de 10:00 AM a 2:00 PM",
        "warning",
        ".form"
      ),
        (cita.fecha = t);
    else if ([0].includes(o))
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
    o = document.getElementById("hora-placeholder");
  (t.innerHTML = ""),
    e.forEach((e) => {
      const o = document.createElement("option");
      (o.value = e), (o.textContent = e), t.appendChild(o);
    }),
    (t.style.display = "block"),
    (o.style.display = "none"),
    t.addEventListener("change", function (e) {
      (cita.hora = e.target.value), console.log(cita);
    });
}
function mostrarAlerta(e, t, o, a = !0) {
  const n = document.querySelector(".alerta");
  n && n.remove();
  const c = document.createElement("DIV");
  (c.textContent = e), c.classList.add("alerta"), c.classList.add(t);
  document.querySelector(o).appendChild(c),
    a &&
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
  const { name: t, fecha: o, hora: a, servicios: n } = cita,
    c = document.createElement("H3");
  (c.textContent = "Resumen de cita"),
    e.appendChild(c),
    n.forEach((t) => {
      const { id: o, price: a, name: n } = t,
        c = document.createElement("DIV");
      c.classList.add("contenedor-servico");
      const r = document.createElement("P");
      r.textContent = n;
      const i = document.createElement("P");
      (i.innerHTML = "<span>Precio: </span>" + a),
        c.appendChild(r),
        c.appendChild(i),
        e.appendChild(c);
    });
  const r = document.createElement("P");
  r.innerHTML = "<span>Nombre:</span>" + t;
  const i = new Date(o),
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
  p.innerHTML = "<span>Hora: </span>" + a;
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
  const { name: e, servicios: t, fecha: o, hora: a, id: n } = cita,
    c = t.map((e) => e.id);
  if (n && e && o && a && 0 !== t.length)
    try {
      const e = `http://localhost:3000/api/citaDisponible?fecha=${o}&hora=${
          a.includes(":") ? a + ":00" : a + ":00:00"
        }`,
        t = await fetch(e);
      if ((console.log("disponible: ", t.json()), t)) {
        const e = new FormData();
        e.append("fecha", o),
          e.append("hora", a),
          e.append("userId", n),
          e.append("servicioId", c);
        try {
          const t = "http://localhost:3000/api/citas",
            o = await fetch(t, { method: "POST", body: e }),
            a = await o.json();
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
document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});
