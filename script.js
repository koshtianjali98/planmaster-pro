let timerInterval = null;
let currentTimer = null;
const audio = new Audio('assets/notification.mp3.wav');

function showSection(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => section.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
}

function addTask() {
  const subject = document.getElementById('subject').value;
  const topic = document.getElementById('topic').value;
  const date = document.getElementById('date').value;
  const duration = parseInt(document.getElementById('duration').value);

  if (!subject || !topic || !date || isNaN(duration)) {
    alert('Please fill out all fields');
    return;
  }

  const taskList = document.getElementById('task-list');
  const taskItem = document.createElement('li');
  taskItem.innerHTML = `
    <strong>${subject}</strong>: ${topic} | ${date} | ${duration} mins
    <div class="timer-controls">
      <span class="timer">⏳ ${duration}:00</span>
      <button onclick="startTimer(this, ${duration * 60})">▶️</button>
      <button onclick="pauseTimer(this)">⏸️</button>
      <button onclick="resumeTimer(this)">⏯️</button>
      <button onclick="stopTimer(this)">⏹️</button>
      <button onclick="this.closest('li').remove()">❌</button>
    </div>
  `;
  taskList.appendChild(taskItem);

  document.getElementById('subject').value = '';
  document.getElementById('topic').value = '';
  document.getElementById('date').value = '';
  document.getElementById('duration').value = '';
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme');
}

// Timer Logic
function startTimer(button, seconds) {
  const li = button.closest('li');
  const timerSpan = li.querySelector('.timer');
  clearInterval(timerInterval);

  let remainingTime = seconds;
  updateTimerDisplay(timerSpan, remainingTime);

  timerInterval = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      audio.play();
      alert("⏰ Time's up!");
    } else {
      remainingTime--;
      updateTimerDisplay(timerSpan, remainingTime);
      button.dataset.remaining = remainingTime;
    }
  }, 1000);

  currentTimer = { span: timerSpan, remaining: seconds, interval: timerInterval };
}

function pauseTimer(button) {
  clearInterval(timerInterval);
}

function resumeTimer(button) {
  const li = button.closest('li');
  const startBtn = li.querySelector('button[data-remaining]');
  const remaining = parseInt(startBtn?.dataset?.remaining || "0");
  if (!remaining) return;

  startTimer(startBtn, remaining);
}

function stopTimer(button) {
  const li = button.closest('li');
  const timerSpan = li.querySelector('.timer');
  clearInterval(timerInterval);
  timerSpan.textContent = '⏳ 0:00';
}

function updateTimerDisplay(span, seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  span.textContent = `⏳ ${mins}:${secs.toString().padStart(2, '0')}`;
}
