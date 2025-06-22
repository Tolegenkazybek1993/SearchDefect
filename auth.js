
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("login-status");
  status.textContent = "⏳ Вход...";

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      status.textContent = "✅ Успешный вход. Перенаправление...";
      setTimeout(() => window.location.href = "verify.html", 1000);
    })
    .catch(error => {
      status.textContent = "❌ Ошибка: " + error.message;
    });
}
