import "./css/style.css";
import "./css/nav.css";
import "./css/footer.css";
import "./pages/favorites.ts";
import "./pages/map.ts";
import "./pages/restaurants.ts";
import { renderNav, setActiveNavLink } from "./components/nav.ts";
import { renderFooter } from "./components/footer.ts";

export function initApp(): void {
  renderNav();
  setActiveNavLink();
  renderFooter();
}

initApp();
