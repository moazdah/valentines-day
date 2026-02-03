(() => {
  const title = document.getElementById("title");
  const sub = document.getElementById("sub");
  const qTitle = document.getElementById("qTitle");
  const qHint = document.getElementById("qHint");
  const choices = document.getElementById("choices");
  const feedback = document.getElementById("feedback");
  const mini = document.getElementById("mini");
  const progressBar = document.getElementById("progressBar");

  // Prøv å begrense typiske zoom snarveier
  window.addEventListener("wheel", (e) => {
    if (e.ctrlKey) e.preventDefault();
  }, { passive: false });

  window.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const isZoomKey = (e.ctrlKey || e.metaKey) && (key === "+" || key === "-" || key === "=" || key === "0");
    if (isZoomKey) e.preventDefault();
  });

  // Spørsmålene
  // Du kan endre tekst her uten å røre resten av koden
  const quiz = [
    {
      title: "Første: hvilket år ble dere sammen",
      hint: "Hint: det var starten på en skikkelig fin reise",
      options: ["2017", "2018", "2019", "2020"],
      correct: "2019",
      correctMsg: "Riktig. Du husker de viktige tingene.",
      wrongMsg: "Nesten. Prøv igjen, Åsmund."
    },
    {
      title: "Hvilken vibe har Maryam når hun er glad i deg",
      hint: "Velg det mest sanne alternativet",
      options: ["Litt glad i deg", "Ganske glad i deg", "Veldig glad i deg", "Utrolig glad i deg"],
      correct: "Utrolig glad i deg",
      correctMsg: "Jepp. Det der er fasiten.",
      wrongMsg: "Det der høres altfor lite ut. Prøv igjen."
    },
    {
      title: "Hva er Maryams favoritt ting med dere to",
      hint: "Tenk på alt dere har gjort sammen siden 2019",
      options: [
        "At dere tør å finne på ting sammen",
        "At dere er best på å krangle",
        "At dere aldri reiser",
        "At dere bare møtes på mandager"
      ],
      correct: "At dere tør å finne på ting sammen",
      correctMsg: "Riktig. Dere er et team.",
      wrongMsg: "Nei nei. Tenk romantisk og ekte."
    },
    {
      title: "Siste før du låser opp spørsmålet",
      hint: "Velg setningen som Maryam mener mest",
      options: [
        "Du er ganske ok",
        "Du er en fin fyr",
        "Du er min person",
        "Du får være med hvis det passer"
      ],
      correct: "Du er min person",
      correctMsg: "Der ja. Nå er du klar.",
      wrongMsg: "Det der er ikke Maryam energi. Prøv igjen."
    }
  ];

  let step = 0;
  let locked = false;

  function setProgress() {
    const total = quiz.length + 1;
    const current = Math.min(step + 1, total);
    const pct = Math.round((current / total) * 100);
    progressBar.style.width = `${pct}%`;
  }

  function clearChoices() {
    choices.innerHTML = "";
  }

  function pulseHearts(amount) {
    for (let i = 0; i < amount; i++) burstHeart();
  }

  function renderQuestion() {
    locked = false;
    setProgress();

    title.textContent = "Åsmund, dette er til deg";
    sub.textContent = "Svar riktig for å låse opp neste spørsmål. Ett om gangen.";

    const q = quiz[step];
    qTitle.textContent = q.title;
    qHint.textContent = q.hint;
    feedback.textContent = "Velg et svar.";
    mini.textContent = `Spørsmål ${step + 1} av ${quiz.length}`;

    clearChoices();

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn";
      btn.textContent = opt;

      btn.addEventListener("click", () => {
        if (locked) return;

        if (opt === q.correct) {
          locked = true;
          feedback.textContent = q.correctMsg;
          pulseHearts(18);

          setTimeout(() => {
            step += 1;
            if (step < quiz.length) {
              renderQuestion();
            } else {
              renderValentines();
            }
          }, 650);
        } else {
          feedback.textContent = q.wrongMsg;
          pulseHearts(6);
        }
      });

      choices.appendChild(btn);
    });
  }

  function renderValentines() {
    locked = false;
    setProgress();

    title.textContent = "Ok. En siste ting";
    sub.textContent = "Dette er den enkle delen.";

    qTitle.textContent = "Åsmund, vil du være Maryams Valentines";
    qHint.textContent = "Det finnes egentlig bare ett riktig svar.";

    clearChoices();

    const stage = document.createElement("div");
    stage.className = "stageVal";
    stage.id = "stageVal";
    choices.appendChild(stage);

    const yesBtn = document.createElement("button");
    yesBtn.type = "button";
    yesBtn.className = "btn valYes";
    yesBtn.textContent = "Ja";

    const noBtn = document.createElement("button");
    noBtn.type = "button";
    noBtn.className = "btn valNo";
    noBtn.textContent = "Nei";
    noBtn.id = "noBtn";

    stage.appendChild(yesBtn);
    stage.appendChild(noBtn);

    feedback.textContent = "Velg med hjertet.";
    mini.textContent = "Tips: prøv å trykke Nei hvis du klarer.";

    requestAnimationFrame(() => {
      placeNoAsFloating(stage, noBtn);
      const r = randomWithinStage(stage, noBtn);
      noBtn.style.left = `${r.x}px`;
      noBtn.style.top = `${r.y}px`;
    });

    yesBtn.addEventListener("click", () => {
      if (locked) return;
      locked = true;

      feedback.innerHTML = "<strong>Yesss.</strong> Maryam blir veldig, veldig glad.";
      mini.textContent = "Skjermbilde denne og send til Maryam.";

      pulseHearts(40);
      noBtn.style.pointerEvents = "none";
    });

    stage.addEventListener("mousemove", (e) => proximityCheck(stage, noBtn, e.clientX, e.clientY));
    stage.addEventListener("touchstart", (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      proximityCheck(stage, noBtn, t.clientX, t.clientY);
    }, { passive: true });

    stage.addEventListener("touchmove", (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      proximityCheck(stage, noBtn, t.clientX, t.clientY);
    }, { passive: true });

    window.addEventListener("resize", () => {
      const r = randomWithinStage(stage, noBtn);
      noBtn.style.left = `${r.x}px`;
      noBtn.style.top = `${r.y}px`;
    });
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function placeNoAsFloating(stage, noBtn) {
    const stageRect = stage.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();
    const left = noRect.left - stageRect.left;
    const top = noRect.top - stageRect.top;
    noBtn.style.position = "absolute";
    noBtn.style.left = `${left}px`;
    noBtn.style.top = `${top}px`;
  }

  function randomWithinStage(stage, noBtn) {
    const stageRect = stage.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();
    const pad = 12;
    const maxX = stageRect.width - noRect.width - pad;
    const maxY = stageRect.height - noRect.height - pad;
    const x = Math.random() * (maxX - pad) + pad;
    const y = Math.random() * (maxY - pad) + pad;
    return { x, y };
  }

  function moveNoAway(stage, noBtn, pointerX, pointerY) {
    const stageRect = stage.getBoundingClientRect();
    const noRect = noBtn.getBoundingClientRect();

    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;

    const dx = noCenterX - pointerX;
    const dy = noCenterY - pointerY;

    const len = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / len;
    const uy = dy / len;

    const baseJump = 140;
    const chaos = 70;

    const currentLeft = parseFloat(noBtn.style.left || "0");
    const currentTop = parseFloat(noBtn.style.top || "0");

    let nextLeft = currentLeft + ux * baseJump + (Math.random() * chaos - chaos / 2);
    let nextTop = currentTop + uy * baseJump + (Math.random() * chaos - chaos / 2);

    const pad = 10;
    const maxLeft = stageRect.width - noRect.width - pad;
    const maxTop = stageRect.height - noRect.height - pad;

    nextLeft = clamp(nextLeft, pad, maxLeft);
    nextTop = clamp(nextTop, pad, maxTop);

    const stuck = (Math.abs(nextLeft - currentLeft) < 2 && Math.abs(nextTop - currentTop) < 2);
    if (stuck) {
      const r = randomWithinStage(stage, noBtn);
      nextLeft = r.x;
      nextTop = r.y;
    }

    noBtn.style.left = `${nextLeft}px`;
    noBtn.style.top = `${nextTop}px`;

    const lines = [
      "Nei fikk panikk og forsvant.",
      "Nei prøvde å sabotere, men nei.",
      "Nei rømmer fortsatt.",
      "Nei er allergisk mot romantikk."
    ];
    feedback.textContent = lines[Math.floor(Math.random() * lines.length)];
    pulseHearts(10);
  }

  function proximityCheck(stage, noBtn, clientX, clientY) {
    const noRect = noBtn.getBoundingClientRect();
    const cx = noRect.left + noRect.width / 2;
    const cy = noRect.top + noRect.height / 2;
    const dist = Math.hypot(cx - clientX, cy - clientY);
    const threshold = 150;
    if (dist < threshold) moveNoAway(stage, noBtn, clientX, clientY);
  }

  // Flytende hjerter i bakgrunnen via canvas
  const canvas = document.getElementById("heartsCanvas");
  const ctx = canvas.getContext("2d");

  let W = 0;
  let H = 0;
  const hearts = [];

  function resizeCanvas() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function randomHeart() {
    return {
      x: Math.random() * W,
      y: H + 20 + Math.random() * H * 0.2,
      s: 8 + Math.random() * 14,
      vy: 0.4 + Math.random() * 0.9,
      vx: (Math.random() - 0.5) * 0.35,
      a: 0.35 + Math.random() * 0.35,
      r: (Math.random() - 0.5) * 0.02,
      rot: Math.random() * Math.PI * 2,
      c: Math.random() > 0.5 ? "rgba(255,47,104,0.55)" : "rgba(255,122,160,0.50)"
    };
  }

  function drawHeart(x, y, size, rot, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;

    const s = size;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(0, 0, -s * 0.6, 0, -s * 0.6, s * 0.35);
    ctx.bezierCurveTo(-s * 0.6, s * 0.8, 0, s * 0.95, 0, s * 1.25);
    ctx.bezierCurveTo(0, s * 0.95, s * 0.6, s * 0.8, s * 0.6, s * 0.35);
    ctx.bezierCurveTo(s * 0.6, 0, 0, 0, 0, s * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < hearts.length; i++) {
      const h = hearts[i];
      h.y -= h.vy;
      h.x += h.vx;
      h.rot += h.r;

      drawHeart(h.x, h.y, h.s, h.rot, h.c, h.a);

      if (h.y < -40) {
        hearts[i] = randomHeart();
        hearts[i].y = H + 40;
      }
    }

    requestAnimationFrame(tick);
  }

  function burstHeart() {
    hearts.push(randomHeart());
    if (hearts.length > 36) hearts.shift();
  }

  function initBackground() {
    resizeCanvas();
    hearts.length = 0;
    for (let i = 0; i < 26; i++) hearts.push(randomHeart());
    tick();
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  initBackground();
  renderQuestion();
})();
