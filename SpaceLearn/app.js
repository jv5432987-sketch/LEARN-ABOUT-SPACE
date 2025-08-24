// ---- Simple content store ----
const CONTENT = {
  topics: [
    {
      title: "The Solar System",
      tags: ["Planets","Moons","Asteroids"],
      body: `Our solar system hosts 8 planets, dwarf planets like Pluto, and thousands of asteroids/comets.
      Inner planets (Mercury–Mars) are rocky; outer planets (Jupiter–Neptune) are gas/ice giants. A star—the Sun—anchors it all with gravity.`
    },
    {
      title: "Stars & How They Shine",
      tags: ["Fusion","Lifecycles"],
      body: `Stars are giant balls of hot plasma. They shine by fusing hydrogen into helium in their cores, releasing energy.
      Massive stars live fast and die in supernovae; Sun-like stars expand into red giants and end as white dwarfs.`
    },
    {
      title: "Galaxies",
      tags: ["Milky Way","Spirals","Ellipticals"],
      body: `Galaxies are vast star cities. The Milky Way is a barred spiral with ~100–400 billion stars.
      Galaxies collide and merge over billions of years, shaping today’s universe.`
    },
    {
      title: "Black Holes",
      tags: ["Gravity","Event Horizon"],
      body: `Black holes are regions where gravity is so strong that not even light can escape.
      They form from collapsing massive stars or exist as supermassive giants at galaxy centers.`
    },
    {
      title: "Space Missions",
      tags: ["Exploration","Robotics","Human Spaceflight"],
      body: `From Apollo to the ISS and robotic explorers like Voyager, Curiosity, and Chandrayaan, missions expand our knowledge.
      Probes map planets, land on comets, and study the Sun and deep space.`
    }
  ],
  quiz: [
    {
      q: "Which force keeps planets in orbit around the Sun?",
      options: ["Magnetism","Friction","Gravity","Radiation Pressure"],
      answerIndex: 2,
      explain: "Gravity provides the centripetal force that keeps planets in orbit."
    },
    {
      q: "What powers the Sun’s light and heat?",
      options: ["Chemical burning","Nuclear fusion","Radioactivity","Electric currents"],
      answerIndex: 1,
      explain: "Hydrogen nuclei fuse into helium, releasing energy—nuclear fusion."
    },
    {
      q: "The Milky Way is best described as a…",
      options: ["Ring galaxy","Elliptical galaxy","Barred spiral galaxy","Irregular galaxy"],
      answerIndex: 2,
      explain: "Observations show a central bar with spiral arms—barred spiral."
    },
    {
      q: "A black hole’s ‘point of no return’ is called the…",
      options: ["Photon belt","Event horizon","Accretion edge","Relativity rim"],
      answerIndex: 1,
      explain: "The event horizon marks where escape velocity exceeds the speed of light."
    },
    {
      q: "Which planet is known as the Red Planet?",
      options: ["Mars","Venus","Mercury","Jupiter"],
      answerIndex: 0,
      explain: "Mars appears reddish due to iron oxide dust on its surface."
    }
  ],
  glossary: [
    { term: "Astronomy", def: "The scientific study of celestial objects, space, and the universe." },
    { term: "Light-year", def: "Distance light travels in one year (~9.46 trillion km)." },
    { term: "Nebula", def: "A vast cloud of gas and dust in space; star nurseries can form within." },
    { term: "Exoplanet", def: "A planet that orbits a star outside our solar system." },
    { term: "Supernova", def: "A powerful explosion at the end of a massive star’s life." }
  ]
};

// ---- Populate counters ----
function updateStats() {
  document.getElementById("topicCount").textContent = CONTENT.topics.length;
  document.getElementById("quizCount").textContent = CONTENT.quiz.length;
  document.getElementById("glossaryCount").textContent = CONTENT.glossary.length;
}

// ---- Tabs ----
const tabs = document.querySelectorAll(".tabs button");
const tabViews = document.querySelectorAll(".tab");
tabs.forEach(btn => {
  btn.addEventListener("click", () => {
    tabs.forEach(b => b.classList.remove("active"));
    tabViews.forEach(v => v.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ---- Topics render ----
function renderTopics(){
  const root = document.getElementById("topics");
  root.innerHTML = "";
  CONTENT.topics.forEach(t => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <h3>${t.title}</h3>
      <div>${t.tags.map(x=>`<span class="badge">${x}</span>`).join("")}</div>
      <p>${t.body}</p>
    `;
    root.appendChild(el);
  });
}

// ---- Quiz render ----
function renderQuiz(){
  const root = document.getElementById("quiz");
  root.innerHTML = "";
  let score = 0, answered = 0;
  CONTENT.quiz.forEach((item, idx) => {
    const card = document.createElement("article");
    card.className = "card";
    const id = `q${idx}`;
    card.innerHTML = `
      <div class="question"><strong>Q${idx+1}.</strong> ${item.q}</div>
      <div class="options">
        ${item.options.map((opt,i)=>`
          <label style="display:block;margin:4px 0">
            <input type="radio" name="${id}" value="${i}"> ${opt}
          </label>
        `).join("")}
      </div>
      <div class="answer muted"></div>
    `;
    const answerBox = card.querySelector(".answer");
    card.querySelectorAll(`input[name='${id}']`).forEach(r => {
      r.addEventListener("change", (e) => {
        const choice = Number(e.target.value);
        answered++;
        if (choice === item.answerIndex){
          score++;
          answerBox.textContent = "Correct! " + item.explain;
          answerBox.style.color = "var(--good)";
        } else {
          answerBox.textContent = "Not quite. " + item.explain;
          answerBox.style.color = "var(--warn)";
        }
        summary.textContent = `Score: ${score}/${CONTENT.quiz.length}`;
      });
    });
    root.appendChild(card);
  });
  const summary = document.createElement("div");
  summary.className = "card";
  summary.innerHTML = `<strong>Score:</strong> <span class="code">0/${CONTENT.quiz.length}</span>`;
  root.appendChild(summary);
}

// ---- Glossary render ----
function renderGlossary(){
  const root = document.getElementById("glossary");
  root.innerHTML = "";
  const search = document.createElement("input");
  search.placeholder = "Search term…";
  search.style = "width:100%;padding:10px;margin-bottom:8px;border-radius:10px;border:1px solid #1f2937;background:#0b1022;color:#e5e7eb";
  root.appendChild(search);

  const list = document.createElement("div");
  root.appendChild(list);

  function draw(filter=""){
    list.innerHTML = "";
    CONTENT.glossary
      .filter(x => x.term.toLowerCase().includes(filter.toLowerCase()))
      .sort((a,b)=>a.term.localeCompare(b.term))
      .forEach(x => {
        const el = document.createElement("article");
        el.className = "card";
        el.innerHTML = `<h3>${x.term}</h3><p>${x.def}</p>`;
        list.appendChild(el);
      });
  }
  search.addEventListener("input", (e)=>draw(e.target.value));
  draw();
}

// ---- Install prompt handling (PWA) ----
let deferredPrompt;
const installBtn = document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove("hidden");
});
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === "accepted") {
    installBtn.textContent = "Installed";
    installBtn.disabled = true;
  }
  deferredPrompt = null;
});

// ---- Service worker registration ----
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

// ---- Init ----
updateStats();
renderTopics();
renderQuiz();
renderGlossary();