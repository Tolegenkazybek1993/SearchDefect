
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

auth.onAuthStateChanged(user => {
  if (!user) {
    alert("⛔ Только для авторизованных пользователей.");
    window.location.href = "index.html";
  }
});

let rules = [];
fetch('data.json')
  .then(res => res.json())
  .then(data => rules = data);

function normalize(str) {
  return (str || '').toString().trim().toLowerCase().replace(/[‐‑‒–—―]/g, "-");
}

function handleFile() {
  const input = document.getElementById('fileInput');
  const status = document.getElementById('check-status');
  const downloadLink = document.getElementById('downloadLink');
  if (!input.files.length) return alert("Выберите файл");
  status.textContent = "⏳ Обработка...";

  const reader = new FileReader();
  reader.onload = function(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const checked = rows.map(row => {
      const mkb = normalize((row["Код МКБ-10"] || row["МКБ"] || "").split(" ")[0]);
      const reason = normalize(row["Повод обращения"]);
      const payment = normalize(row["Тип оплаты"] || row["Источник финансирования"]);
      const match = rules.find(rule =>
        normalize(rule["Код МКБ-10"]) === mkb &&
        normalize(rule["Повод обращения"]) === reason &&
        normalize(rule["Тип оплаты"]) === payment
      );
      return { ...row, "Результат проверки": match ? "OK" : "❌ Несоответствие" };
    });

    const newSheet = XLSX.utils.json_to_sheet(checked);
    const newWb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWb, newSheet, "Результат");
    const wbout = XLSX.write(newWb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });

    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.style.display = "block";
    status.textContent = "✅ Готово!";
  };
  reader.readAsArrayBuffer(input.files[0]);
}
