let chartInstance;

function calculate() {
  const income = parseFloat(document.getElementById("income").value);
  const expenses = parseFloat(document.getElementById("expenses").value);
  const balance = parseFloat(document.getElementById("balance").value);
  const purchase = parseFloat(document.getElementById("purchase").value);
  const useEMI = document.getElementById("emiCheckbox").checked;
  const chartType = document.getElementById("chartType").value;

  let emiAmount = 0;
  let totalPayable = purchase;

  if (useEMI) {
    const months = parseFloat(document.getElementById("emiMonths").value);
    const rate = parseFloat(document.getElementById("interestRate").value);
    const monthlyRate = rate / 12 / 100;

    emiAmount = (purchase * monthlyRate * Math.pow(1 + monthlyRate, months)) /
                (Math.pow(1 + monthlyRate, months) - 1);
    totalPayable = emiAmount * months;
  }

  const monthlyPurchase = useEMI ? emiAmount : purchase;
  const leftover = income - expenses - monthlyPurchase;

  let resultText = leftover >= 0 ? "✅ You can afford this!" : "❌ Not affordable right now.";
  document.getElementById("result").innerText = resultText;
  document.getElementById("leftoverInfo").innerText = `After this purchase, your monthly leftover would be $${leftover.toFixed(2)}.`;

  const historyItem = document.createElement("li");
  historyItem.innerText = `${new Date().toLocaleString()}: ${resultText}`;
  document.getElementById("history").appendChild(historyItem);

  updateChart(income, expenses, leftover, monthlyPurchase, chartType);
}

function updateChart(income, expenses, leftover, purchase, type) {
  const container = document.getElementById("chartContainer");
  container.classList.add("visible");

  const ctx = document.getElementById("budgetChart").getContext("2d");

  const data = {
    labels: ["Income", "Expenses", "Leftover", "Purchase"],
    datasets: [{
      label: "Budget Overview",
      data: [income, expenses, leftover, purchase],
      backgroundColor: ["#4CAF50", "#f44336", "#2196F3", "#FFC107"]
    }]
  };

  const config = {
    type: type,
    data: data,
    options: {
      responsive: true,
      animation: {
        duration: 1000
      }
    }
  };

  if (chartInstance) {
    chartInstance.destroy();
  }
  chartInstance = new Chart(ctx, config);
}

function clearHistory() {
  document.getElementById("history").innerHTML = "";
}

function exportCSV() {
  const historyItems = document.querySelectorAll("#history li");
  if (historyItems.length === 0) {
    alert("No history to export!");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,Timestamp,Result\n";
  historyItems.forEach(item => {
    const [timestamp, ...resultParts] = item.innerText.split(": ");
    const result = resultParts.join(": ");
    csvContent += `${timestamp},"${result}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "budget_history.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// EMI checkbox toggle
document.getElementById("emiCheckbox").addEventListener("change", () => {
  document.getElementById("emiDetails").style.display =
    document.getElementById("emiCheckbox").checked ? "block" : "none";
});

// Dark Mode toggle
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
