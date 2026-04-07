import { fetchRestaurants } from "../api/restaurants";
import type { RestaurantWithDiets } from "../types/restaurant";

const restaurantList = document.getElementById("restaurant-list");
const resultsCount = document.getElementById("results-count");
const statusMessage = document.getElementById("status-message");
const searchInput = document.getElementById(
  "search-input"
) as HTMLInputElement | null;
const filterButtons = document.querySelectorAll(".filter-chip");

let allRestaurants: RestaurantWithDiets[] = [];
let activeFilter = "alla";

function normalizeDiet(diet: string): string {
  const normalizedDiet = diet.trim().toLowerCase();

  if (normalizedDiet.includes("halal")) return "halal";
  if (normalizedDiet.includes("vegetar")) return "vegetarian";
  if (normalizedDiet.includes("veg")) return "vegan";
  if (normalizedDiet.includes("gluten")) return "glutenfree";
  if (normalizedDiet.includes("kosher")) return "kosher";

  return "unknown";
}

function normalizeFilter(filter: string): string {
  const normalizedFilter = filter.trim().toLowerCase();

  if (normalizedFilter === "alla") return "alla";
  if (normalizedFilter.includes("halal")) return "halal";
  if (normalizedFilter.includes("vegetar")) return "vegetarian";
  if (normalizedFilter.includes("veg")) return "vegan";
  if (normalizedFilter.includes("gluten")) return "glutenfree";
  if (normalizedFilter.includes("kosher")) return "kosher";

  return normalizedFilter;
}

function getDietClass(diet: string): string {
  const normalizedDiet = normalizeDiet(diet);

  if (normalizedDiet === "halal") return "tag-halal";
  if (normalizedDiet === "vegan") return "tag-vegan";
  if (normalizedDiet === "vegetarian") return "tag-vegetarian";
  if (normalizedDiet === "glutenfree") return "tag-glutenfree";
  if (normalizedDiet === "kosher") return "tag-kosher";

  return "tag-unknown";
}

function updateResultsCount(count: number): void {
  if (!resultsCount) return;
  resultsCount.textContent = `Visar ${count} restauranger`;
}

function showStatusMessage(message: string): void {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.hidden = false;
}

function hideStatusMessage(): void {
  if (!statusMessage) return;
  statusMessage.hidden = true;
}

function renderRestaurants(restaurants: RestaurantWithDiets[]): void {
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

function getFilteredRestaurants(): RestaurantWithDiets[] {
  const searchValue = searchInput?.value.trim().toLowerCase() ?? "";

  return allRestaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchValue) ||
      restaurant.description.toLowerCase().includes(searchValue) ||
      restaurant.diets.some((diet) => diet.toLowerCase().includes(searchValue));

    const matchesFilter =
      activeFilter === "alla" ||
      restaurant.diets.some((diet) => normalizeDiet(diet) === activeFilter);

    return matchesSearch && matchesFilter;
  });
}

function applyFiltersAndSearch(): void {
  const filteredRestaurants = getFilteredRestaurants();
  renderRestaurants(filteredRestaurants);
}

function setupFilterButtons(): void {
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
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      applyFiltersAndSearch();
    });
  }
}

async function loadRestaurants(): Promise<void> {
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

setupFilterButtons();
setupSearch();
loadRestaurants();