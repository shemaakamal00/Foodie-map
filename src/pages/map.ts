import { fromTable, fromTableFiltered } from "../supabase.ts";

interface Restaurant {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
}

const map = L.map("map").setView([59.3293, 18.0686], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

let markers: L.Marker[] = [];

function clearMarkers() {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];
}

function placeMarkers(restaurants: Restaurant[]) {
  clearMarkers();

  restaurants.forEach((restaurant) => {
    if (restaurant.latitude == null || restaurant.longitude == null) return;

    const marker = L.marker([restaurant.latitude, restaurant.longitude])
      .addTo(map)
      .bindPopup(`
        <strong>${restaurant.name}</strong><br/>
        ${restaurant.address ?? ""}<br/>
        ${restaurant.description ? `<em>${restaurant.description}</em>` : ""}
      `);

    markers.push(marker);
  });
}

async function loadAll() {
  const restaurants = await fromTable<Restaurant>(
    "restaurant",
    "id,name,description,address,latitude,longitude,image_url"
  );
  placeMarkers(restaurants);
}

async function search(query: string) {
  if (!query.trim()) {
    loadAll();
    return;
  }

  const restaurants = await fromTableFiltered<Restaurant>(
    "restaurant",
    { name: `ilike.*${query}*` },
    "id,name,description,address,latitude,longitude,image_url"
  );

  placeMarkers(restaurants);

  if (restaurants.length === 1 && restaurants[0].latitude && restaurants[0].longitude) {
    map.setView([restaurants[0].latitude, restaurants[0].longitude], 16);
  }
}

const input = document.getElementById("search-input") as HTMLInputElement;
const button = document.getElementById("search-btn") as HTMLButtonElement;

button.addEventListener("click", () => search(input.value));
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") search(input.value);
});

loadAll();
