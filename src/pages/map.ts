import L from "leaflet";
import { fromTable } from "../supabase";

interface RestaurantRecord {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  category_id: number | null;
}

interface Diet {
  id: number;
  name: string;
}

interface RestaurantDiet {
  restaurant_id: number;
  diet_id: number;
}

interface Category {
  id: number;
  name: string;
}

interface RestaurantWithMeta extends RestaurantRecord {
  diets: string[];
  category: string | null;
}

const mapElement = document.getElementById("map");
const input = document.getElementById("search-input") as HTMLInputElement | null;
const button = document.getElementById("search-btn") as HTMLButtonElement | null;

let map: L.Map | null = null;
let markers: L.Marker[] = [];
let allRestaurants: RestaurantWithMeta[] = [];

const BRAND_COLOR = "#3e5a5b";

function createCustomIcon(): L.DivIcon {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
      <path
        d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 24 14 24S28 23.333 28 14C28 6.268 21.732 0 14 0z"
        fill="${BRAND_COLOR}"
      />
      <circle cx="14" cy="14" r="6" fill="#fff" />
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: "custom-marker",
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -38],
  });
}

function normalizeDiet(diet: string): string {
  const normalizedDiet = diet.trim().toLowerCase();

  if (normalizedDiet.includes("halal")) return "halal";
  if (normalizedDiet.includes("vegetar")) return "vegetarian";
  if (normalizedDiet.includes("veg")) return "vegan";
  if (normalizedDiet.includes("gluten")) return "glutenfree";
  if (normalizedDiet.includes("kosher")) return "kosher";

  return "unknown";
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

function clearMarkers(): void {
  if (!map) return;

  markers.forEach((marker) => map?.removeLayer(marker));
  markers = [];
}

function createPopupContent(restaurant: RestaurantWithMeta): string {
  const imageUrl =
    restaurant.image_url ?? "https://placehold.co/320x220?text=Restaurang";

  const dietTags = restaurant.diets.length
    ? restaurant.diets
        .map(
          (diet) => `<span class="tag ${getDietClass(diet)}">${diet}</span>`
        )
        .join("")
    : `<span class="tag tag-unknown">Okänd kategori</span>`;

  const addressLine = restaurant.address?.trim()
    ? `<p class="map-popup-address">${restaurant.address}</p>`
    : "";

  const descriptionLine = restaurant.description?.trim()
    ? `<p class="map-popup-description">${restaurant.description}</p>`
    : "";

  return `
    <div class="map-popup">
      <div class="map-popup-image-shell">
        <img
          src="${imageUrl}"
          alt="Bild på ${restaurant.name}"
          class="map-popup-image"
        />
      </div>
      <div class="map-popup-title">
        <div class="map-popup-heading-row">
          <h3>${restaurant.name}</h3>
          <div class="restaurant-tags map-popup-tags">${dietTags}</div>
        </div>
        ${addressLine}
        ${descriptionLine}
      </div>
    </div>
  `;
}

function placeMarkers(restaurants: RestaurantWithMeta[]): void {
  const currentMap = map;
  if (!currentMap) return;

  clearMarkers();

  const icon = createCustomIcon();

  restaurants.forEach((restaurant) => {
    if (restaurant.latitude == null || restaurant.longitude == null) return;

    const marker = L.marker([restaurant.latitude, restaurant.longitude], {
      icon,
    })
      .addTo(currentMap)
      .bindPopup(createPopupContent(restaurant), {
        maxWidth: 380,
      });

    markers.push(marker);
  });

  if (restaurants.length > 0) {
    const validCoordinates = restaurants
      .filter(
        (restaurant) =>
          restaurant.latitude != null && restaurant.longitude != null
      )
      .map(
        (restaurant) =>
          [restaurant.latitude!, restaurant.longitude!] as [number, number]
      );

    if (validCoordinates.length === 1) {
      currentMap.setView(validCoordinates[0], 15);
    } else if (validCoordinates.length > 1) {
      currentMap.fitBounds(validCoordinates, { padding: [30, 30] });
    }
  }
}

function search(query: string): void {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    placeMarkers(allRestaurants);
    return;
  }

  const filteredRestaurants = allRestaurants.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(normalizedQuery) ||
      (restaurant.address ?? "").toLowerCase().includes(normalizedQuery) ||
      (restaurant.description ?? "").toLowerCase().includes(normalizedQuery) ||
      (restaurant.category ?? "").toLowerCase().includes(normalizedQuery) ||
      restaurant.diets.some((diet) =>
        diet.toLowerCase().includes(normalizedQuery)
      )
    );
  });

  placeMarkers(filteredRestaurants);
}

async function loadAll(): Promise<void> {
  const [restaurants, diets, restaurantDiets, categories] = await Promise.all([
    fromTable<RestaurantRecord>(
      "restaurant",
      "id,name,description,address,latitude,longitude,image_url,category_id"
    ),
    fromTable<Diet>("diet"),
    fromTable<RestaurantDiet>("restaurant_diet"),
    fromTable<Category>("category"),
  ]);

  allRestaurants = restaurants.map((restaurant) => {
    const matchingDietIds = restaurantDiets
      .filter((item) => item.restaurant_id === restaurant.id)
      .map((item) => item.diet_id);

    const matchingDietNames = diets
      .filter((diet) => matchingDietIds.includes(diet.id))
      .map((diet) => diet.name);

    const category =
      categories.find((item) => item.id === restaurant.category_id)?.name ??
      null;

    return {
      ...restaurant,
      diets: matchingDietNames,
      category,
    };
  });

  placeMarkers(allRestaurants);
}

if (mapElement) {
  map = L.map("map").setView([59.3293, 18.0686], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  button?.addEventListener("click", () => {
    search(input?.value ?? "");
  });

  input?.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "Enter") search(input?.value ?? "");
  });

  void loadAll().then(() => {
    setTimeout(() => {
      map?.invalidateSize();
    }, 0);
  });
}