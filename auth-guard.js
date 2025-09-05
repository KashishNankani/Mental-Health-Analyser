import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA2QiSdtnt3H7SbCDoF1mCp7JPFxxOopdw",
  authDomain: "mental-health-analyser-15c43.firebaseapp.com",
  projectId: "mental-health-analyser-15c43",
  storageBucket: "mental-health-analyser-15c43.firebasestorage.app",
  messagingSenderId: "286813139345",
  appId: "1:286813139345:web:b5a04b3721fa7c13c12a30",
  measurementId: "G-ZN4EHVVKEC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const protectedPages = ["form1.html", "form2.html", "form3.html", "result.html"];
const currentPage = location.pathname.split("/").pop();

onAuthStateChanged(auth, (user) => {
  if (!user && protectedPages.includes(currentPage)) {
    window.location.href = "index.html";
  }
});

