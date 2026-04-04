import "./css/style.css";
import "./css/nav.css";
import "./css/footer.css";
import { renderNav, setActiveNavLink } from "./components/nav.ts";
import { renderFooter } from "./components/footer.ts";

export function initApp(): void {
  renderNav();
  setActiveNavLink();
  renderFooter();
}

initApp();
