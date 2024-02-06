let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
  id: "",
  name: "",
  hora: "",
  fecha: "",
  servicios: [],
};

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarSeccion(); //Muestra y oculta las secciones
  tabs(); //Cambiar la seccion cuando se presionen los tabs
  paginador(); //Agrega o quita la paginacion
  siguiente();
  anterior();
  consultarAPI();
  idCliente();
  nombreCliente();
  seleccionarFecha();
  buscarHorasDisponibles();
  mostrarResumen();
  reservarCita();
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
    mostrarResumen();
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

function idCliente() {
  cita.id = document.querySelector("#id").value;
}

function nombreCliente() {
  cita.name = document.querySelector("#nombre").value;
}

function seleccionarFecha() {
  const inputFecha = document.querySelector("#fecha");

  inputFecha.addEventListener("change", buscarHorasDisponibles);
}

async function buscarHorasDisponibles(event) {
  const fechaSeleccionada = event.target.value;

  const dia = new Date(fechaSeleccionada).getUTCDay();
  try {
    const url = `http://localhost:3000/api/citasPorFecha?fecha=${fechaSeleccionada}`;
    const resultado = await fetch(url);
    const servicios = await resultado.json();

    if ([6].includes(dia)) {
      // Es sábado, mostrar alerta y ajustar la fecha
      mostrarAlerta(
        "Los sábados trabajamos de 10:00 AM a 2:00 PM",
        "warning",
        ".form"
      );
      cita.fecha = fechaSeleccionada;
    } else if ([0].includes(dia)) {
      // Es domingo, mostrar alerta y ajustar la fecha
      mostrarAlerta("Los domingos no trabajamos", "error", ".form");
      document.getElementById("fecha").value = "";
      document.getElementById("lista-horas").style.display = "none";
      document.getElementById("hora-placeholder").style.display =
        "inline-block";
      return;
    }
    // Mostrar las horas disponibles
    mostrarHorasDisponibles(servicios.horas_disponibles);
    cita.fecha = event.target.value;
    console.log(cita);
  } catch (error) {
    console.log(error);
  }
}

function mostrarHorasDisponibles(horasDisponibles) {
  const selectHoras = document.getElementById("lista-horas");
  const horaPlaceholder = document.getElementById("hora-placeholder");

  // Limpiar opciones previas
  selectHoras.innerHTML = "";

  // Agregar las horas disponibles como opciones
  horasDisponibles.forEach((hora) => {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    selectHoras.appendChild(option);
  });

  // Mostrar el select y ocultar el span
  selectHoras.style.display = "block";
  horaPlaceholder.style.display = "none";

  selectHoras.addEventListener("change", function (e) {
    cita.hora = e.target.value;
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

function mostrarResumen() {
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

  //Heading para servicios en resumen
  const heading = document.createElement("H3");
  heading.textContent = "Resumen de cita";
  resumen.appendChild(heading);

  //Mostrando los servicios
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
  const nombreCliente = document.createElement("P");
  nombreCliente.innerHTML = `<span>Nombre:</span>${name}`;

  const fechaObj = new Date(fecha);
  const mes = fechaObj.getMonth();
  const dia = fechaObj.getDate() + 2;
  const year = fechaObj.getFullYear();

  const fechaUTC = new Date(Date.UTC(year, mes, dia));

  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const fechaFormateada = fechaUTC.toLocaleDateString("es-ES", opciones);

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha: </span>${fechaFormateada}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora: </span>${hora}`;

  const botonReservar = document.createElement("BUTTON");
  botonReservar.classList.add("boton");
  botonReservar.textContent = "Reservar Cita";
  botonReservar.onclick = reservarCita;

  resumen.appendChild(fechaCita);
  resumen.appendChild(horaCita);
  resumen.appendChild(nombreCliente);
  resumen.appendChild(botonReservar);
}

async function reservarCita() {
  const { name, servicios, fecha, hora, id } = cita;

  const idServicios = servicios.map((servicio) => servicio.id);

  if (!id || !name || !fecha || !hora || servicios.length === 0) {
    mostrarAlerta("Hacen falta datos", "error", ".contenido-resumen", false);
    return;
  }

  const datos = new FormData();
  datos.append("fecha", fecha);
  datos.append("hora", hora);
  datos.append("userId", id);
  datos.append("servicioId", idServicios);

  //Peticion API
  try {
    // Petición hacia la api
    const url = "http://localhost:3000/api/citas";
    const respuesta = await fetch(url, {
      method: "POST",
      body: datos,
    });

    const resultado = await respuesta.json();
    console.log(resultado);

    if (resultado.resultado) {
      Swal.fire({
        icon: "success",
        title: "Cita Creada",
        text: "Tu cita fue creada correctamente",
        button: "OK",
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un error al guardar la cita",
    });
  }
}
