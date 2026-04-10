import { fetchRestaurants } from "../api/restaurants";
import type { RestaurantWithDiets } from "../types/restaurant";
import { addFavorite } from "../api/favorites";

function getSearchInput(): HTMLInputElement | null {
  return document.getElementById("search-input") as HTMLInputElement | null;
}

function getFilterButtons(): NodeListOf<Element> {
  return document.querySelectorAll(".filter-chip");
}

function getDomElements() {
  return {
    restaurantList: document.getElementById("restaurant-list"),
    resultsCount: document.getElementById("results-count"),
    statusMessage: document.getElementById("status-message"),
  };
}

let allRestaurants: RestaurantWithDiets[] = [];
let activeFilter = "alla";

function getDeviceId(): string {
  let id = localStorage.getItem("device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("device_id", id);
  }
  return id;
}

export function normalizeDiet(diet: string): string {
  const normalizedDiet = diet.trim().toLowerCase();

  if (normalizedDiet.includes("halal")) return "halal";
  if (normalizedDiet.includes("vegetar")) return "vegetarian";
  if (normalizedDiet.includes("veg")) return "vegan";
  if (normalizedDiet.includes("gluten")) return "glutenfree";
  if (normalizedDiet.includes("kosher")) return "kosher";

  return "unknown";
}

export function normalizeFilter(filter: string): string {
  const normalizedFilter = filter.trim().toLowerCase();

  if (normalizedFilter === "alla") return "alla";
  if (normalizedFilter.includes("halal")) return "halal";
  if (normalizedFilter.includes("vegetar")) return "vegetarian";
  if (normalizedFilter.includes("veg")) return "vegan";
  if (normalizedFilter.includes("gluten")) return "glutenfree";
  if (normalizedFilter.includes("kosher")) return "kosher";

  return normalizedFilter;
}

export function getDietClass(diet: string): string {
  const normalizedDiet = normalizeDiet(diet);

  if (normalizedDiet === "halal") return "tag-halal";
  if (normalizedDiet === "vegan") return "tag-vegan";
  if (normalizedDiet === "vegetarian") return "tag-vegetarian";
  if (normalizedDiet === "glutenfree") return "tag-glutenfree";
  if (normalizedDiet === "kosher") return "tag-kosher";

  return "tag-unknown";
}

function updateResultsCount(count: number): void {
  const { resultsCount } = getDomElements();
  if (!resultsCount) return;
  resultsCount.textContent = `Visar ${count} restauranger`;
}

function showStatusMessage(message: string): void {
  const { statusMessage } = getDomElements();
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.hidden = false;
}

function hideStatusMessage(): void {
  const { statusMessage } = getDomElements();
  if (!statusMessage) return;
  statusMessage.hidden = true;
}

export function renderRestaurants(restaurants: RestaurantWithDiets[]): void {
  const { restaurantList } = getDomElements();
  if (!restaurantList) return;

  if (restaurants.length === 0) {
    restaurantList.innerHTML = "";
    updateResultsCount(0);
    showStatusMessage("Inga restauranger matchade din sökning.");
    return;
  }

  hideStatusMessage();
  updateResultsCount(restaurants.length);

  restaurantList.innerHTML = restaurants
    .map((restaurant) => {
      const dietTags = restaurant.diets.length
        ? restaurant.diets
            .map(
              (diet) =>
                `<span class="tag ${getDietClass(diet)}">${diet}</span>`
            )
            .join("")
        : `<span class="tag tag-unknown">Okänd kategori</span>`;

      return `
        <article class="restaurant-card">
          <img
            src="${restaurant.image_url}"
            alt="Bild på ${restaurant.name}"
            class="restaurant-image"
          />

          <div class="restaurant-card-content">
            <div class="restaurant-card-header">
              <h3>${restaurant.name}</h3>
             
              <button
                type="button"
                class="favorite-button"
                data-id="${restaurant.id}"
                aria-label="Lägg till som favorit"
              >
                ♡
              </button>
            </div>

            <div class="restaurant-tags">
              ${dietTags}
            </div>

            <p class="restaurant-description">
              ${restaurant.description}
            </p>

            <div class="restaurant-actions">
              <a
                href="${restaurant.website_url}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
              >
                Läs mer
              </a>

              <a
                href="https://www.google.com/search?q=${encodeURIComponent(
                  `${restaurant.name} Stockholm reviews`
                )}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
              >
                Recensioner
              </a>

              <a
                href="https://www.google.com/maps?q=${encodeURIComponent(
                  `${restaurant.name} Stockholm`
                )}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
              >
                Hitta hit
              </a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

export function filterRestaurants(
  restaurants: RestaurantWithDiets[],
  searchValue: string,
  activeFilter: string
): RestaurantWithDiets[] {
  const normalizedSearch = searchValue.trim().toLowerCase();

  return restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(normalizedSearch) ||
      restaurant.description.toLowerCase().includes(normalizedSearch) ||
      restaurant.diets.some((diet) =>
        diet.toLowerCase().includes(normalizedSearch)
      );

    const matchesFilter =
      activeFilter === "alla" ||
      restaurant.diets.some((diet) => normalizeDiet(diet) === activeFilter);

    return matchesSearch && matchesFilter;
  });
}

function getFilteredRestaurants(): RestaurantWithDiets[] {
  const searchValue = getSearchInput()?.value ?? "";
  return filterRestaurants(allRestaurants, searchValue, activeFilter);
}

function applyFiltersAndSearch(): void {
  const filteredRestaurants = getFilteredRestaurants();
  renderRestaurants(filteredRestaurants);
}

function setupFilterButtons(): void {
  const filterButtons = getFilterButtons();

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonText = button.textContent?.trim() ?? "Alla";
      activeFilter = normalizeFilter(buttonText);

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      applyFiltersAndSearch();
    });
  });
}

function setupSearch(): void {
  const searchInput = getSearchInput();

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      applyFiltersAndSearch();
    });
  }
}

async function loadRestaurants(): Promise<void> {
  const { restaurantList } = getDomElements();
  if (!restaurantList) return;

  try {
    allRestaurants = await fetchRestaurants();
    renderRestaurants(allRestaurants);
  } catch (error) {
    console.error("Kunde inte hämta restauranger:", error);
    restaurantList.innerHTML = "";
    updateResultsCount(0);
    showStatusMessage("Något gick fel när restaurangerna skulle laddas.");
  }
}

function init(): void {
  setupFilterButtons();
  setupSearch();
  loadRestaurants();

  const { restaurantList } = getDomElements();
  restaurantList?.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest(".favorite-button") as HTMLElement;
    if (!button) return;
    const id = button.getAttribute("data-id");
    if (!id) return;
    const deviceId = getDeviceId();
    await addFavorite(Number(id), deviceId);
    button.textContent = "❤️";
  });
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}
