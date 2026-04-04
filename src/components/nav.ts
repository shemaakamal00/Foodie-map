export function renderNav(): void {
  const nav = document.createElement("nav");
  nav.className = "main-nav";
  nav.innerHTML = `
    <div class="nav-container">
      <a href="/startsida.html" class="nav-logo">
        <span class="logo-icon">🍽️</span>
        <span class="logo-text">Foodie Map</span>
      </a>
      <ul class="nav-links">
        <li><a href="/startsida.html">Hem</a></li>
        <li><a href="/restaurangsida.html">Restaurang</a></li>
        <li><a href="/kartsida.html">Karta</a></li>
        <li><a href="/favoritsida.html">Favoriter</a></li>
        <li><a href="/tipssida.html">Tips</a></li>
      </ul>
    </div>
  `;
  document.body.insertBefore(nav, document.body.firstChild);
}

export function setActiveNavLink(): void {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".nav-links a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && currentPath.endsWith(href.replace("/", ""))) {
      link.classList.add("active");
    }
  });
}
