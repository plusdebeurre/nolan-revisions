/**
 * Reusable MCQ quiz engine for Nolan Grade 2 Learning Hub.
 * QuizEngine.mount({ subject, title, subtitle, backHref, homeHref, quizData, ... })
 * Loads FunEffects if present (confetti / streak / shake).
 */
(function (global) {
  const SUBJECT_LABEL = {
    math: 'Math',
    science: 'Science',
    english: 'English',
    hpe: 'HPE',
    thai: 'Thai'
  };

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function fun() {
    return global.FunEffects || null;
  }

  function ensureFunEffects(cb) {
    if (global.FunEffects) {
      cb();
      return;
    }
    const s = document.createElement('script');
    s.src = (document.currentScript && document.currentScript.src)
      ? document.currentScript.src.replace(/quiz-engine\.js.*/, 'fun-effects.js')
      : '../../../js/fun-effects.js';
    // Prefer relative to quiz-engine location
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src && scripts[i].src.indexOf('quiz-engine.js') !== -1) {
        s.src = scripts[i].src.replace('quiz-engine.js', 'fun-effects.js');
        break;
      }
    }
    s.onload = cb;
    s.onerror = cb;
    document.head.appendChild(s);
  }

  function mount(config) {
    ensureFunEffects(() => mountInner(config));
  }

  function mountInner(config) {
    const {
      subject = 'math',
      title = 'Quiz',
      subtitle = 'Grade 2',
      backHref = '../index.html',
      homeHref = '../../../index.html',
      quizData = [],
      perfectMessage = 'Perfect score! You are a champion! 🌟',
      goodMessage = 'Great job! Keep it up! 👍',
      tryAgainMessage = 'Good try! Practice again and you will get there! 💪',
      goodThreshold = 0.7
    } = config;

    document.body.className = `game theme-${subject}`;
    const app = document.getElementById('app') || document.body.appendChild(el('div', '', null));
    app.id = 'app';
    app.className = 'w-full max-w-2xl mx-auto px-4 py-6';

    const subjectName = SUBJECT_LABEL[subject] || 'Subject';
    let currentQuestionIndex = 0;
    let score = 0;
    let canAnswer = true;
    let streak = 0;

    app.innerHTML = `
      <div class="score-hud" id="live-score-hud">Score: 0 / ${quizData.length}</div>
      <div class="nav-bar">
        <a class="nav-link" href="${backHref}">← ${subjectName}</a>
        <a class="nav-link" href="${homeHref}">🏠 Home</a>
      </div>
      <div class="mb-6 text-center animate-pop" id="header-section">
        <h1 class="text-3xl md:text-4xl font-bold mb-2 drop-shadow-sm" style="color: var(--accent-dark)">${title}</h1>
        <p class="text-lg text-slate-500 font-medium">${subtitle}</p>
        <div class="progress-track">
          <div id="progress-bar" class="progress-bar-fill"></div>
        </div>
        <p id="question-tracker" class="mt-2 text-sm font-semibold" style="color: var(--accent)">Question 1 of ${quizData.length}</p>
        <p id="live-score-line" class="live-score-line">Score: 0</p>
      </div>
      <div id="quiz-container" class="question-card p-6 md:p-8 animate-pop">
        <h2 id="question-text" class="text-2xl md:text-3xl font-semibold text-center mb-8 text-slate-700 leading-snug"></h2>
        <div id="options-grid" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"></div>
        <div id="hint-area" class="mb-4 hidden">
          <button type="button" id="hint-btn" class="btn-hint"><span>🦉 Get a hint from Mr. Owl</span></button>
          <div id="hint-display" class="hidden mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-xl text-purple-800 text-sm md:text-base font-medium animate-pop"></div>
        </div>
        <div id="feedback-area" class="hidden text-center p-4 rounded-xl mb-6 text-lg font-medium animate-pop"></div>
        <div class="text-center">
          <button type="button" id="next-btn" class="hidden btn-primary">Next Question 🚀</button>
        </div>
      </div>
      <div id="result-screen" class="hidden question-card p-8 text-center animate-pop">
        <div class="text-6xl mb-4">🏆</div>
        <h2 class="text-4xl font-bold mb-4" style="color: var(--accent-dark)">Quiz Complete!</h2>
        <p class="text-2xl font-medium text-slate-600 mb-6">
          You scored <span id="score-display" class="font-bold text-3xl" style="color: var(--accent)"></span> out of ${quizData.length}!
        </p>
        <p id="result-message" class="text-lg text-slate-500 mb-8 font-medium"></p>
        <button type="button" id="restart-btn" class="btn-primary">Play Again 🔄</button>
      </div>
    `;

    const questionText = document.getElementById('question-text');
    const optionsGrid = document.getElementById('options-grid');
    const feedbackArea = document.getElementById('feedback-area');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const questionTracker = document.getElementById('question-tracker');
    const quizContainer = document.getElementById('quiz-container');
    const resultScreen = document.getElementById('result-screen');
    const scoreDisplay = document.getElementById('score-display');
    const resultMessage = document.getElementById('result-message');
    const restartBtn = document.getElementById('restart-btn');
    const headerSection = document.getElementById('header-section');
    const hintArea = document.getElementById('hint-area');
    const hintBtn = document.getElementById('hint-btn');
    const hintDisplay = document.getElementById('hint-display');
    const liveHud = document.getElementById('live-score-hud');
    const liveLine = document.getElementById('live-score-line');

    const hasAnyHints = quizData.some((q) => q.hint);

    function updateScoreUI() {
      const text = `Score: ${score} / ${quizData.length}`;
      if (liveHud) liveHud.textContent = text;
      if (liveLine) liveLine.textContent = `Score: ${score}`;
      if (fun()) fun().pulseScore(liveHud);
    }

    function loadQuestion() {
      canAnswer = true;
      feedbackArea.classList.add('hidden');
      nextBtn.classList.add('hidden');
      optionsGrid.innerHTML = '';
      hintDisplay.classList.add('hidden');
      hintDisplay.textContent = '';

      const current = quizData[currentQuestionIndex];
      questionText.textContent = current.question;
      questionTracker.textContent = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
      progressBar.style.width = `${(currentQuestionIndex / quizData.length) * 100}%`;

      if (hasAnyHints && current.hint) {
        hintArea.classList.remove('hidden');
        hintBtn.classList.remove('hidden');
        hintBtn.innerHTML = '<span>🦉 Get a hint from Mr. Owl</span>';
      } else {
        hintArea.classList.add('hidden');
      }

      optionsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-6';

      current.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = option;
        button.className = 'option-btn';
        button.addEventListener('click', () => selectAnswer(index));
        optionsGrid.appendChild(button);
      });
    }

    function selectAnswer(selectedIndex) {
      if (!canAnswer) return;
      canAnswer = false;
      const current = quizData[currentQuestionIndex];
      const isCorrect = selectedIndex === current.correctAnswer;
      const buttons = optionsGrid.children;

      for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.cursor = 'default';
        if (i === current.correctAnswer) buttons[i].classList.add('correct');
        else if (i === selectedIndex && !isCorrect) buttons[i].classList.add('wrong');
      }

      hintBtn.classList.add('hidden');
      hintDisplay.classList.add('hidden');
      feedbackArea.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');

      if (isCorrect) {
        score++;
        streak++;
        updateScoreUI();
        if (fun()) {
          fun().showStreak(streak);
          if (streak >= 3) fun().confetti({ count: 12 });
        }
        feedbackArea.classList.add('bg-green-100', 'text-green-800');
        feedbackArea.innerHTML = `<strong>Well done! 🎉</strong><br>${current.explanation}`;
      } else {
        streak = 0;
        if (fun()) fun().shake(quizContainer);
        feedbackArea.classList.add('bg-red-100', 'text-red-800');
        feedbackArea.innerHTML = `<strong>Oops! 🙈</strong><br>${current.explanation}`;
      }
      nextBtn.classList.remove('hidden');
    }

    function showResults() {
      quizContainer.classList.add('hidden');
      headerSection.classList.add('hidden');
      resultScreen.classList.remove('hidden');
      scoreDisplay.textContent = score;
      const ratio = quizData.length ? score / quizData.length : 0;
      if (score === quizData.length) {
        resultMessage.textContent = perfectMessage;
        if (fun()) fun().celebratePerfect();
      } else if (ratio >= goodThreshold) resultMessage.textContent = goodMessage;
      else resultMessage.textContent = tryAgainMessage;
      progressBar.style.width = '100%';

      const gameId =
        config.gameId ||
        (document.body && document.body.getAttribute('data-game-id')) ||
        (global.NolanProgress && global.NolanProgress.inferGameIdFromPath && global.NolanProgress.inferGameIdFromPath());
      if (gameId && global.NolanProgress && global.NolanProgress.recordResult) {
        const recorded = global.NolanProgress.recordResult(gameId, {
          score,
          total: quizData.length
        });
        if (recorded) {
          document.dispatchEvent(new CustomEvent('nolan:progress', { detail: recorded }));
          if (recorded.medal === 'gold' && fun()) fun().confetti({ count: 20 });
        }
      }
    }

    hintBtn.addEventListener('click', () => {
      const current = quizData[currentQuestionIndex];
      if (!current.hint || !canAnswer) return;
      hintDisplay.innerHTML = `<strong>Mr. Owl says:</strong> ${current.hint}`;
      hintDisplay.classList.remove('hidden');
    });

    nextBtn.addEventListener('click', () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizData.length) loadQuestion();
      else showResults();
    });

    restartBtn.addEventListener('click', () => {
      currentQuestionIndex = 0;
      score = 0;
      streak = 0;
      updateScoreUI();
      resultScreen.classList.add('hidden');
      headerSection.classList.remove('hidden');
      quizContainer.classList.remove('hidden');
      loadQuestion();
    });

    updateScoreUI();
    loadQuestion();
  }

  global.QuizEngine = { mount };
})(window);
