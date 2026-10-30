// 1. VARIABLES, ELEMENTOS DEL DOM Y AUDIOS
const celdas = document.querySelectorAll('.celda');
const grinchs = document.querySelectorAll('.grinch');
const displayPuntuacion = document.querySelector('#puntuacion');
const displayTiempo = document.querySelector('#tiempo');
const btnIniciar = document.querySelector('#btn-iniciar');

// Instancias de Audio
const musicaFondo = new Audio('audio/musica.mp3');
musicaFondo.loop = true;
musicaFondo.volume = 0.4;

const sonidoAcierto = new Audio('audio/golpe-acierta.mp3');
sonidoAcierto.volume = 0.8;

const sonidoFalla = new Audio('audio/golpe-falla.mp3');
sonidoFalla.volume = 0.5;

let ultimaCelda;
let tiempoTerminado = false;
let puntuacion = 0;
let tiempoRestante = 30;
let temporizador;

// 2. FUNCIONES DE LÓGICA DEL JUEGO
function tiempoAleatorio(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function celdaAleatoria(celdas) {
  const indice = Math.floor(Math.random() * celdas.length);
  const celda = celdas[indice];
  if (celda === ultimaCelda) return celdaAleatoria(celdas);
  ultimaCelda = celda;
  return celda;
}

function asomar() {
  const tiempo = tiempoAleatorio(600, 1100);
  const celda = celdaAleatoria(celdas);
  const grinch = celda.querySelector('.grinch');
  
  grinch.src = grinch.dataset.normal;
  grinch.classList.add('arriba');
  
  setTimeout(() => {
    if (!grinch.classList.contains('golpeado')) {
      grinch.classList.remove('arriba');
    }
    if (!tiempoTerminado) asomar();
  }, tiempo);
}

function iniciarJuego() {
  puntuacion = 0;
  tiempoRestante = 30;
  tiempoTerminado = false;
  displayPuntuacion.textContent = 0;
  displayTiempo.textContent = tiempoRestante;
  btnIniciar.disabled = true;
  
  // Iniciar música
  musicaFondo.play();
  
  grinchs.forEach(g => {
    g.classList.remove('arriba', 'golpeado');
    g.src = g.dataset.normal;
  });

  asomar();
  
  temporizador = setInterval(() => {
    tiempoRestante--;
    displayTiempo.textContent = tiempoRestante;
    
    if (tiempoRestante <= 0) {
      clearInterval(temporizador);
      tiempoTerminado = true;
      btnIniciar.disabled = false;
      btnIniciar.textContent = "Intentar de nuevo";
      
      // Detener música al terminar
      musicaFondo.pause();
      musicaFondo.currentTime = 0;
      
      setTimeout(() => {
        if(puntuacion >= 30) {
          alert(`¡Increíble! Atrapaste ${puntuacion} Grinchs. ¡Salvaste la Navidad!`);
        } else {
          alert(`Fin del tiempo. Atrapaste ${puntuacion}. ¡Te faltaron algunos para llegar a 30!`);
        }
      }, 500);
    }
  }, 1000);
}

function atrapar(e) {
  e.stopPropagation(); // Evita que el clic pase a la casa y suene el fallo
  if (!e.isTrusted) return; 
  if (!this.classList.contains('arriba')) return; 
  if (this.classList.contains('golpeado')) return; 

  puntuacion++;
  displayPuntuacion.textContent = puntuacion;
  
  // Sonido de acierto
  sonidoAcierto.currentTime = 0; 
  sonidoAcierto.play();
  
  this.classList.add('golpeado');
  this.src = this.dataset.golpeado;

  setTimeout(() => {
    this.classList.remove('arriba');
    this.classList.remove('golpeado'); 
  }, 300);
}

function fallar(e) {
  // Evitar que suene si el juego no ha empezado
  if (!e.isTrusted || btnIniciar.disabled === false) return;
  
  // Sonido de fallo
  sonidoFalla.currentTime = 0;
  sonidoFalla.play();
}

// 3. EVENT LISTENERS
grinchs.forEach(grinch => {
  grinch.addEventListener('click', atrapar);
  grinch.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    atrapar.call(grinch, e);
  }, {passive: false});
});

celdas.forEach(celda => {
  celda.addEventListener('click', fallar);
  celda.addEventListener('touchstart', (e) => {
    fallar(e);
  }, {passive: true});
});
