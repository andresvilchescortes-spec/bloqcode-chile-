const celdas = document.querySelectorAll('.celda');
const grinchs = document.querySelectorAll('.grinch');
const displayPuntuacion = document.querySelector('#puntuacion');
const displayTiempo = document.querySelector('#tiempo');
const btnIniciar = document.querySelector('#btn-iniciar');

let ultimaCelda;
let tiempoTerminado = false;
let puntuacion = 0;
let tiempoRestante = 30;
let temporizador;

// Función para obtener un tiempo aleatorio de asomo
function tiempoAleatorio(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// Función para elegir una celda aleatoria sin repetir la anterior
function celdaAleatoria(celdas) {
  const indice = Math.floor(Math.random() * celdas.length);
  const celda = celdas[indice];
  if (celda === ultimaCelda) {
    return celdaAleatoria(celdas);
  }
  ultimaCelda = celda;
  return celda;
}

// Lógica de aparición del personaje
function asomar() {
  const tiempo = tiempoAleatorio(600, 1100);
  const celda = celdaAleatoria(celdas);
  const grinch = celda.querySelector('.grinch');
  
  // Reseteamos su cara a la normal antes de subir
  grinch.src = grinch.dataset.normal;
  grinch.classList.add('arriba');
  
  setTimeout(() => {
    // Si no lo han atrapado, lo bajamos normalmente
    if (!grinch.classList.contains('golpeado')) {
      grinch.classList.remove('arriba');
    }
    // Si aún hay tiempo, asomamos el siguiente
    if (!tiempoTerminado) asomar();
  }, tiempo);
}

// Bucle principal del juego
function iniciarJuego() {
  puntuacion = 0;
  tiempoRestante = 30;
  tiempoTerminado = false;
  displayPuntuacion.textContent = 0;
  displayTiempo.textContent = tiempoRestante;
  btnIniciar.disabled = true;
  
  // Limpiar el estado visual de todos los Grinchs por si quedó alguno golpeado
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
      
      // Retraso para que el mensaje no bloquee la última animación
      setTimeout(() => {
        if(puntuacion >= 30) {
          alert(`¡Felicidades! Atrapaste ${puntuacion} Grinchs.`);
        } else {
          alert(`Atrapaste ${puntuacion}. ¡Sigue intentando para llegar a 30!`);
        }
      }, 500);
    }
  }, 1000);
}

// Lógica de colisión (clic/toque)
function atrapar(e) {
  if (!e.isTrusted) return; // Filtro de seguridad básica contra scripts automáticos
  if (!this.classList.contains('arriba')) return; // No hacer nada si ya va bajando
  if (this.classList.contains('golpeado')) return; // No contar doble si hacen clic rápido

  puntuacion++;
  displayPuntuacion.textContent = puntuacion;
  
  // Cambiamos el estado visual
  this.classList.add('golpeado');
  this.src = this.dataset.golpeado;

  // Lo dejamos un breve momento para que se vea la cara golpeada y luego lo bajamos
  setTimeout(() => {
    this.classList.remove('arriba');
    this.classList.remove('golpeado'); // Preparamos al elemento para su próxima salida
  }, 300);
}

// Asignación de eventos de escucha
grinchs.forEach(grinch => {
  // Para mouse en computadores
  grinch.addEventListener('click', atrapar);
  
  // Para toque con el dedo en móviles (evita el retraso de 300ms del clic normal en móviles)
  grinch.addEventListener('touchstart', (e) => {
    e.preventDefault(); 
    atrapar.call(grinch, e);
  }, {passive: false});
});
