// script1.js
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
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import { deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


/* ========= Firebase Config (your values) ========= */
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

/* ========= Page Logic ========= */
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");            // ok if missing
  const toggleSignup = document.getElementById("toggleSignup");        // ok if missing
  const backToLogin = document.getElementById("backToLogin");          // ok if missing

  /* ----- Toggle Login ↔ Signup (only if those nodes exist on the page) ----- */
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

/* ------------------ LOGIN ------------------ */
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("⚠ Please fill in both email and password.");
      return;
    }

   try {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  // ✅ Check if user has completed all 3 forms
  const f1 = await getDoc(doc(db, "users", user.uid, "responses", "form1"));
  const f2 = await getDoc(doc(db, "users", user.uid, "responses", "form2"));
  const f3 = await getDoc(doc(db, "users", user.uid, "responses", "form3"));

  if (f1.exists() && f2.exists() && f3.exists()) {
    alert("✅ Welcome back! Redirecting to your results...");
    window.location.href = "result.html";
  } else {
    alert("✅ Login successful! Redirecting to Form 1...");
    window.location.href = "form1.html";
  }
} catch (err) {
      console.error("Firebase login error:", err);
      if (err.code === "auth/invalid-email") {
        alert("⚠ Please enter a valid email address.");
      } else if (err.code === "auth/user-not-found") {
        alert("⚠ No account found with this email. Please sign up first.");
      } else if (err.code === "auth/wrong-password") {
        alert("⚠ Incorrect password. Please try again.");
      } else {
        alert("❌ Login failed. Please try again.");
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

    // Basic validation before hitting Firebase
    if (!email || !password) {
      alert("⚠ Please enter both email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("⚠ Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      alert("⚠ Password must be at least 6 characters long.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        createdAt: new Date(),
      });

      alert("🎉 Signup successful! Redirecting...");
      window.location.href = "form1.html";
    } catch (err) {
      console.error("Firebase signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        alert("⚠ This email is already registered. Please log in instead.");
      } else if (err.code === "auth/invalid-email") {
        alert("⚠ Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        alert("⚠ Password is too weak. Use at least 6 characters.");
      } else {
        alert("❌ Signup failed. Please try again.");
      }
    }
  });
}

  /* ------------------ Route Protection (no logout needed) ------------------ */
  const protectedPages = ["form1.html", "form2.html", "form3.html", "result.html"];
  onAuthStateChanged(auth, (user) => {
    const currentPage = location.pathname.split("/").pop();

    // Kick users out of protected pages if not logged in
    if (!user && protectedPages.includes(currentPage)) {
      alert("⚠️ You must be logged in to access this page.");
      window.location.href = "index.html"; // 
      return;
    }

   
  });

  /* ------------------ FORM 1 (radios q1..q50) ------------------ */
const form1 = document.getElementById("form1");
if (form1) {
  form1.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Validate: every question q1..q50 must have an answer
    const answers = [];
    for (let i = 1; i <= 50; i++) {
  const selected = document.querySelector(`input[name="q${i}"]:checked`);
  if (!selected) {
    alert(`Please answer question ${i} before submitting.`);

    // 👇 new part: scroll to the first unanswered question after alert
    setTimeout(() => {
      const firstUnanswered = document.querySelector(`input[name="q${i}"]`);
      if (firstUnanswered) {
        firstUnanswered.scrollIntoView({ behavior: "smooth", block: "center" });
        firstUnanswered.focus();
      }
    }, 100);

    return;
  }
  answers.push(parseInt(selected.value, 10));
}


    // 5 categories, 10 questions each
    const categories = [
      "Self Awareness",
      "Managing Emotions",
      "Motivating Oneself",
      "Empathy",
      "Social Skills",
    ];
    const catSums = [0, 0, 0, 0, 0];

    for (let i = 0; i < answers.length; i++) {
      const catIndex = Math.floor(i / 10);
      catSums[catIndex] += answers[i];
    }

    function getTier(score) {
      if (score >= 10 && score <= 17) return "Development Priority";
      if (score >= 18 && score <= 34) return "Need Attention";
      if (score >= 35 && score <= 50) return "Strength";
      return "";
    }

    const form1Result = categories.map((cat, idx) => ({
      category: cat,
      score: catSums[idx],
      tier: getTier(catSums[idx]),
    }));

    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid, "responses", "form1"), {
        results: form1Result,
      });
    }

    window.location.href = "form2.html";
  });
}

  /* ------------------ FORM 2 ------------------ */
  const form2 = document.getElementById("form2");
  if (form2) {
    form2.addEventListener("submit", async function (e) {
      e.preventDefault();

      const answers = [];
      document
        .querySelectorAll("#form2 input:checked")
        .forEach((radio) => answers.push(radio.value));

      const countObj = { K: 0, A: 0, V: 0 };
      answers.forEach((val) => {
        if (countObj[val] !== undefined) countObj[val]++;
      });

      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid, "responses", "form2"), {
          results: countObj,
        });
      }

      window.location.href = "form3.html";
    });
  }

  /* ------------------ FORM 3 ------------------ */
  
  const form3 = document.getElementById("form3");
if (form3) {
  // ✅ Prefill saved answers on load
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const docRef = doc(db, "users", user.uid, "responses", "form3");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const savedData = docSnap.data().rawAnswers; // <- we’ll save this below

        if (savedData) {
          Object.entries(savedData).forEach(([key, value]) => {
            const input = form3.querySelector(`[name="${key}"]`);
            if (input) input.value = value;
          });
        }
      }
    }
  });

  // ✅ Handle submit
  form3.addEventListener("submit", async function (e) {
    e.preventDefault();

    let totalK = 0,
      totalA = 0,
      totalV = 0,
      totalAd = 0;

    const formData = new FormData(form3);
    const rawAnswers = {}; // store user’s exact answers

    for (const [key, value] of formData.entries()) {
      const score = parseInt(value, 10);
      rawAnswers[key] = value; // save it for prefill

      if (key.includes("_Ad")) totalAd += score;
      else if (key.includes("_A")) totalA += score;
      else if (key.includes("_V")) totalV += score;
      else if (key.includes("_K")) totalK += score;
    }

    const form3Results = { K: totalK, A: totalA, V: totalV, Ad: totalAd };

    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid, "responses", "form3"), {
        results: form3Results,
        rawAnswers: rawAnswers, // ✅ added
      });
    }

    window.location.href = "result.html";
  });
}


  /* ------------------ RESULTS PAGE ------------------ */
/* ------------------ RESULTS PAGE ------------------ */
const resultsDiv = document.getElementById("results");
if (resultsDiv) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }

    let html = "";
    try {
      // Form 1
      const f1 = await getDoc(doc(db, "users", user.uid, "responses", "form1"));
      if (f1.exists() && f1.data().results) {
        const form1Results = f1.data().results;
        html += `<h3>Form 1 - Category Breakdown</h3>
          <table border="1" cellpadding="8" style="border-collapse: collapse; width:100%;">
            <thead>
              <tr><th>Category</th><th>Score</th><th>Development Priority</th><th>Need Attention</th><th>Strength</th></tr>
            </thead>
            <tbody>
              ${form1Results
                .map((r) => {
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
                })
                .join("")}
            </tbody>
          </table><br>`;
      }

      // Form 2
      const f2 = await getDoc(doc(db, "users", user.uid, "responses", "form2"));
      if (f2.exists() && f2.data().results) {
        const form2Results = f2.data().results;
        html += `<h3>Form 2 - Learning Style Count</h3>
          <table border="1" cellpadding="8" style="border-collapse: collapse; width:50%;">
            <thead>
              <tr><th>Style</th><th>Count</th></tr>
            </thead>
            <tbody>
              <tr><td>K</td><td>${form2Results.K}</td></tr>
              <tr><td>A</td><td>${form2Results.A}</td></tr>
              <tr><td>V</td><td>${form2Results.V}</td></tr>
            </tbody>
          </table><br>`;
      }

      // Form 3
      const f3 = await getDoc(doc(db, "users", user.uid, "responses", "form3"));
      if (f3.exists() && f3.data().results) {
        const form3Results = f3.data().results;
        html += `<h3>Form 3 - Detailed Learning Preference</h3>
          <table border="1" cellpadding="8" style="border-collapse: collapse; width:50%;">
            <thead>
              <tr><th>Type</th><th>Total Score</th></tr>
            </thead>
            <tbody>
              <tr><td>K (Feelings)</td><td>${form3Results.K}</td></tr>
              <tr><td>A (Sounds)</td><td>${form3Results.A}</td></tr>
              <tr><td>V (Visuals)</td><td>${form3Results.V}</td></tr>
              <tr><td>Ad (Logic)</td><td>${form3Results.Ad}</td></tr>
            </tbody>
          </table>`;
      }
    } catch (err) {
      console.error("❌ Error loading results:", err);
      html += `<p style="color:red;">Error loading results: ${err.message}</p>`;
    }

    resultsDiv.innerHTML = html || "<p>No results found yet. Please complete the forms.</p>";

    // ✅ Only show buttons if results exist
    if (html) {
      resultsDiv.innerHTML += `
        <div style="text-align:center; margin-top: 30px; display:flex; gap:15px; justify-content:center; flex-wrap:wrap;">
          <button id="retakeTestBtn" style="
            padding:14px 28px;
            background:#1a3c57;
            color:white;
            border:none;
            border-radius:10px;
            cursor:pointer;
            font-size:16px;
            font-weight:bold;
            box-shadow:0 3px 6px rgba(0,0,0,0.15);
            transition:background 0.3s, transform 0.2s;
            min-width:160px;
          ">🔄 Retake Test</button>

          <button id="downloadBtn" style="
            padding:14px 28px;
            background:#1a3c57;
            color:white;
            border:none;
            border-radius:10px;
            cursor:pointer;
            font-size:16px;
            font-weight:bold;
            box-shadow:0 3px 6px rgba(0,0,0,0.15);
            transition:background 0.3s, transform 0.2s;
            min-width:160px;
          ">⬇️ Download Results</button>
        </div>
      `;

      // ✅ Hover effects
      const retakeBtn = document.getElementById("retakeTestBtn");
      const dlBtn = document.getElementById("downloadBtn");

      [retakeBtn, dlBtn].forEach((btn) => {
        btn.addEventListener("mouseover", () => (btn.style.background = "#245a80"));
        btn.addEventListener("mouseout", () => (btn.style.background = "#1a3c57"));
      });

      // ✅ Retake Test behavior
      retakeBtn.addEventListener("click", async () => {
        if (confirm("Are you sure you want to retake the test? This will overwrite your previous results.")) {
          const user = auth.currentUser;
          if (user) {
            await deleteDoc(doc(db, "users", user.uid, "responses", "form1"));
            await deleteDoc(doc(db, "users", user.uid, "responses", "form2"));
            await deleteDoc(doc(db, "users", user.uid, "responses", "form3"));
          }
          window.location.href = "form1.html";
        }
      });

      // ✅ Download Results behavior
      dlBtn.addEventListener("click", () => {
        const content = document.querySelector("#results").innerText;
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "result.txt";
        link.click();
      });
    }
    else {
  // ✅ NEW block → show Start Test if no results exist
  resultsDiv.innerHTML = `
    <p style="text-align:center; margin:20px; font-size:16px; color:#333;">
      You haven’t completed the test yet. Click below to start.
    </p>
    <div style="text-align:center; margin-top: 20px;">
      <button id="startTestBtn" style="
        padding:14px 28px;
        background:#1a3c57;
        color:white;
        border:none;
        border-radius:10px;
        cursor:pointer;
        font-size:16px;
        font-weight:bold;
        box-shadow:0 3px 6px rgba(0,0,0,0.15);
        transition:background 0.3s, transform 0.2s;
      ">🚀 Start Test</button>
    </div>
  `;

  const startBtn = document.getElementById("startTestBtn");
  startBtn.addEventListener("mouseover", () => startBtn.style.background = "#245a80");
  startBtn.addEventListener("mouseout", () => startBtn.style.background = "#1a3c57");
  startBtn.addEventListener("click", () => {
    window.location.href = "form1.html";
  });
}
  });
}
});
