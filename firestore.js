
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

const adminEmail = "tolegen.kazybek1993@gmail.com";

auth.onAuthStateChanged(async user => {
  if (!user || user.email !== adminEmail) {
    document.getElementById("notAdmin").style.display = "block";
    return;
  }
  document.getElementById("adminContent").style.display = "block";

  // Загрузка логов
  const tbody = document.querySelector("#logsTable tbody");
  const logs = await db.collection("logs").orderBy("timestamp", "desc").get();
  logs.forEach(doc => {
    const d = doc.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${d.email}</td><td>${d.filename}</td><td>${d.total}</td><td>${d.errors}</td><td>${new Date(d.timestamp.toDate()).toLocaleString()}</td>`;
    tbody.appendChild(tr);
  });

  // Список пользователей (только отображаем текущего, Firebase Admin SDK требуется на сервере)
  document.getElementById("userList").innerText = user.email + " (администратор)";
});

async function uploadJSON() {
  const file = document.getElementById("jsonInput").files[0];
  const status = document.getElementById("uploadStatus");
  if (!file) {
    alert("Выберите JSON-файл");
    return;
  }
  const text = await file.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    status.innerText = "❌ Ошибка: некорректный JSON";
    return;
  }
  await db.collection("settings").doc("rules").set({ data: parsed, updated: new Date() });
  status.innerText = "✅ Правила успешно обновлены";
}
