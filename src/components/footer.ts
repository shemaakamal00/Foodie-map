export function renderFooter(): void {
  const footer = document.createElement("footer");
  footer.className = "main-footer";
  footer.innerHTML = `
    <div class="footer-container">
      <div class="footer-brand">
        <span class="logo-icon">🍽️</span>
        <span>Foodie Map</span>
      </div>
      <p class="footer-text">Hitta halal, veganskt mat och mycket mer i Stockholm</p>
      <p class="footer-copyright">© 2026 Foodie Map</p>
    </div>
  `;
  document.body.appendChild(footer);
}
