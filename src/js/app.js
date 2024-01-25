let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarSeccion(); //Muestra y oculta las secciones
  tabs(); //Cambiar la seccion cuando se presionen los tabs
  paginador(); //Agrega o quita la paginacion
  siguiente();
  anterior()
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

    if(paso === 1){
        anterior.classList.add('ocultar');
        siguiente.classList.remove('ocultar');
    }else if(paso === 3){
        anterior.classList.remove('ocultar');
        siguiente.classList.add('ocultar');
    }else{
        anterior.classList.remove('ocultar');
        siguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function anterior() {
    const anterior = document.querySelector('#anterior')
    anterior.addEventListener('click', ()=>{
        if(paso<=pasoInicial) return;
        paso--;
        paginador();
        })
}


function siguiente() {
    const siguiente = document.querySelector('#siguiente');
    siguiente.addEventListener('click', ()=> {
        if(paso>=pasoFinal) return;
        paso++;
        paginador();
    });
}


