
let icdData = [];
fetch('data.json')
  .then(res => res.json())
  .then(data => icdData = data);

function получить() {
  const код = document.getElementById('mkbInput').value.trim().toUpperCase();
  const resultBox = document.getElementById('result');
  resultBox.style.display = 'block';
  resultBox.innerHTML = "⏳ Поиск...";

  if (!код) {
    resultBox.innerHTML = "<b>Введите код диагноза.</b>";
    return;
  }

  const совпадения = icdData.filter(item => item["Код МКБ-10"] === код);
  if (!совпадения.length) {
    resultBox.innerHTML = `<div class="section warning"><b>❌ Не найдено в правилах</b></div>`;
    return;
  }

  const блоки = совпадения.map(row => `Повод обращения: <b>${row["Повод обращения"]}</b><br>Тип оплаты: <b>${row["Тип оплаты"]}</b>`);
  resultBox.innerHTML = `<div class="section accent"><b>📌 Из JSON:</b><br>${блоки.join('<br><br>')}</div>`;
}
