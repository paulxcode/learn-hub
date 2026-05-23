const SKILL_ORDER = ['python', 'sql', 'data-pipelines', 'cloud-big-data', 'data-governance', 'data-visualization', 'machine-learning', 'devops-mlops'];

const THEME_MAP = {
  'python': 'cyberpunk',
  'sql': 'cyberpunk',
  'data-pipelines': 'cyberpunk',
  'machine-learning': 'cyberpunk',
  'data-visualization': 'cyberpunk',
  'cloud-big-data': 'cyberpunk',
  'data-governance': 'cyberpunk',
  'devops-mlops': 'cyberpunk',
};

const state = {
  skills: {},
  progress: { completed: [], bookmarks: [] },
  currentLesson: null,
  currentSkill: null,
  themesConfig: {},
  currentUser: null,
};

let ytPlayer = null;
let musicPlaying = false;

function extractYtId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

async function fetchJSON(url, options) {
  const res = await fetch(url, { credentials: 'include', ...options });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

// === MUSIC ===
async function loadThemesConfig() {
  state.themesConfig = await fetchJSON('/config/themes.json');
}

function getCurrentVideoId() {
  const userUrl = state.currentUser?.music_url;
  if (userUrl) {
    const id = extractYtId(userUrl);
    if (id) return id;
  }
  const config = getCurrentThemeConfig();
  if (config?.videos?.length) {
    return extractYtId(config.videos[0]);
  }
  return null;
}

function getCurrentThemeConfig() {
  const themeId = document.body.className.replace('theme-', '');
  return state.themesConfig.themes?.[themeId];
}

function switchMusic(themeId) {
  const vidId = getCurrentVideoId();
  if (!vidId) return;

  const labelEl = $('#music-label');
  if (labelEl) labelEl.textContent = state.currentUser?.music_url ? 'Custom track' : (getCurrentThemeConfig()?.label || 'Music');

  if (ytPlayer && ytPlayer.cueVideoById) {
    if (musicPlaying) {
      ytPlayer.loadVideoById(vidId);
    } else {
      ytPlayer.cueVideoById(vidId);
    }
  }
}

function toggleMusic() {
  const control = $('#music-control');
  if (!ytPlayer) return;

  if (musicPlaying) {
    ytPlayer.pauseVideo();
    control.classList.remove('playing');
    $('#music-label').textContent = 'Paused';
    musicPlaying = false;
  } else {
    const vidId = getCurrentVideoId();
    if (vidId) {
      ytPlayer.loadVideoById(vidId);
      control.classList.add('playing');
      $('#music-label').textContent = state.currentUser?.music_url ? 'Custom track' : (getCurrentThemeConfig()?.label || 'Music');
      musicPlaying = true;
    }
  }
}

function setupMusicControl() {
  const control = $('#music-control');
  if (control) control.addEventListener('click', toggleMusic);
}

function initYTPlayer(retries = 20) {
  if (ytPlayer) return;
  if (!window.YT || !window.YT.Player) {
    if (retries > 0) setTimeout(() => initYTPlayer(retries - 1), 500);
    return;
  }
  ytPlayer = new YT.Player('youtube-player', {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
    },
    events: {
      onReady: () => {
        const vidId = getCurrentVideoId();
        if (vidId) ytPlayer.cueVideoById(vidId);
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.ENDED && musicPlaying) {
          ytPlayer.seekTo(0);
          ytPlayer.playVideo();
        }
      },
      onError: () => {
        $('#music-label').textContent = 'No track';
      },
    },
  });
}

window.onYouTubeIframeAPIReady = initYTPlayer;

// === THEME ===
function applyTheme(skill) {
  const userTheme = state.currentUser?.theme;
  const theme = userTheme || THEME_MAP[skill] || 'cyberpunk';
  document.body.className = `theme-${theme}`;
  state.currentSkill = skill;
}

// === SIDEBAR ===
async function loadSidebar() {
  state.skills = await fetchJSON('/api/content/skills');
  try {
    state.progress = await fetchJSON('/api/progress');
  } catch {
    state.progress = { completed: [], bookmarks: [] };
  }

  const tree = $('#skill-tree');
  tree.innerHTML = '';

  const sortedSkills = Object.entries(state.skills).sort(([a], [b]) => {
    const ai = SKILL_ORDER.indexOf(a);
    const bi = SKILL_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  for (const [skill, lessons] of sortedSkills) {
    const group = document.createElement('div');
    group.className = 'skill-group';

    const header = document.createElement('div');
    header.className = 'skill-header open';
    header.textContent = skill.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    const list = document.createElement('ul');
    list.className = 'lesson-list';

    header.addEventListener('click', () => {
      header.classList.toggle('open');
      list.classList.toggle('collapsed');
    });

    for (const lesson of lessons) {
      const item = document.createElement('li');
      item.className = 'lesson-item';
      item.dataset.lessonId = lesson.id;

      const check = document.createElement('span');
      check.className = 'check';
      check.textContent = '\u2713';

      const title = document.createElement('span');
      title.textContent = lesson.title;

      item.appendChild(check);
      item.appendChild(title);

      const prog = state.progress.completed.find(c => c.lesson_id === lesson.id);
      if (prog && prog.completed_at) {
        item.classList.add('completed');
      }

      item.addEventListener('click', () => loadLesson(lesson.id));
      list.appendChild(item);
    }

    group.appendChild(header);
    group.appendChild(list);
    tree.appendChild(group);
  }
}

function getNextLesson(lessonId) {
  const skill = lessonId.split('/')[0];
  const lessons = state.skills[skill];
  if (!lessons) return null;
  const idx = lessons.findIndex(l => l.id === lessonId);
  if (idx === -1 || idx >= lessons.length - 1) return null;
  return lessons[idx + 1];
}

// === LESSON ===
async function loadLesson(lessonId) {
  const data = await fetchJSON(`/api/content/lesson/${lessonId}`);
  state.currentLesson = lessonId;

  const skill = lessonId.split('/')[0];
  applyTheme(skill);

  $$('.lesson-item.active').forEach(el => el.classList.remove('active'));
  const activeItem = $(`.lesson-item[data-lesson-id="${lessonId}"]`);
  if (activeItem) {
    activeItem.classList.add('active');
    activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  const content = $('#content');
  content.classList.remove('lesson-entered');
  void content.offsetWidth;
  content.innerHTML = `
    <div class="lesson-header">
      <div class="lesson-badge">${data.title.split(' ')[0]}</div>
      <h2>${data.title}</h2>
    </div>
    <div class="lesson-body fade-in">${data.html}</div>
    <div class="lesson-actions">
      <button class="btn" id="btn-complete">Mark Complete</button>
      <button class="btn" id="btn-bookmark"></button>
    </div>
    <textarea class="notes-area" id="notes" placeholder="Add personal notes..."></textarea>
    <div class="lesson-footer" id="lesson-footer"></div>
  `;
  content.classList.add('lesson-entered');

  setupCodeRunners();
  if (window.hljs) hljs.highlightAll();

  renderNextButton(lessonId);

  const isCompleted = state.progress.completed.some(c => c.lesson_id === lessonId && c.completed_at);
  const btnComplete = $('#btn-complete');
  if (isCompleted) btnComplete.classList.add('success');

  btnComplete.addEventListener('click', async () => {
    try {
      if (btnComplete.classList.contains('success')) {
        await fetchJSON(`/api/progress/complete/${lessonId}`, { method: 'DELETE' });
        btnComplete.classList.remove('success');
      } else {
        await fetchJSON('/api/progress/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId }),
        });
        btnComplete.classList.add('success');
        showCelebration();
      }
      state.progress = await fetchJSON('/api/progress');
      updateSidebarCompletion();
    } catch {
      showAuthModal('login');
    }
  });

  function updateBookmarkBtn() {
    const isBm = state.progress.bookmarks.some(b => b.lesson_id === lessonId);
    const btn = $('#btn-bookmark');
    btn.textContent = isBm ? '\u2605 Bookmarked' : '\u2606 Bookmark';
    btn.classList.toggle('success', isBm);
  }
  updateBookmarkBtn();

  $('#btn-bookmark').addEventListener('click', async () => {
    try {
      const isBm = state.progress.bookmarks.some(b => b.lesson_id === lessonId);
      if (isBm) {
        await fetchJSON(`/api/progress/bookmark/${lessonId}/favorite`, { method: 'DELETE' });
      } else {
        await fetchJSON('/api/progress/bookmark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId, label: 'favorite' }),
        });
      }
      state.progress = await fetchJSON('/api/progress');
      updateBookmarkBtn();
    } catch {
      showAuthModal('login');
    }
  });

  const prog = state.progress.completed.find(c => c.lesson_id === lessonId);
  if (prog && prog.notes) {
    $('#notes').value = prog.notes;
  }

  $('#notes').addEventListener('change', async () => {
    try {
      await fetchJSON('/api/progress/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, notes: $('#notes').value }),
      });
    } catch {
      showAuthModal('login');
    }
  });

  const existingQuiz = $('.quiz-section');
  if (existingQuiz) existingQuiz.remove();

  try {
    const quizData = await fetchJSON(`/api/content/quiz/${lessonId}`);
    if (quizData.questions && quizData.questions.length > 0) {
      const quizEl = renderQuiz(quizData.questions, lessonId);
      content.appendChild(quizEl);
    }
  } catch (e) {
    // Quiz endpoint may 404 for lessons without quiz data
  }
}

function updateSidebarCompletion() {
  for (const item of $$('.lesson-item')) {
    const id = item.dataset.lessonId;
    const prog = state.progress.completed.find(c => c.lesson_id === id);
    if (prog && prog.completed_at) {
      item.classList.add('completed');
    } else {
      item.classList.remove('completed');
    }
  }
}

function setupCodeRunners() {
  const lessonBody = $('.lesson-body');
  if (!lessonBody) return;

  for (const pre of $$('pre', lessonBody)) {
    const code = pre.querySelector('code');
    if (!code) continue;

    const codeText = code.textContent;

    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const output = document.createElement('div');
    output.className = 'output-box';
    wrapper.appendChild(output);

    const btn = document.createElement('button');
    btn.className = 'run-btn';
    btn.textContent = '\u25B6 Run';

    const isPython = [...code.classList].some(c => c === 'language-python' || c === 'lang-python');
    if (isPython) {
      btn.addEventListener('click', () => window.runPythonCode(codeText, output, btn));
    } else {
      btn.style.display = 'none';
    }

    pre.style.position = 'relative';
    pre.appendChild(btn);
  }
}

function renderQuiz(questions, lessonId) {
  const container = document.createElement('div');
  container.className = 'quiz-section';
  container.innerHTML = '<h3 class="quiz-title">\u2699 Lesson Quiz</h3>';

  const results = {};

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const qDiv = document.createElement('div');
    qDiv.className = 'quiz-question';
    qDiv.dataset.index = i;

    const qText = document.createElement('p');
    qText.className = 'quiz-q-text';
    qText.textContent = `${i + 1}. ${q.question}`;
    qDiv.appendChild(qText);

    if (q.type === 'mc') {
      const opts = document.createElement('div');
      opts.className = 'quiz-options';

      for (let j = 0; j < q.options.length; j++) {
        const label = document.createElement('label');
        label.className = 'quiz-option';
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = `q${i}`;
        input.value = j;
        input.addEventListener('change', () => {
          results[i] = { type: 'mc', answer: j, correct: j === q.answer };
          showMcFeedback(qDiv, j, q.answer);
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + q.options[j]));
        opts.appendChild(label);
      }
      qDiv.appendChild(opts);
    } else if (q.type === 'code') {
      const textarea = document.createElement('textarea');
      textarea.className = 'quiz-code-input';
      textarea.rows = 4;
      textarea.placeholder = 'Write your code here...';
      qDiv.appendChild(textarea);

      const hint = document.createElement('div');
      hint.className = 'quiz-hint';
      hint.textContent = '\u2139\ufe0f Hint: ' + q.hint;
      qDiv.appendChild(hint);

      const runBtn = document.createElement('button');
      runBtn.className = 'btn quiz-run-btn';
      runBtn.textContent = '\u25B6 Run & Check';
      qDiv.appendChild(runBtn);

      const feedback = document.createElement('div');
      feedback.className = 'quiz-feedback';
      qDiv.appendChild(feedback);

      runBtn.addEventListener('click', async () => {
        const code = textarea.value.trim();
        if (!code) {
          feedback.textContent = 'Please write some code first.';
          feedback.className = 'quiz-feedback error';
          return;
        }
        runBtn.disabled = true;
        feedback.textContent = 'Running...';
        feedback.className = 'quiz-feedback';

        try {
          if (!window.pyodide) {
            feedback.textContent = 'Loading Python runtime...';
            await new Promise(resolve => {
              const check = () => {
                if (window.pyodide) resolve();
                else setTimeout(check, 200);
              };
              check();
            });
          }

          window.pyodide.runPython(`
import sys
from io import StringIO
_stdout = StringIO()
sys.stdout = _stdout
          `);
          window.pyodide.runPython(code);
          window.pyodide.runPython('sys.stdout = sys.__stdout__');
          const output = (window.pyodide.runPython('_stdout.getvalue()') || '').trim();

          const cleanCode = code.replace(/\r\n/g, '\n').trim();
          const cleanSolution = q.solution.replace(/\r\n/g, '\n').trim();

          const isCorrect = cleanCode === cleanSolution;
          results[i] = { type: 'code', correct: isCorrect };

          if (isCorrect) {
            feedback.textContent = '\u2713 Correct! Output: ' + (output || '(empty)');
            feedback.className = 'quiz-feedback correct';
          } else {
            feedback.textContent = `\u2717 Code doesn't match expected solution.\nYour output: ${output || '(empty)'}`;
            feedback.className = 'quiz-feedback error';
          }
        } catch (err) {
          feedback.textContent = 'Error: ' + err.message;
          feedback.className = 'quiz-feedback error';
          results[i] = { type: 'code', correct: false };
        } finally {
          runBtn.disabled = false;
        }
      });

      const showBtn = document.createElement('button');
      showBtn.className = 'btn quiz-show-btn';
      showBtn.textContent = 'Show Solution';
      showBtn.addEventListener('click', () => {
        const existing = qDiv.querySelector('.quiz-solution');
        if (existing) {
          existing.remove();
          showBtn.textContent = 'Show Solution';
        } else {
          const sol = document.createElement('pre');
          sol.className = 'quiz-solution';
          sol.textContent = q.solution;
          qDiv.appendChild(sol);
          showBtn.textContent = 'Hide Solution';
        }
      });
      qDiv.appendChild(showBtn);
    }

    container.appendChild(qDiv);
  }

  const submitBtn = document.createElement('button');
  submitBtn.className = 'btn quiz-submit-btn';
  submitBtn.textContent = 'Submit Quiz';
  container.appendChild(submitBtn);

  const scoreDisplay = document.createElement('div');
  scoreDisplay.className = 'quiz-score';
  container.appendChild(scoreDisplay);

  submitBtn.addEventListener('click', async () => {
    let score = 0;
    let total = questions.length;
    for (const idx in results) {
      if (results[idx].correct) score++;
    }
    const answered = Object.keys(results).length;
    if (answered < total) {
      scoreDisplay.textContent = `Answer all questions first (${answered}/${total} answered).`;
      scoreDisplay.className = 'quiz-score pending';
      return;
    }
    try {
      await fetchJSON('/api/progress/quiz-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          score,
          total,
          answers: JSON.stringify(results),
        }),
      });
      scoreDisplay.textContent = `\u2713 Quiz submitted! Score: ${score}/${total} (${Math.round(score/total*100)}%)`;
      scoreDisplay.className = 'quiz-score success';
      submitBtn.disabled = true;
      state.progress = await fetchJSON('/api/progress');
      updateSidebarCompletion();
    } catch (err) {
      if (err.message.includes('401')) {
        showAuthModal('login');
      } else {
        scoreDisplay.textContent = 'Failed to submit: ' + err.message;
        scoreDisplay.className = 'quiz-score error';
      }
    }
  });

  return container;
}

function showCelebration() {
  const el = document.createElement('div');
  el.className = 'celebration';
  el.innerHTML = '<div class="celebration-icon">\u2728</div><div class="celebration-text">Lesson Complete!</div><div class="celebration-sub">Keep going — you\'re building real skills.</div>';
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 400);
  }, 2200);
}

function renderNextButton(lessonId) {
  const footer = $('#lesson-footer');
  if (!footer) return;
  const next = getNextLesson(lessonId);
  footer.innerHTML = '';
  if (!next) {
    footer.innerHTML = '<div class="next-lesson-end">\u2728 You\'ve completed all lessons in this skill!</div>';
    return;
  }
  const btn = document.createElement('button');
  btn.className = 'btn next-lesson-btn';
  btn.innerHTML = 'Next Lesson \u2192';
  btn.addEventListener('click', () => loadLesson(next.id));
  footer.appendChild(btn);
}

function showMcFeedback(qDiv, selected, correct) {
  let fb = qDiv.querySelector('.quiz-feedback');
  if (!fb) {
    fb = document.createElement('div');
    fb.className = 'quiz-feedback';
    qDiv.appendChild(fb);
  }
  if (selected === correct) {
    fb.textContent = '\u2713 Correct!';
    fb.className = 'quiz-feedback correct';
  } else {
    const opts = qDiv.querySelectorAll('.quiz-option');
    const correctText = opts[correct] ? opts[correct].textContent.trim() : '';
    fb.textContent = `\u2717 Wrong. The answer was: ${correctText}`;
    fb.className = 'quiz-feedback error';
  }
}

// === AUTH ===
async function login(email, password) {
  const data = await fetchJSON('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  state.currentUser = data.user;
  updateAuthUI();
  closeModal();
  if (state.currentUser.theme) applyTheme(state.currentSkill || 'python');
}

async function register(username, email, password) {
  const data = await fetchJSON('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  state.currentUser = data.user;
  updateAuthUI();
  closeModal();
}

async function logout() {
  await fetchJSON('/api/auth/logout', { method: 'POST' });
  state.currentUser = null;
  updateAuthUI();
  showDashboard();
  applyTheme(state.currentSkill || 'python');
}

function showAuthModal(tab) {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'auth-modal';
  overlay.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" id="modal-close">&times;</button>
      <div class="auth-tabs">
        <button class="auth-tab ${tab === 'login' ? 'active' : ''}" data-tab="login">Login</button>
        <button class="auth-tab ${tab === 'register' ? 'active' : ''}" data-tab="register">Register</button>
      </div>
      <div class="auth-form" id="auth-form"></div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  $('#modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  for (const btn of $$('.auth-tab')) {
    btn.addEventListener('click', () => renderAuthForm(btn.dataset.tab));
  }

  renderAuthForm(tab);
}

function closeModal() {
  for (const m of $$('.modal-overlay')) {
    m.classList.remove('show');
    setTimeout(() => m.remove(), 300);
  }
}

function renderAuthForm(tab) {
  const form = $('#auth-form');
  const tabs = $$('.auth-tab');
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));

  if (tab === 'login') {
    form.innerHTML = `
      <input type="email" id="auth-email" placeholder="Email" class="auth-input" autocomplete="email" />
      <input type="password" id="auth-password" placeholder="Password" class="auth-input" autocomplete="current-password" />
      <button class="auth-submit" id="auth-submit">Login</button>
      <div class="auth-error" id="auth-error"></div>
    `;
    $('#auth-submit').addEventListener('click', async () => {
      const email = $('#auth-email').value;
      const password = $('#auth-password').value;
      try {
        await login(email, password);
      } catch (e) {
        $('#auth-error').textContent = 'Invalid email or password';
      }
    });
    $('#auth-password').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') $('#auth-submit').click();
    });
  } else {
    form.innerHTML = `
      <input type="text" id="auth-username" placeholder="Username" class="auth-input" autocomplete="username" />
      <input type="email" id="auth-email" placeholder="Email" class="auth-input" autocomplete="email" />
      <input type="password" id="auth-password" placeholder="Password (min 6 chars)" class="auth-input" autocomplete="new-password" />
      <button class="auth-submit" id="auth-submit">Register</button>
      <div class="auth-error" id="auth-error"></div>
    `;
    $('#auth-submit').addEventListener('click', async () => {
      const username = $('#auth-username').value;
      const email = $('#auth-email').value;
      const password = $('#auth-password').value;
      try {
        await register(username, email, password);
      } catch (e) {
        $('#auth-error').textContent = e.message;
      }
    });
    $('#auth-password').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') $('#auth-submit').click();
    });
  }
}

function updateAuthUI() {
  const el = $('#auth-control');
  if (!el) return;
  if (state.currentUser) {
    const letter = state.currentUser.username.charAt(0).toUpperCase();
    el.innerHTML = `<div class="profile-avatar" id="btn-profile" title="${state.currentUser.username}">${letter}</div>`;
    $('#btn-profile').addEventListener('click', showProfileModal);
  } else {
    el.innerHTML = `<button id="btn-login">Login</button>`;
    $('#btn-login').addEventListener('click', () => showAuthModal('login'));
  }
}

function showProfileModal() {
  closeModal();
  const user = state.currentUser;
  if (!user) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'profile-modal';
  overlay.innerHTML = `
    <div class="modal-content profile-modal">
      <button class="modal-close" id="modal-close">&times;</button>
      <div class="profile-avatar-large">${user.username.charAt(0).toUpperCase()}</div>
      <div class="profile-name">${user.username}</div>
      <div class="profile-email">${user.email}</div>

      <div class="profile-section">
        <div class="profile-section-title">Settings</div>

        <label class="profile-label">Username</label>
        <input type="text" id="prof-username" value="${user.username}" class="auth-input" />

        <label class="profile-label" style="margin-top:0.75rem;">New Password</label>
        <input type="password" id="prof-password" placeholder="Leave blank to keep current" class="auth-input" autocomplete="new-password" />

        <label class="profile-label" style="margin-top:0.75rem;">YouTube Music URL</label>
        <input type="text" id="prof-music-url" value="${user.music_url || ''}" placeholder="https://youtu.be/..." class="auth-input" />
        <div class="profile-hint">Paste a YouTube link for background music. Leave empty for the default theme track.</div>

        <label class="profile-label" style="margin-top:0.75rem;">Theme</label>
        <select id="prof-theme" class="auth-input">
          ${Object.entries(state.themesConfig.themes || {}).map(([key, t]) =>
            `<option value="${key}" ${(user.theme || 'cyberpunk') === key ? 'selected' : ''}>${t.name}</option>`
          ).join('')}
        </select>
      </div>

      <button class="auth-submit" id="prof-save">Save Changes</button>
      <div class="auth-error" id="prof-error"></div>
      <div class="auth-success" id="prof-success"></div>

      <button class="profile-logout" id="prof-logout">Logout</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  $('#modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  $('#prof-save').addEventListener('click', saveProfile);
  $('#prof-logout').addEventListener('click', logout);

  for (const input of $$('#prof-password, #prof-music-url, #prof-theme')) {
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveProfile(); });
  }
}

async function saveProfile() {
  const errEl = $('#prof-error');
  const okEl = $('#prof-success');
  if (errEl) errEl.textContent = '';
  if (okEl) okEl.textContent = '';

  const body = {};
  const username = $('#prof-username').value.trim();
  if (username && username !== state.currentUser.username) body.username = username;

  const password = $('#prof-password').value;
  if (password) {
    if (password.length < 6) {
      if (errEl) errEl.textContent = 'Password must be at least 6 characters';
      return;
    }
    body.password = password;
  }

  const musicUrl = $('#prof-music-url').value.trim();
  body.music_url = musicUrl;

  const theme = $('#prof-theme').value;
  if (theme && theme !== (state.currentUser.theme || 'cyberpunk')) body.theme = theme;

  try {
    const data = await fetchJSON('/api/auth/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    state.currentUser = data.user;
    updateAuthUI();
    if (body.theme) applyTheme(state.currentSkill || 'python');
    if (okEl) okEl.textContent = 'Saved!';
    if (musicPlaying && ytPlayer) {
      const vidId = getCurrentVideoId();
      if (vidId) ytPlayer.loadVideoById(vidId);
    }
    $('#music-label').textContent = musicUrl ? 'Custom track' : 'Saved';
    setTimeout(closeModal, 800);
  } catch (e) {
    if (errEl) errEl.textContent = e.message;
  }
}

async function showDashboard() {
  const content = $('#content');
  state.currentLesson = null;

  $$('.lesson-item.active').forEach(el => el.classList.remove('active'));

  if (!state.currentUser) {
    content.innerHTML = `
      <div class="dashboard" style="text-align:center; padding-top:4rem;">
        <h2 class="dashboard-title">Welcome to Learn Hub</h2>
        <p style="color:var(--text-dim); margin-bottom:1.5rem;">Login or create an account to track your progress.</p>
        <button class="btn btn-lg" data-auth-action="login">Login</button>
        <button class="btn btn-lg" data-auth-action="register">Register</button>
      </div>
    `;
    for (const btn of $$('[data-auth-action]')) {
      btn.addEventListener('click', () => showAuthModal(btn.dataset.authAction));
    }
    return;
  }

  const data = await fetchJSON('/api/progress/dashboard');

  const skills = Object.keys(data.totals).sort((a, b) => {
    const ai = SKILL_ORDER.indexOf(a);
    const bi = SKILL_ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  const totalCompleted = Object.values(data.completed).reduce((a, b) => a + b, 0);
  const totalLessons = Object.values(data.totals).reduce((a, b) => a + b, 0);
  const overallPct = totalLessons > 0 ? Math.round(totalCompleted / totalLessons * 100) : 0;

  let html = `
    <div class="dashboard">
      <h2 class="dashboard-title">Your Training Progress</h2>
      <div class="dashboard-overall">
        <div class="dashboard-stat">
          <span class="dashboard-stat-value">${totalCompleted}/${totalLessons}</span>
          <span class="dashboard-stat-label">Lessons Done</span>
        </div>
        <div class="dashboard-stat">
          <span class="dashboard-stat-value">${data.streak}</span>
          <span class="dashboard-stat-label">Day Streak</span>
        </div>
        <div class="dashboard-bar-container">
          <div class="dashboard-bar" style="width:${overallPct}%"></div>
          <span class="dashboard-bar-label">${overallPct}% complete</span>
        </div>
      </div>
      <div class="dashboard-skills">
  `;

  for (const skill of skills) {
    const done = data.completed[skill] || 0;
    const total = data.totals[skill] || 0;
    const pct = total > 0 ? Math.round(done / total * 100) : 0;
    const quizAvg = data.quizScores[skill];
    const name = skill.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    html += `
      <div class="dashboard-skill-card">
        <div class="dashboard-skill-header">
          <span class="dashboard-skill-name">${name}</span>
          <span class="dashboard-skill-count">${done}/${total}</span>
        </div>
        <div class="dashboard-bar-container small">
          <div class="dashboard-bar" style="width:${pct}%"></div>
        </div>
        <div class="dashboard-skill-stats">
          <span>${pct}% complete</span>
          ${quizAvg !== undefined ? `<span>Quiz avg: ${quizAvg}%</span>` : '<span>No quizzes taken</span>'}
        </div>
      </div>
    `;
  }

  html += `</div>`;

  if (data.bookmarks.length > 0) {
    html += `<div class="dashboard-bookmarks"><h3>Bookmarks</h3><ul>`;
    for (const bm of data.bookmarks) {
      html += `<li class="dashboard-bookmark-item" data-id="${bm.lessonId}">${bm.label}: ${bm.lessonId}</li>`;
    }
    html += `</ul></div>`;
  }

  html += `</div>`;
  content.innerHTML = html;

  for (const item of $$('.dashboard-bookmark-item')) {
    item.addEventListener('click', () => loadLesson(item.dataset.id));
  }
}

window.onPyodideReady = () => {};

$('#search').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  for (const item of $$('.lesson-item')) {
    const title = item.textContent.toLowerCase();
    item.style.display = title.includes(q) ? '' : 'none';
  }
});

$('#logo-click').addEventListener('click', () => {
  showDashboard();
});

(async function init() {
  await loadThemesConfig();
  setupMusicControl();
  try {
    const me = await fetchJSON('/api/auth/me');
    state.currentUser = me.user;
  } catch {
    state.currentUser = null;
  }
  updateAuthUI();
  if (state.currentUser?.theme) applyTheme(state.currentSkill || 'python');
  await loadSidebar();
  showDashboard();
})();
