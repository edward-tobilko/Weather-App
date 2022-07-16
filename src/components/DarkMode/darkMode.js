// dark-mode

function darkMode() {
  const body = document.body;
  const wasDarkMode = localStorage.getItem("darkMode") === "true";

  localStorage.setItem("darkMode", !wasDarkMode);
  body.classList.toggle("dark-mode", !wasDarkMode);
}

// вызываем ф-ю darkMode при клике

document.querySelector(".darkMode__btn").addEventListener("click", darkMode);

// для сохранения состояния при обновлении странички

function onLoad() {
  document.body.classList.toggle(
    "dark-mode",
    localStorage.getItem("darkMode") === "true"
  );
}
document.addEventListener("DOMContentLoaded", onLoad);
