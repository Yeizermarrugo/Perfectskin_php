let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
  //id: "",
  name: "",
  hora: "",
  fecha: "",
  servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
  flatpickr("#hora", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    minuteIncrement: 60, // Fija los minutos en 00
    minTime: "08:00",
    maxTime: "17:00",
  });
});

function iniciarApp() {
  mostrarSeccion(); //Muestra y oculta las secciones
  tabs(); //Cambiar la seccion cuando se presionen los tabs
  paginador(); //Agrega o quita la paginacion
  siguiente();
  anterior();
  consultarAPI();
  nombreCliente();
  seleccionarFecha();
  seleccionarHora();
  mostraResumen();
}

function mostrarSeccion() {
  //Ocultar seccion que tenga la clase de mostrar
  const seccionAnterior = document.querySelector(".mostrar");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar");
  }

  //Seleccionar la seccion con el paso...
  const pasoSelector = `#paso-${paso}`;
  const seccion = document.querySelector(pasoSelector);
  seccion.classList.add("mostrar");
  //Quitar la clase de actual al tab anterior
  const btnAnterior = document.querySelector(".actual");
  if (btnAnterior) {
    btnAnterior.classList.remove("actual");
  }

  //Resaltar tab actual
  const tabsContenedor = document.querySelector(`[data-paso="${paso}"]`);
  tabsContenedor.classList.add("actual");
}

function tabs() {
  const botones = document.querySelectorAll(".tabs button");

  botones.forEach((boton) => {
    boton.addEventListener("click", function (e) {
      paso = parseInt(e.target.dataset.paso);
      mostrarSeccion();
      paginador();
    });
  });
}

function paginador() {
  const anterior = document.querySelector("#anterior");
  const siguiente = document.querySelector("#siguiente");

  if (paso === 1) {
    anterior.classList.add("ocultar");
    siguiente.classList.remove("ocultar");
  } else if (paso === 3) {
    anterior.classList.remove("ocultar");
    siguiente.classList.add("ocultar");
    mostraResumen();
  } else {
    anterior.classList.remove("ocultar");
    siguiente.classList.remove("ocultar");
  }
  mostrarSeccion();
}

function anterior() {
  const anterior = document.querySelector("#anterior");
  anterior.addEventListener("click", () => {
    if (paso <= pasoInicial) return;
    paso--;
    paginador();
  });
}

function siguiente() {
  const siguiente = document.querySelector("#siguiente");
  siguiente.addEventListener("click", () => {
    if (paso >= pasoFinal) return;
    paso++;
    paginador();
  });
}

async function consultarAPI() {
  try {
    const url = "http://localhost:3000/api/servicios";
    const resultado = await fetch(url);
    const servicios = await resultado.json();
    mostrarServicios(servicios);
  } catch (error) {
    console.log(error);
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
    precioServicio.textContent = `${price}`;

    const servicioDiv = document.createElement("DIV");
    servicioDiv.classList.add("servicio");
    servicioDiv.dataset.idServicio = id;
    servicioDiv.onclick = function () {
      seleccionarServicio(servicio);
    };

    servicioDiv.appendChild(nombreServicio);
    servicioDiv.appendChild(precioServicio);

    document.querySelector("#servicios").appendChild(servicioDiv);
  });
}

function seleccionarServicio(servicio) {
  const { id } = servicio;
  const { servicios } = cita;
  const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

  // Comprobar si el servicio ya fue agregado
  const servicioYaAgregado = servicios.some((agregado) => agregado.id === id);

  if (servicioYaAgregado) {
    // Si el servicio ya está seleccionado, removerlo
    cita.servicios = servicios.filter((agregado) => agregado.id !== id);
    divServicio.classList.remove("seleccionado");
  } else {
    // Si no está seleccionado, agregarlo
    if (servicios.length > 0) {
      // Si ya hay un servicio seleccionado, mostrar alerta
      alert("Solo puedes tomar un servicio a la vez");
      return;
    }

    cita.servicios = [...servicios, servicio];
    divServicio.classList.add("seleccionado");
  }
}

function nombreCliente() {
  cita.name = document.querySelector("#nombre").value;
}

function seleccionarFecha() {
  const inputFecha = document.querySelector("#fecha");
  const inputHora = document.querySelector("#hora");
  let alertaMostrada = false;

  inputFecha.addEventListener("input", function (e) {
    inputHora.value = "";
    const dia = new Date(e.target.value).getUTCDay();

    if ([0].includes(dia)) {
      // Solo mostrar la alerta si no se ha mostrado antes
      if (!alertaMostrada) {
        alertaMostrada = true;
        mostrarAlerta("Domingo no hay servicio disponible", "error", ".form");
      }
      e.target.value = "";
    } else if ([6].includes(dia)) {
      if (!alertaMostrada) {
        alertaMostrada = true;
        mostrarAlerta(
          "Sabado atendemos de 09:00 AM a 03:00 PM",
          "warning",
          ".form"
        );
      }
      cita.fecha = e.target.value;
    } else {
      // Restablecer la variable cuando la fecha es válida
      alertaMostrada = false;
      cita.fecha = e.target.value;
    }
  });
}

function seleccionarHora() {
  const inputHora = document.querySelector("#hora");
  const inputFecha = document.querySelector("#fecha");
  let alertaMostrada = false;

  inputHora.addEventListener("input", function (event) {
    const fechaSeleccionada = new Date(inputFecha.value);
    const dia = fechaSeleccionada.getUTCDay();
    const horaCita = event.target.value;
    const hora = parseInt(horaCita.split(":")[0]);

    if (dia === 6 && (hora < 9 || hora > 15)) {
      // Mostrar la alerta si no se ha mostrado antes
      if (!alertaMostrada) {
        alertaMostrada = true;
        mostrarAlerta(
          `La hora debe ser entre las 09:00 AM y 3:00 PM`,
          "error",
          ".form"
        );
      }
      inputHora.value = "";
    } else {
      alertaMostrada = false;
      cita.hora = event.target.value;
    }
    console.log(cita);
  });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {
  const alertaPrevia = document.querySelector(".alerta");
  if (alertaPrevia) {
    alertaPrevia.remove();
  }

  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");
  alerta.classList.add(tipo);

  const referencia = document.querySelector(elemento);
  referencia.appendChild(alerta);

  if (desaparece) {
    setTimeout(() => {
      alerta.classList.add("desvanecer");
    }, 3000);

    // Eliminar el elemento después de completarse la transición
    alerta.addEventListener("transitionend", () => {
      alerta.remove();
    });
  }
}

function mostraResumen() {
  const resumen = document.querySelector(".contenido-resumen");

  //Limpiar contenido del resumen
  while (resumen.firstChild) {
    resumen.removeChild(resumen.firstChild);
  }

  if (Object.values(cita).includes("") || cita.servicios.length === 0) {
    mostrarAlerta("Hacen falta datos", "error", ".contenido-resumen", false);

    return;
  }

  //Formatear el div de resumen
  const { name, fecha, hora, servicios } = cita;

  const fechaActual = new Date(fecha);

  // Días de la semana en español
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  // Meses del año en español
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Obtener el día, el nombre del día, el mes y el año
  const dia = fechaActual.getDate() + 1;
  const nombreDia = diasSemana[fechaActual.getDay() + 1];
  const nombreMes = meses[fechaActual.getMonth()];
  const anio = fechaActual.getFullYear();

  // Formatear la fecha como "Dia(numero y nombre) Mes(nombre) Anio"
  const fechaFormateada = `${nombreDia} ${dia} de ${nombreMes} ${anio}`;

  const nombreCliente = document.createElement("P");
  nombreCliente.innerHTML = `<span>Nombre:</span>${name}`;

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha: </span>${fechaFormateada}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora: </span>${hora}`;

  servicios.forEach((servicio) => {
    const { id, price, name } = servicio;
    const contenedorServicio = document.createElement("DIV");
    contenedorServicio.classList.add("contenedor-servico");

    const textoServicio = document.createElement("P");
    textoServicio.textContent = name;

    const precioServicio = document.createElement("P");
    precioServicio.innerHTML = `<span>Precio: </span>${price}`;

    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);
    resumen.appendChild(contenedorServicio);
  });

  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);
  resumen.appendChild(nombreCliente);
}
