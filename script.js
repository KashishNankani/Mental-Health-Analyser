document.addEventListener("DOMContentLoaded", () => {

  // ------------------ INDEX PAGE ------------------
  const startBtn = document.getElementById("startQuiz");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      // Clear previous results
      localStorage.removeItem("form1CategoryResults");
      localStorage.removeItem("form2Results");
      localStorage.removeItem("form3Results");

      // Navigate to Form 1
      window.location.href = "form1.html";
    });
  }

  // ------------------ FORM 1 ------------------
  const form1 = document.getElementById("form1");
  if (form1) {
    form1.addEventListener("submit", function(e) {
      e.preventDefault();

      const selects = Array.from(document.querySelectorAll("#form1 select"));
      const unanswered = selects.findIndex(s => !s.value);
      if (unanswered !== -1) {
        alert("Please answer all questions before submitting. (Missing on question #" + (unanswered + 1) + ")");
        return;
      }

      const categories = ["Self Awareness", "Managing Emotions", "Motivating Oneself", "Empathy", "Social Skills"];
      const catSums = [0, 0, 0, 0, 0];

      for (let i = 0; i < selects.length; i++) {
        const val = parseInt(selects[i].value, 10) || 0;
        const catIndex = Math.floor(i / 10);
        if (catIndex >= 0 && catIndex < 5) catSums[catIndex] += val;
      }

      function getTier(score) {
        if (score >= 10 && score <= 17) return "Development Priority";
        if (score >= 18 && score <= 34) return "Need Attention";
        if (score >= 35 && score <= 50) return "Strength";
        return "";
      }

      const form1Result = categories.map((cat, idx) => {
        return { category: cat, score: catSums[idx], tier: getTier(catSums[idx]) };
      });

      localStorage.setItem("form1CategoryResults", JSON.stringify(form1Result));
      window.location.href = "form2.html";
    });
  }

  // ------------------ FORM 2 ------------------
  const form2 = document.getElementById("form2");
  if (form2) {
    form2.addEventListener("submit", function(e) {
      e.preventDefault();

      const answers = [];
      document.querySelectorAll("#form2 input:checked").forEach(radio => {
        answers.push(radio.value);
      });

      const countObj = { K: 0, A: 0, V: 0 };
      answers.forEach(val => {
        if (countObj[val] !== undefined) countObj[val]++;
      });

      localStorage.setItem("form2Results", JSON.stringify(countObj));
      window.location.href = "form3.html";
    });
  }

  // ------------------ FORM 3 ------------------
  const form3 = document.getElementById("form3");
  if (form3) {
    form3.addEventListener("submit", function(e) {
      e.preventDefault();

      let totalK = 0, totalA = 0, totalV = 0, totalAd = 0;
      const formData = new FormData(form3);

      for (const [key, value] of formData.entries()) {
        const score = parseInt(value, 10);
        if (key.includes("_K")) totalK += score;
        if (key.includes("_A")) totalA += score;
        if (key.includes("_V")) totalV += score;
        if (key.includes("_Ad")) totalAd += score;
      }

      localStorage.setItem("form3Results", JSON.stringify({
        K: totalK,
        A: totalA,
        V: totalV,
        Ad: totalAd
      }));

      window.location.href = "results.html";
    });
  }

  // ------------------ RESULTS PAGE ------------------
  const resultsDiv = document.getElementById("results");
  if (resultsDiv) {
    let html = "";

    // Form 1 Results
    const form1Results = JSON.parse(localStorage.getItem("form1CategoryResults"));
    if (form1Results) {
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

    // Form 2 Results
    const form2Results = JSON.parse(localStorage.getItem("form2Results"));
    if (form2Results) {
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

    // Form 3 Results
    const form3Results = JSON.parse(localStorage.getItem("form3Results"));
    if (form3Results) {
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

    resultsDiv.innerHTML = html;
  }

});
