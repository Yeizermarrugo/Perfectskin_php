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
  document.querySelectorAll(".tabs button").forEach(function (e) {
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
  document.querySelector("#anterior").addEventListener("click", function () {
    paso <= 1 || (paso--, paginador());
  });
}
function siguiente() {
  document.querySelector("#siguiente").addEventListener("click", function () {
    paso >= 4 || (paso++, paginador());
  });
}
async function consultarAPI() {
  try {
    const e = "/api/servicios",
      t = await fetch(e);
    mostrarServicios(await t.json());
  } catch (e) {
    console.log(e);
  }
}
function mostrarServicios(e) {
  e.filter(function (e) {
    e.eliminada;
  }).forEach(function (e) {
    const { id: t, name: a, price: n } = e,
      o = document.createElement("P");
    o.classList.add("nombre-servicio"), (o.textContent = a);
    const c = document.createElement("P");
    c.classList.add("precio-servicio"), (c.textContent = "" + n);
    const i = document.createElement("DIV");
    i.classList.add("servicio"),
      (i.dataset.idServicio = t),
      (i.onclick = function () {
        seleccionarServicio(e);
      }),
      i.appendChild(o),
      i.appendChild(c),
      document.querySelector("#servicios").appendChild(i);
  });
}
function seleccionarServicio(e) {
  const { id: t } = e,
    { servicios: a } = cita,
    n = document.querySelector(`[data-id-servicio="${t}"]`);
  if (
    a.some(function (e) {
      e.id;
    })
  )
    (cita.servicios = a.filter(function (e) {
      e.id;
    })),
      n.classList.remove("seleccionado");
  else {
    if (a.length > 0)
      return void alert("Solo puedes tomar un servicio a la vez");
    (cita.servicios = [...a, e]), n.classList.add("seleccionado");
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
    const n = "/api/citasPorFecha?fecha=" + t,
      o = await fetch(n),
      c = await o.json();
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
    e.forEach(function (e) {
      const a = document.createElement("option");
      (a.value = e), (a.textContent = e), t.appendChild(a);
    }),
    (t.style.display = "block"),
    (a.style.display = "none"),
    t.addEventListener("change", function (e) {
      cita.hora = e.target.value;
    });
}
function mostrarAlerta(e, t, a, n = !0) {
  const o = document.querySelector(".alerta");
  o && o.remove();
  const c = document.createElement("DIV");
  (c.textContent = e), c.classList.add("alerta"), c.classList.add(t);
  document.querySelector(a).appendChild(c),
    n &&
      (setTimeout(function () {
        c.classList.add("desvanecer");
      }, 3e3),
      c.addEventListener("transitionend", function () {
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
  const { name: t, fecha: a, hora: n, servicios: o } = cita,
    c = document.createElement("H3");
  (c.textContent = "Resumen de cita"),
    e.appendChild(c),
    o.forEach(function (t) {
      const { price: a, name: n } = t,
        o = document.createElement("DIV");
      o.classList.add("contenedor-servico");
      const c = document.createElement("P");
      c.textContent = n;
      const i = document.createElement("P");
      (i.innerHTML = "<span>Precio: </span>" + a),
        o.appendChild(c),
        o.appendChild(i),
        e.appendChild(o);
    });
  const i = document.createElement("P");
  i.innerHTML = "<span>Nombre:</span>" + t;
  const r = new Date(a),
    s = r.getMonth(),
    d = r.getDate() + 2,
    l = r.getFullYear(),
    u = new Date(Date.UTC(l, s, d)).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    m = document.createElement("P");
  m.innerHTML = "<span>Fecha: </span>" + u;
  const p = document.createElement("P");
  p.innerHTML = "<span>Hora: </span>" + n;
  const f = document.createElement("BUTTON");
  f.classList.add("boton"),
    (f.textContent = "Reservar Cita"),
    (f.onclick = reservarCita),
    e.appendChild(m),
    e.appendChild(p),
    e.appendChild(i),
    e.appendChild(f);
}
async function reservarCita() {
  const { name: e, servicios: t, fecha: a, hora: n, id: o } = cita,
    c = t.map(function (e) {
      e.id;
    });
  if (o && e && a && n && 0 !== t.length)
    try {
      const e = `/api/citaDisponible?fecha=${a}&hora=${
        n.includes(":") ? n + ":00" : n + ":00:00"
      }`;
      if ((await fetch(e)).ok) {
        const e = new FormData();
        e.append("fecha", a),
          e.append("hora", n),
          e.append("userId", o),
          e.append("servicioId", c);
        try {
          const t = "/api/citas",
            a = await fetch(t, { method: "POST", body: e });
          (await a.json()).resultado &&
            Swal.fire({
              icon: "success",
              title: "Cita Creada",
              text: "Tu cita fue creada correctamente",
              button: "OK",
            }).then(function () {
              setTimeout(function () {
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
    const e = "/api/citas/mis-citas",
      t = await fetch(e),
      a = await t.json();
    a.sort(function (e, t) {
      new Date(e.fecha), new Date(t.fecha);
    }),
      mostrarMisCitas(a);
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
  e.filter(function (e) {
    e.eliminada;
  }).forEach(function (e) {
    const { servicio: t, precio: a, fecha: n, hora: o } = e,
      c = new Date(n);
    if (c < new Date()) return;
    const i = c.getMonth(),
      r = c.getDate() + 2,
      s = c.getFullYear(),
      d = new Date(Date.UTC(s, i, r)).toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      l = document.createElement("P");
    l.classList.add("nombre-servicio"), (l.textContent = d);
    const u = document.createElement("P");
    u.classList.add("nombre-servicio"), (u.textContent = o);
    const m = document.createElement("P");
    m.classList.add("nombre-servicio"), (m.textContent = t);
    const p = document.createElement("P");
    p.classList.add("precio-cita"), (p.textContent = "" + a);
    const f = document.createElement("DIV");
    f.classList.add("servicio"),
      (f.dataset.idServicio = id),
      (f.onclick = function () {
        seleccionarServicio(t);
      }),
      f.appendChild(m),
      f.appendChild(u),
      f.appendChild(l),
      f.appendChild(p),
      document.querySelector("#lista-citas").appendChild(f);
  });
}
document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});
