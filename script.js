// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* ========= Firebase Config ========= */
const firebaseConfig = {
  apiKey: "AIzaSyA2QiSdtnt3H7SbCDoF1mCp7JPFxxOopdw",
  authDomain: "mental-health-analyser-15c43.firebaseapp.com",
  projectId: "mental-health-analyser-15c43",
  storageBucket: "mental-health-analyser-15c43.firebasestorage.app",
  messagingSenderId: "286813139345",
  appId: "1:286813139345:web:b5a04b3721fa7c13c12a30",
  measurementId: "G-ZN4EHVVKEC",
};

/* ========= Initialize ========= */
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ========= Loader ========= */
const loader = document.createElement("div");
loader.id = "page-loader";
loader.style.position = "fixed";
loader.style.top = "0";
loader.style.left = "0";
loader.style.width = "100%";
loader.style.height = "100%";
loader.style.background = "#f9fafb";
loader.style.display = "flex";
loader.style.alignItems = "center";
loader.style.justifyContent = "center";
loader.style.font = "600 18px system-ui";
loader.style.zIndex = "9999";
loader.innerText = "Checking login…";
document.body.appendChild(loader);

/* ========= Toast helper ========= */
function showToast(msg, type = "info", duration = 3000) {
  const colors = {
    info: "#2563eb",
    success: "#16a34a",
    warning: "#eab308",
    error: "#dc2626",
  };
  const wrapId = "toast-wrap";
  let wrap = document.getElementById(wrapId);
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = wrapId;
    wrap.style.position = "fixed";
    wrap.style.top = "20px";
    wrap.style.left = "50%";
    wrap.style.transform = "translateX(-50%)";
    wrap.style.zIndex = "10000";
    wrap.style.display = "flex";
    wrap.style.flexDirection = "column";
    wrap.style.gap = "12px";
    document.body.appendChild(wrap);
  }
  const div = document.createElement("div");
  div.textContent = msg;
  div.style.padding = "12px 20px";
  div.style.borderRadius = "8px";
  div.style.color = "#fff";
  div.style.background = colors[type] || colors.info;
  div.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
  div.style.font = "500 15px system-ui, sans-serif";
  div.style.opacity = "0";
  div.style.transform = "translateY(-10px)";
  div.style.transition = "opacity .3s ease, transform .3s ease";
  wrap.appendChild(div);
  requestAnimationFrame(() => {
    div.style.opacity = "1";
    div.style.transform = "translateY(0)";
  });
  setTimeout(() => {
    div.style.opacity = "0";
    div.style.transform = "translateY(-10px)";
    setTimeout(() => div.remove(), 300);
  }, duration);
}

/* ========= Custom confirm ========= */
function showConfirm(msg) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "10000";

    const box = document.createElement("div");
    box.style.background = "#fff";
    box.style.padding = "20px";
    box.style.borderRadius = "10px";
    box.style.width = "320px";
    box.style.textAlign = "center";
    box.innerHTML = `
      <p style="margin-bottom:20px;font-size:15px;color:#333;">${msg}</p>
      <button id="confirmYes" style="padding:10px 20px;margin:5px;background:#16a34a;color:white;border:none;border-radius:6px;cursor:pointer;">Yes</button>
      <button id="confirmNo" style="padding:10px 20px;margin:5px;background:#dc2626;color:white;border:none;border-radius:6px;cursor:pointer;">No</button>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    box.querySelector("#confirmYes").onclick = () => {
      overlay.remove();
      resolve(true);
    };
    box.querySelector("#confirmNo").onclick = () => {
      overlay.remove();
      resolve(false);
    };
  });
}

/* ========= Global Form References ========= */
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

/* ========= Page Logic ========= */
document.addEventListener("DOMContentLoaded", () => {
  const toggleSignup = document.getElementById("toggleSignup");
  const backToLogin = document.getElementById("backToLogin");

  if (toggleSignup && signupForm && loginForm && backToLogin) {
    toggleSignup.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.style.display = "none";
      signupForm.style.display = "block";
      toggleSignup.parentElement.style.display = "none";
      backToLogin.style.display = "block";
    });

    backToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      signupForm.style.display = "none";
      loginForm.style.display = "block";
      toggleSignup.parentElement.style.display = "block";
      backToLogin.style.display = "none";
    });
  }

  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetId = icon.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  });
});

/* ------------------ LOGIN ------------------ */
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showToast("⚠ Please fill in both email and password.", "warning");
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const f1 = await getDoc(doc(db, "users", user.uid, "responses", "form1"));
      const f2 = await getDoc(doc(db, "users", user.uid, "responses", "form2"));
      const f3 = await getDoc(doc(db, "users", user.uid, "responses", "form3"));

      if (f1.exists() && f2.exists() && f3.exists()) {
        showToast("✅ Welcome back! Opening your results…", "success", 2000);
        setTimeout(() => (window.location.href = "result.html"), 1200);
      } else {
        showToast("✅ Login successful! Redirecting to Form 1…", "success", 2000);
        setTimeout(() => (window.location.href = "form1.html"), 1200);
      }
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/invalid-email") {
        showToast("⚠ Please enter a valid email address.", "warning");
      } else if (code === "auth/user-not-found") {
        showToast("⚠ No account found with this email. Please sign up first.", "warning", 3500);
      } else if (code === "auth/wrong-password") {
        showToast("⚠ Incorrect password. Please try again.", "warning");
      } else {
        showToast("❌ Login failed. Please try again.", "error");
      }
    }
  });
}

/* ------------------ SIGNUP ------------------ */
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!email || !password) {
      showToast("⚠ Please enter both email and password.", "warning");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("⚠ Please enter a valid email address.", "warning");
      return;
    }
    if (password.length < 6) {
      showToast("⚠ Password must be at least 6 characters long.", "warning", 3500);
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        createdAt: new Date(),
      });

      showToast("🎉 Signup successful! Redirecting…", "success", 2000);
      setTimeout(() => (window.location.href = "form1.html"), 1200);
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/email-already-in-use") {
        showToast("⚠ This email is already registered. Please log in instead.", "warning", 3500);
      } else if (code === "auth/invalid-email") {
        showToast("⚠ Please enter a valid email address.", "warning");
      } else if (code === "auth/weak-password") {
        showToast("⚠ Password is too weak. Use at least 6 characters.", "warning", 3500);
      } else {
        showToast("❌ Signup failed. Please try again.", "error");
      }
    }
  });
}

/* ------------------ Route Protection ------------------ */
const protectedPages = ["form1.html", "form2.html", "form3.html", "result.html"];
const currentPage = location.pathname.split("/").pop();

onAuthStateChanged(auth, async (user) => {
  const loader = document.getElementById("page-loader");
  if (loader) loader.remove();

  if (!user && protectedPages.includes(currentPage)) {
    showToast("⚠ Please login first to access this page.", "warning", 3000);
    setTimeout(() => (window.location.href = "index.html"), 1200);
    return;
  }

  if (user) {
    const f1 = await getDoc(doc(db, "users", user.uid, "responses", "form1"));
    const f2 = await getDoc(doc(db, "users", user.uid, "responses", "form2"));
    const f3 = await getDoc(doc(db, "users", user.uid, "responses", "form3"));

    if (currentPage === "form2.html" && !f1.exists()) {
      showToast("⚠ Please complete Form 1 first.", "warning");
      setTimeout(() => (window.location.href = "form1.html"), 1000);
    }
    if (currentPage === "form3.html" && (!f1.exists() || !f2.exists())) {
      showToast("⚠ Please complete Form 1 and Form 2 first.", "warning");
      setTimeout(() => (window.location.href = !f1.exists() ? "form1.html" : "form2.html"), 1000);
    }
    if (currentPage === "result.html" && (!f1.exists() || !f2.exists() || !f3.exists())) {
      showToast("⚠ Please complete all forms first.", "warning");
      setTimeout(() => {
        if (!f1.exists()) window.location.href = "form1.html";
        else if (!f2.exists()) window.location.href = "form2.html";
        else window.location.href = "form3.html";
      }, 1000);
    }
  }
});

/* ------------------ FORM 1 ------------------ */
const form1 = document.getElementById("form1");
if (form1) {
  // Restore saved draft
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid, "responses", "form1");
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data().rawAnswers) {
        const saved = snap.data().rawAnswers;
        Object.entries(saved).forEach(([q, val]) => {
          const input = form1.querySelector(`input[name="${q}"][value="${val}"]`);
          if (input) input.checked = true;
        });
      }
    }
  });

  // Auto-save while filling
  form1.addEventListener("input", async () => {
    const rawAnswers = {};
    form1.querySelectorAll("input[type=radio]:checked").forEach((el) => {
      rawAnswers[el.name] = el.value;
    });
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid, "responses", "form1"), { rawAnswers }, { merge: true });
    }
  });

  // Final submit
  form1.addEventListener("submit", async function (e) {
    e.preventDefault();
    const answers = [];
    for (let i = 1; i <= 50; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (!selected) {
        showToast(`Please answer question ${i} before submitting.`, "warning", 1600);
        selected?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      answers.push(parseInt(selected.value, 10));
    }
    const categories = ["Self Awareness","Managing Emotions","Motivating Oneself","Empathy","Social Skills"];
    const catSums = [0,0,0,0,0];
    for (let i = 0; i < answers.length; i++) {
      catSums[Math.floor(i/10)] += answers[i];
    }
    function getTier(score) {
      if (score >= 10 && score <= 17) return "Development Priority";
      if (score >= 18 && score <= 34) return "Need Attention";
      if (score >= 35 && score <= 50) return "Strength";
      return "";
    }
    const results = categories.map((cat, idx) => ({ category: cat, score: catSums[idx], tier: getTier(catSums[idx]) }));
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid, "responses", "form1"), { results }, { merge: true });
    }
    window.location.href = "form2.html";
  });
}

/* ------------------ FORM 2 ------------------ */
const form2 = document.getElementById("form2");
if (form2) {
  // Restore draft
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const snap = await getDoc(doc(db, "users", user.uid, "responses", "form2"));
      if (snap.exists() && snap.data().rawAnswers) {
        const saved = snap.data().rawAnswers;
        Object.entries(saved).forEach(([q, val]) => {
          const input = form2.querySelector(`input[name="${q}"][value="${val}"]`);
          if (input) input.checked = true;
        });
      }
    }
  });

  // Auto-save
  form2.addEventListener("input", async () => {
    const rawAnswers = {};
    form2.querySelectorAll("input[type=radio]:checked").forEach((el) => {
      rawAnswers[el.name] = el.value;
    });
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid, "responses", "form2"), { rawAnswers }, { merge: true });
    }
  });

  // Final submit
  form2.addEventListener("submit", async function (e) {
    e.preventDefault();
    const answers = [];
    document.querySelectorAll("#form2 input:checked").forEach((radio) => answers.push(radio.value));
    if (answers.length === 0) {
      showToast("⚠ Please select at least one option before submitting.", "warning", 3000);
      return;
    }
    const countObj = { K: 0, A: 0, V: 0 };
    answers.forEach((val) => { if (countObj[val] !== undefined) countObj[val]++; });
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid, "responses", "form2"), { results: countObj }, { merge: true });
    }
    window.location.href = "form3.html";
  });
}
/* ------------------ FORM 3 ------------------ */
const form3 = document.getElementById("form3");
if (form3) {
  // Restore draft
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const snap = await getDoc(doc(db, "users", user.uid, "responses", "form3"));
      if (snap.exists() && snap.data().rawAnswers) {
        const saved = snap.data().rawAnswers;
        Object.entries(saved).forEach(([q, val]) => {
          const input = form3.querySelector(`[name="${q}"]`);
          if (input) input.value = val;
        });
      }
    }
  });

  // Auto-save
  form3.addEventListener("input", async () => {
    const rawAnswers = {};
    new FormData(form3).forEach((val, key) => { rawAnswers[key] = val; });
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid, "responses", "form3"), { rawAnswers }, { merge: true });
    }
  });

  // Final submit
  form3.addEventListener("submit", async function (e) {
    e.preventDefault();
    let totalK=0,totalA=0,totalV=0,totalAd=0;
    const rawAnswers = {};
    new FormData(form3).forEach((val,key) => {
      rawAnswers[key]=val;
      const score=parseInt(val,10);
      if (key.includes("_Ad")) totalAd+=score;
      else if (key.includes("_A")) totalA+=score;
      else if (key.includes("_V")) totalV+=score;
      else if (key.includes("_K")) totalK+=score;
    });
    const results={K:totalK,A:totalA,V:totalV,Ad:totalAd};
    const user=auth.currentUser;
    if(user){
      await setDoc(doc(db,"users",user.uid,"responses","form3"),{results,rawAnswers},{merge:true});
    }
    window.location.href="result.html";
  });
}
/* ------------------ RESULTS PAGE ------------------ */
const resultsDiv = document.getElementById("results");
if (resultsDiv) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      showToast("⚠ You must be logged in to view results.", "warning", 3000);
      setTimeout(() => (window.location.href = "index.html"), 1200);
      return;
    }

    let html = "";
    try {
      const f1 = await getDoc(doc(db, "users", user.uid, "responses", "form1"));
      if (f1.exists() && f1.data().results) {
        const form1Results = f1.data().results;
        html += `<h3>Form 1 - Category Breakdown</h3>
          <table border="1" cellpadding="8" style="border-collapse: collapse; width:100%;">
            <thead>
              <tr><th>Category</th><th>Score</th><th>Development Priority</th><th>Need Attention</th><th>Strength</th></tr>
            </thead>
            <tbody>
              ${form1Results.map((r) => {
                const dev = r.tier === "Development Priority" ? "✓" : "";
                const need = r.tier === "Need Attention" ? "✓" : "";
                const str = r.tier === "Strength" ? "✓" : "";
                return `<tr>
                  <td>${r.category}</td>
                  <td style="text-align:center">${r.score}</td>
                  <td style="text-align:center">${dev}</td>
                  <td style="text-align:center">${need}</td>
                  <td style="text-align:center">${str}</td>
                </tr>`;
              }).join("")}
            </tbody>
          </table><br>`;
      }

      const f2 = await getDoc(doc(db, "users", user.uid, "responses", "form2"));
      if (f2.exists() && f2.data().results) {
        const form2Results = f2.data().results;
        html += `<h3>Form 2 - Learning Style Count</h3>
          <table border="1" cellpadding="8" style="border-collapse: collapse; width:50%;">
            <thead><tr><th>Style</th><th>Count</th></tr></thead>
            <tbody>
              <tr><td>K</td><td>${form2Results.K}</td></tr>
              <tr><td>A</td><td>${form2Results.A}</td></tr>
              <tr><td>V</td><td>${form2Results.V}</td></tr>
            </tbody>
          </table><br>`;
      }

      const f3 = await getDoc(doc(db, "users", user.uid, "responses", "form3"));
      if (f3.exists() && f3.data().results) {
        const form3Results = f3.data().results;
        html += `<h3>Form 3 - Detailed Learning Preference</h3>
          <table border="1" cellpadding="8" style="border-collapse: collapse; width:50%;">
            <thead><tr><th>Type</th><th>Total Score</th></tr></thead>
            <tbody>
              <tr><td>K (Feelings)</td><td>${form3Results.K}</td></tr>
              <tr><td>A (Sounds)</td><td>${form3Results.A}</td></tr>
              <tr><td>V (Visuals)</td><td>${form3Results.V}</td></tr>
              <tr><td>Ad (Logic)</td><td>${form3Results.Ad}</td></tr>
            </tbody>
          </table>`;
      }
    } catch (err) {
       html += `<p style="color:red;">Error loading results: ${err.message}</p>`;
    }


    resultsDiv.innerHTML = html || "<p>No results found yet. Please complete the forms.</p>";

    if (html) {
      resultsDiv.innerHTML += `
        <div style="text-align:center; margin-top: 30px; display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
          <button id="retakeTestBtn" style="padding:14px 28px;background:#1a3c57;color:white;border:none;border-radius:10px;cursor:pointer;font-size:16px;font-weight:bold;box-shadow:0 3px 6px rgba(0,0,0,0.15);transition:background 0.3s, transform 0.2s;min-width:160px;">🔄 Retake Test</button>
          <button id="downloadBtn" style="padding:14px 28px;background:#1a3c57;color:white;border:none;border-radius:10px;cursor:pointer;font-size:16px;font-weight:bold;box-shadow:0 3px 6px rgba(0,0,0,0.15);transition:background 0.3s, transform 0.2s;min-width:160px;">⬇ Download Results</button>
        </div>`;

      const retakeBtn = document.getElementById("retakeTestBtn");
      const dlBtn = document.getElementById("downloadBtn");

      [retakeBtn, dlBtn].forEach((btn) => {
        btn.addEventListener("mouseover", () => (btn.style.background = "#245a80"));
        btn.addEventListener("mouseout", () => (btn.style.background = "#1a3c57"));
      });

      retakeBtn.addEventListener("click", async () => {
        const confirm = await showConfirm("Are you sure you want to retake the test? This will overwrite your previous results.");
        if (confirm) {
          const user = auth.currentUser;
          if (user) {
            await deleteDoc(doc(db, "users", user.uid, "responses", "form1"));
            await deleteDoc(doc(db, "users", user.uid, "responses", "form2"));
            await deleteDoc(doc(db, "users", user.uid, "responses", "form3"));
          }
          window.location.href = "form1.html";
        }
      });

      dlBtn.addEventListener("click", () => {
        const content = document.querySelector("#results").innerText;
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "result.txt";
        link.click();
      });
    } else {
      resultsDiv.innerHTML = `
        <p style="text-align:center; margin:20px; font-size:16px; color:#333;">
          You haven’t completed the test yet. Click below to start.
        </p>
        <div style="text-align:center; margin-top: 20px;">
          <button id="startTestBtn" style="padding:14px 28px;background:#1a3c57;color:white;border:none;border-radius:10px;cursor:pointer;font-size:16px;font-weight:bold;box-shadow:0 3px 6px rgba(0,0,0,0.15);transition:background 0.3s, transform 0.2s;">🚀 Start Test</button>
        </div>
      `;
      const startBtn = document.getElementById("startTestBtn");
      startBtn.addEventListener("mouseover", () => (startBtn.style.background = "#245a80"));
      startBtn.addEventListener("mouseout", () => (startBtn.style.background = "#1a3c57"));
      startBtn.addEventListener("click", () => (window.location.href = "form1.html"));
    }
  });
}



