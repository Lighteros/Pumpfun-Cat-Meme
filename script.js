const PUMPCAT = {
  name: "Pumpfun Cat",
  symbol: "PUMPCAT",
  ca: "9sJJSXjHeM8ZrpczowrBYhqNU3dyHU8nQnvm6CH2pump",
  x: "https://x.com/PumpfunCatMeme",
  pumpSwapBase: "https://swap.pump.fun",
  dexBase: "https://dexscreener.com/solana",
};

function caValue() {
  return (PUMPCAT.ca || "").trim();
}

function buyUrl() {
  const ca = caValue();
  if (!ca) return PUMPCAT.pumpSwapBase;
  return `${PUMPCAT.pumpSwapBase}/?inputMint=So11111111111111111111111111111111111111112&outputMint=${ca}`;
}

function chartUrl() {
  const ca = caValue();
  return ca ? `${PUMPCAT.dexBase}/${ca}` : PUMPCAT.dexBase;
}

function embedUrl() {
  const pair = chartUrl();
  return `${pair}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=light&theme=light&chartStyle=0&chartType=usd&interval=15`;
}

function wireLinks() {
  const buy = buyUrl();
  const chart = chartUrl();
  document.querySelectorAll("[data-link='buy']").forEach((el) => el.setAttribute("href", buy));
  document.querySelectorAll("[data-link='chart']").forEach((el) => el.setAttribute("href", chart));
  document.querySelectorAll("[data-link='x']").forEach((el) => el.setAttribute("href", PUMPCAT.x));

  const frame = document.getElementById("dex-frame");
  if (frame) frame.src = embedUrl();

  const caDisplay = document.getElementById("ca-display");
  if (caDisplay) caDisplay.textContent = caValue() || "Posting at launch";
}

function setupCopy() {
  const btn = document.getElementById("copy-ca");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    const value = caValue();
    if (!value) {
      btn.textContent = "Soon";
      setTimeout(() => { btn.textContent = "Copy"; }, 1200);
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      btn.classList.add("copied");
      btn.textContent = "Copied";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = "Copy";
      }, 1400);
    } catch {
      btn.textContent = "Failed";
      setTimeout(() => { btn.textContent = "Copy"; }, 1200);
    }
  });
}

function setupNav() {
  const nav = document.getElementById("nav");
  const btn = document.getElementById("menu-btn");
  const links = document.getElementById("nav-links");

  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (btn && links) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }
}

function setupFloatField() {
  const canvas = document.getElementById("float-field");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const items = [];
  let width = 0;
  let height = 0;
  let raf = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function spawn() {
    items.length = 0;
    const count = Math.min(28, Math.floor(width / 48));
    for (let i = 0; i < count; i += 1) {
      items.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 7 + Math.random() * 11,
        s: 0.18 + Math.random() * 0.45,
        a: Math.random() * Math.PI * 2,
        kind: Math.random() > 0.55 ? "pill" : "paw",
      });
    }
  }

  function drawPill(item) {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.a);
    const w = item.r * 2.3;
    const h = item.r;
    ctx.beginPath();
    ctx.roundRect(-w, -h / 2, w * 2, h, h / 2);
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(0, -h / 2, w, h, h / 2);
    ctx.fillStyle = "rgba(0,200,83,0.72)";
    ctx.fill();
    ctx.restore();
  }

  function drawPaw(item) {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#00a644";
    const s = item.r * 0.35;
    ctx.beginPath();
    ctx.ellipse(0, 4, s * 1.4, s, 0, 0, Math.PI * 2);
    ctx.fill();
    [[-8, -4], [8, -4], [-3, -10], [3, -10]].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, s * 0.7, s * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    items.forEach((item) => {
      item.y -= item.s;
      item.x += Math.sin(item.y / 40) * 0.25;
      item.a += 0.004;
      if (item.y < -30) {
        item.y = height + 20;
        item.x = Math.random() * width;
      }
      if (item.kind === "pill") drawPill(item);
      else drawPaw(item);
    });
    raf = requestAnimationFrame(tick);
  }

  resize();
  spawn();
  tick();
  window.addEventListener("resize", () => {
    resize();
    spawn();
  });
  window.addEventListener("beforeunload", () => cancelAnimationFrame(raf));
}

function setupParallax() {
  const plate = document.querySelector(".hero-orbit");
  if (!plate) return;
  window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;
    plate.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  wireLinks();
  setupCopy();
  setupNav();
  setupFloatField();
  setupParallax();
});
