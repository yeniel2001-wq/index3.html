const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle?.addEventListener('click', () => {
  const opened = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

document.getElementById('themeToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

const searchInput = document.getElementById('searchInput');
const searchableSections = [...document.querySelectorAll('[data-searchable]')];
const searchStatus = document.getElementById('searchStatus');
searchInput?.addEventListener('input', () => {
  const query = searchInput.value.trim().toLocaleLowerCase('es');
  let visible = 0;
  searchableSections.forEach(section => {
    const match = section.innerText.toLocaleLowerCase('es').includes(query);
    section.hidden = !match;
    if (match) visible++;
  });
  searchStatus.textContent = query ? `${visible} unidad(es) coinciden con tu búsqueda` : '6 unidades · 6 temas principales';
});

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy.replaceAll('&#10;', '\n');
    const old = button.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Alternativa compatible con la apertura local del archivo (file://).
        const temporary = document.createElement('textarea');
        temporary.value = text;
        temporary.setAttribute('readonly', '');
        temporary.style.position = 'fixed';
        temporary.style.opacity = '0';
        document.body.appendChild(temporary);
        temporary.select();
        const copied = document.execCommand('copy');
        temporary.remove();
        if (!copied) throw new Error('No se pudo copiar');
      }
      button.textContent = '¡Copiado!';
    } catch {
      button.textContent = 'Selecciona y copia manualmente';
    }
    setTimeout(() => button.textContent = old, 1800);
  });
});

const questions = [
  {q:'¿Qué sistema de control de versiones mantiene una copia completa del repositorio en cada equipo?', options:['Centralizado','Distribuido','Solo local'], answer:1, why:'En un sistema distribuido, cada colaborador dispone de una copia completa del repositorio y su historial.'},
  {q:'¿Qué opción es adecuada para guardar registros estructurados sin conexión en Android?', options:['Room / SQLite','Notificación push','Sensor giroscopio'], answer:0, why:'Room proporciona una capa de persistencia sobre SQLite para organizar datos locales.'},
  {q:'¿Qué sensor mide la velocidad angular del dispositivo?', options:['Acelerómetro','Giroscopio','Sensor de luz'], answer:1, why:'El giroscopio mide la velocidad de rotación o velocidad angular.'},
  {q:'¿Para qué se utiliza principalmente una tarea persistente en segundo plano?', options:['Cambiar el color del tema','Sincronizar información','Mostrar siempre una pantalla'], answer:1, why:'La sincronización diferible es un ejemplo habitual de trabajo persistente en segundo plano.'},
  {q:'¿Qué herramienta permite pausar la ejecución en un punto y revisar variables?', options:['Debugger','Compresor de imágenes','Gestor de notificaciones'], answer:0, why:'Un depurador permite establecer breakpoints e inspeccionar el estado del programa.'}
];
let questionIndex = 0;
let answered = false;
const questionEl = document.getElementById('quizQuestion');
const optionsEl = document.getElementById('quizOptions');
const feedbackEl = document.getElementById('quizFeedback');
const nextBtn = document.getElementById('nextQuestion');
function renderQuestion() {
  const item = questions[questionIndex];
  questionEl.textContent = item.q;
  optionsEl.innerHTML = '';
  item.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'quiz-option';
    button.textContent = option;
    button.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const correct = index === item.answer;
      button.classList.add(correct ? 'correct' : 'wrong');
      [...optionsEl.children].forEach((el, i) => {
        el.disabled = true;
        if (i === item.answer) el.classList.add('correct');
      });
      feedbackEl.textContent = `${correct ? '¡Correcto!' : 'No es correcto.'} ${item.why}`;
      nextBtn.textContent = questionIndex === questions.length - 1 ? 'Volver a empezar ↻' : 'Siguiente pregunta →';
    });
    optionsEl.appendChild(button);
  });
  feedbackEl.textContent = '';
  answered = false;
  nextBtn.textContent = 'Siguiente pregunta →';
}
nextBtn?.addEventListener('click', () => {
  if (!answered) {
    feedbackEl.textContent = 'Selecciona una respuesta antes de continuar.';
    return;
  }
  questionIndex = (questionIndex + 1) % questions.length;
  renderQuestion();
});
renderQuestion();
