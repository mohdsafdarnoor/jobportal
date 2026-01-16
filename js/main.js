/* ===== Slide menu ===== */
const menuOverlay = document.getElementById("menuOverlay");
const menuOpenBtn = document.getElementById("menuOpenBtn");

function openMenu(){
  if(!menuOverlay) return;
  menuOverlay.classList.add("open");
}
function closeMenu(){
  if(!menuOverlay) return;
  menuOverlay.classList.remove("open");
}

if(menuOpenBtn) menuOpenBtn.addEventListener("click", openMenu);
if(menuOverlay){
  menuOverlay.addEventListener("click", (e) => {
    if(e.target === menuOverlay) closeMenu();
  });
}

/* ===== Modal helpers ===== */
function openModal(id){
  const m = document.getElementById(id);
  if(!m) return;
  m.classList.add("open");
  m.setAttribute("aria-hidden","false");
}
function closeModal(id){
  const m = document.getElementById(id);
  if(!m) return;
  m.classList.remove("open");
  m.setAttribute("aria-hidden","true");
}
document.addEventListener("keydown",(e)=>{
  if(e.key === "Escape"){
    document.querySelectorAll(".modal.open").forEach(m => m.classList.remove("open"));
    if(menuOverlay) menuOverlay.classList.remove("open");
  }
});

/* ===== Accordion ===== */
function toggleAcc(btn){
  const panel = btn.parentElement.querySelector(".acc-panel");
  if(!panel) return;
  panel.classList.toggle("open");
}

/* ===== Tools data (tools.html) ===== */
const toolsData = {
  working: [
    { name:"LinkedIn Career Explorer", stage:"Working Student", tag:"Orientation", desc:"Understand part-time role options and skill gaps.", url:"https://www.linkedin.com/" },
    { name:"Indeed", stage:"Working Student", tag:"Orientation", desc:"Broad part-time job discovery.", url:"https://www.indeed.com/" },
    { name:"JobMensa", stage:"Working Student", tag:"Orientation", desc:"Student-focused part-time roles in Germany.", url:"https://www.jobmensa.de/" },
    { name:"StepStone", stage:"Working Student", tag:"Orientation", desc:"Job listings + CV upload to reach recruiters.", url:"https://www.stepstone.de/" },
    { name:"Canva", stage:"Working Student", tag:"Application", desc:"Simple, clean CVs for part-time roles.", url:"https://www.canva.com/" },
    { name:"Resume.io", stage:"Working Student", tag:"Application", desc:"ATS-friendly resume templates.", url:"https://resume.io/" },
    { name:"Simplify", stage:"Working Student", tag:"Application", desc:"Fast applications + tracking.", url:"https://simplify.jobs/" },
    { name:"Google Interview Warmup", stage:"Working Student", tag:"Interview", desc:"Practice common interview questions.", url:"https://grow.google/certificates/interview-warmup/" },
    { name:"DeepL", stage:"Working Student", tag:"Onboarding", desc:"Language support for German/English.", url:"https://www.deepl.com/" }
  ],
  internship: [
    { name:"Handshake", stage:"Internship", tag:"Orientation", desc:"Student-focused internship discovery.", url:"https://joinhandshake.com/" },
    { name:"LinkedIn Jobs", stage:"Internship", tag:"Orientation", desc:"Internships and filters.", url:"https://www.linkedin.com/jobs/" },
    { name:"Coursera", stage:"Internship", tag:"Orientation", desc:"Skill preparation for internships.", url:"https://www.coursera.org/" },
    { name:"VMock", stage:"Internship", tag:"Application", desc:"Academic resume feedback.", url:"https://www.vmock.com/" },
    { name:"Yoodli", stage:"Internship", tag:"Interview", desc:"Communication improvement.", url:"https://www.yoodli.ai/" }
  ],
  thesis: [
    { name:"ChatGPT", stage:"Master Thesis", tag:"Writing", desc:"Literature review, structuring, drafting.", url:"https://chat.openai.com/" },
    { name:"DeepL", stage:"Master Thesis", tag:"Writing", desc:"Academic/professional language refinement.", url:"https://www.deepl.com/" }
  ],
  fulltime: [
    { name:"EURES", stage:"Full-Time", tag:"Orientation", desc:"European Employment Services.", url:"https://eures.europa.eu/" },
    { name:"XING", stage:"Full-Time", tag:"Orientation", desc:"DACH region career networking.", url:"https://www.xing.com/" },
    { name:"Europass", stage:"Full-Time", tag:"Application", desc:"EU-standard CV builder.", url:"https://europass.europa.eu/" },
    { name:"Final Round AI", stage:"Full-Time", tag:"Interview", desc:"Structured interview answers (STAR).", url:"https://www.finalroundai.com/" }
  ]
};

function tileHTML(t){
  const safe = (s) => String(s).replaceAll('"',"&quot;");
  return `
    <div class="tile" data-search="${safe((t.name+" "+t.tag+" "+t.desc+" "+t.stage).toLowerCase())}">
      <img class="tile-img" src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60" alt="">
      <div class="tile-body">
        <h3 class="tile-title">${t.name}</h3>
        <p class="tile-text">${t.desc}</p>
        <div class="tile-meta">
          <span class="chip">${t.tag}</span>
          <a class="tile-link" href="${t.url}" target="_blank" rel="noopener noreferrer">Open »</a>
        </div>
      </div>
    </div>
  `;
}

function renderTools(){
  const holder = document.getElementById("toolsGrid");
  if(!holder) return;

  const all = [
    ...toolsData.working,
    ...toolsData.internship,
    ...toolsData.thesis,
    ...toolsData.fulltime
  ];

  holder.innerHTML = all.map(tileHTML).join("");

  const countEl = document.getElementById("toolCount");
  if(countEl) countEl.textContent = all.length;

  const input = document.getElementById("searchInput");
  if(input){
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll(".tile").forEach(tile => {
        const hay = tile.getAttribute("data-search") || "";
        tile.style.display = hay.includes(q) ? "flex" : "none";
      });
    });
  }
}

/* ===== Contact form (optional) ===== */
async function handleSubmit(event){
  event.preventDefault();
  const form = event.target;
  const msg = document.getElementById("form-message");
  const btn = form.querySelector("button[type='submit']");

  if(msg){
    msg.style.display = "block";
    msg.style.color = "#222";
    msg.textContent = "Sending…";
  }
  if(btn) btn.disabled = true;

  try{
    const data = new FormData(form);
    const res = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { "Accept": "application/json" }
    });
    if(!res.ok) throw new Error("Server error");

    if(msg){
      msg.style.color = "#339933";
      msg.textContent = "Success! Message sent.";
    }
    form.reset();
  }catch(e){
    if(msg){
      msg.style.color = "crimson";
      msg.textContent = "Error sending message. Please try again.";
    }
  }finally{
    if(btn) btn.disabled = false;
  }
  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  renderTools();
});
