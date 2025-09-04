import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA2QiSdtnt3H7SbCDoF1mCp7JPFxxOopdw",
  authDomain: "mental-health-analyser-15c43.firebaseapp.com",
  projectId: "mental-health-analyser-15c43",
  storageBucket: "mental-health-analyser-15c43.firebasestorage.app",
  messagingSenderId: "286813139345",
  appId: "1:286813139345:web:b5a04b3721fa7c13c12a30",
  measurementId: "G-ZN4EHVVKEC"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const toggleSignup = document.getElementById("toggleSignup");
  const backToLogin = document.getElementById("backToLogin");

  // ------------------ TOGGLE LOGIN ↔ SIGNUP ------------------
  if (toggleSignup) {
    toggleSignup.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.style.display = "none";
      signupForm.style.display = "block";
      toggleSignup.parentElement.style.display = "none";
      backToLogin.style.display = "block";
    });
  }

  if (backToLogin) {
    backToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      signupForm.style.display = "none";
      loginForm.style.display = "block";
      toggleSignup.parentElement.style.display = "block";
      backToLogin.style.display = "none";
    });
  }

  // ------------------ LOGIN ------------------
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("✅ Login successful!");
        window.location.href = "form1.html";
      } catch (err) {
        alert("❌ Login failed: " + err.message);
        console.error("Firebase login error:", err);
      }
    });
  }

  // ------------------ SIGNUP ------------------
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("signupEmail").value.trim();
      const password = document.getElementById("signupPassword").value.trim();

      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        // ✅ create a user doc in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: email,
          createdAt: new Date()
        });

        alert("🎉 Signup successful! You are now logged in.");
        window.location.href = "form1.html";
      } catch (err) {
        alert("❌ Signup failed: " + err.message);
        console.error("Firebase signup error:", err);
      }
    });
  }

  // ------------------ ROUTE PROTECTION ------------------
  const protectedPages = ["form1.html", "form2.html", "form3.html", "results.html"];
  onAuthStateChanged(auth, (user) => {
    if (!user && protectedPages.includes(location.pathname.split("/").pop())) {
      window.location.href = "index.html";
    }
  });

  // ------------------ FORM 1 ------------------
  // ------------------ FORM 1 ------------------
const form1 = document.getElementById("form1");
if (form1) {
  form1.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Collect all answers
    const answers = [];
    for (let i = 1; i <= 50; i++) {  // assuming 50 questions total
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (!selected) {
        alert(`Please answer question ${i} before submitting.`);
        return;
      }
      answers.push(parseInt(selected.value, 10));
    }

    // Categories (10 questions each)
    const categories = [
      "Self Awareness",
      "Managing Emotions",
      "Motivating Oneself",
      "Empathy",
      "Social Skills"
    ];
    const catSums = [0, 0, 0, 0, 0];

    for (let i = 0; i < answers.length; i++) {
      const catIndex = Math.floor(i / 10); // 10 questions per category
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
      await setDoc(doc(db, "users", user.uid, "responses", "form1"), { results: form1Result });
    }

    window.location.href = "form2.html";
  });
}

  // ------------------ FORM 2 ------------------
  const form2 = document.getElementById("form2");
  if (form2) {
    form2.addEventListener("submit", async function (e) {
      e.preventDefault();

      const answers = [];
      document.querySelectorAll("#form2 input:checked").forEach((radio) => {
        answers.push(radio.value);
      });

      const countObj = { K: 0, A: 0, V: 0 };
      answers.forEach((val) => {
        if (countObj[val] !== undefined) countObj[val]++;
      });

      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid, "responses", "form2"), { results: countObj });
      }

      window.location.href = "form3.html";
    });
  }

  // ------------------ FORM 3 ------------------
  const form3 = document.getElementById("form3");
  if (form3) {
    form3.addEventListener("submit", async function (e) {
      e.preventDefault();

      let totalK = 0,
        totalA = 0,
        totalV = 0,
        totalAd = 0;
      const formData = new FormData(form3);

      for (const [key, value] of formData.entries()) {
        const score = parseInt(value, 10);
        if (key.includes("_K")) totalK += score;
        if (key.includes("_A")) totalA += score;
        if (key.includes("_V")) totalV += score;
        if (key.includes("_Ad")) totalAd += score;
      }

      const form3Results = { K: totalK, A: totalA, V: totalV, Ad: totalAd };

      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid, "responses", "form3"), { results: form3Results });
      }

      window.location.href = "result.html";
    });
  }

  // ------------------ RESULTS PAGE ------------------
    // ------------------ RESULTS PAGE ------------------
  const resultsDiv = document.getElementById("results");
  if (resultsDiv) {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "index.html"; // not logged in
        return;
      }

      let html = "";

      try {
        // ✅ Get Form1 Results
        const f1 = await getDoc(doc(db, "users", user.uid, "responses", "form1"));
        if (f1.exists()) {
          const form1Results = f1.data().results;
          html += `<h3>Form 1 - Category Breakdown</h3>
            <table border="1" cellpadding="8" style="border-collapse: collapse; width:100%;">
              <thead>
                <tr><th>Category</th><th>Score</th><th>Development Priority</th><th>Need Attention</th><th>Strength</th></tr>
              </thead>
              <tbody>
                ${form1Results.map(r => {
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

        // ✅ Get Form2 Results
        const f2 = await getDoc(doc(db, "users", user.uid, "responses", "form2"));
        if (f2.exists()) {
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

        // ✅ Get Form3 Results
        const f3 = await getDoc(doc(db, "users", user.uid, "responses", "form3"));
        if (f3.exists()) {
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
    });
  }

  
});
