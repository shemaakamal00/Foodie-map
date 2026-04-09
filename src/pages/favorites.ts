import { fetchRestaurants } from "../api/restaurants";
import type { RestaurantWithDiets } from "../types/restaurant";
import { fetchFavorites, removeFavorite } from "../api/favorites";
export { renderFavorites };
const list = document.getElementById("favorites-list");
const container = document.querySelector(".container");
let currentRestaurants: RestaurantWithDiets[] = [];

function getDeviceId(): string {
  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
}

console.log("Device ID:", getDeviceId());



export function getDietClass(diet: string): string {
  const normalizedDiet = diet.trim().toLowerCase();

  if (normalizedDiet.includes("halal")) return "tag-halal";
  if (normalizedDiet.includes("vegetar")) return "tag-vegetarian";
  if (normalizedDiet.includes("veg")) return "tag-vegan";
  if (normalizedDiet.includes("gluten")) return "tag-glutenfree";
  if (normalizedDiet.includes("kosher")) return "tag-kosher";

  return "tag-unknown";
}
function renderFavorites(restaurants: RestaurantWithDiets[]) {
  if (!list) return;

  list.innerHTML = restaurants
    .map((r) => {
     const dietTags = r.diets && r.diets.length
  ? r.diets
      .map(
        (d) =>
          `<span class="tag ${getDietClass(d)}">${d}</span>`
      )
      .join("")
  : `<span class="tag tag-unknown">Okänd kategori</span>`;
      return `
        <div class="card" data-id = "${r.id}">
          <img src="${r.image_url}" class="favorites-image" />

          <div class="card-text">
            <div class="card-header">
              <h2>${r.name}</h2>
             

              <div class="remove-button">
                <button data-id="${r.id}" class="btn btn-primary remove-btn">
                  Ta bort
                </button>
              </div>
            </div>

            <p>${r.address}</p>
            <hr>

            <div class="diet-list">
              ${dietTags}
            </div>

            <p>${r.description}</p>
          </div>
        </div>
      `;
    })
    .join("");
}
list?.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.closest(".remove-btn")) return;
  const card = target.closest(".card") as HTMLElement;
  if (!card) return;
   const id = card.dataset.id;
   console.log("Clicked restaurant id:", id);
  
  renderRightBox(Number(id));
  container?.classList.add("show-detail");
  openRestaurant();

  
});
async function loadFavorites() {
  const restaurants = await fetchRestaurants();
  const allFavorites = await fetchFavorites();

  const deviceId = getDeviceId();

  const myFavorites = allFavorites.filter(
    (f) => f.device_id === deviceId
  );

  const favoriteIds = myFavorites.map((f) => f.restaurant_id);

  const filtered = restaurants.filter((r) =>
    favoriteIds.includes(r.id)
  );

  currentRestaurants = filtered; 

  renderFavorites(filtered);
}



function renderRightBox(id: number) {
  const restaurant = currentRestaurants.find((r) => r.id === id);
  if (!restaurant) return;

  const imageContainer = document.getElementById("map-container");
  const container = document.querySelector(".right-text-container");

  const mapEmbed = `
  <div class="map-container">
    <div class = "right-map-image">
    <iframe
      width="100%"
      height="100%"
      style="border:0"
      loading="lazy"
      allowfullscreen
      src="https://www.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&output=embed">
    </iframe>
  </div>
    </div>
`;

  if (!container || !imageContainer ) return;

  const dietTags = restaurant.diets?.length
    ? restaurant.diets
        .map((d) => `<span class="tag ${getDietClass(d)}">${d}</span>`)
        .join("")
    : `<span class="tag tag-unknown">Okänd kategori</span>`;

     imageContainer.innerHTML = `
     
        ${mapEmbed}
    
`;

  container.innerHTML = `
   
  
    <div class="image-header-content">
      <div class="right-restaurant-image">
        <img src="${restaurant.image_url}" />
        
      </div>
      

       
        

      <div class="right-text-content">
        <h2>${restaurant.name}</h2>
       
        
     <p class="location">${restaurant.address}</p>
      <a href="${restaurant.website_url}" target="_blank" class = "visit-website-btn">
      Besök Hemsida
      </a>



        <div class="diet-list">
          ${dietTags}
        </div>

      </div>
    </div>
<hr>
    <div class="right-description-content">
 
      <p>${restaurant.description}</p>
    </div>
  `;
}
list?.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
   const removeBtn = target.closest(".remove-btn") as HTMLElement;
   if (removeBtn) {
    const id = Number(removeBtn.dataset.id);
    const deviceId = getDeviceId();
    await removeFavorite(id, deviceId);
   loadFavorites();
    return;
  }

  
  const card = target.closest(".card") as HTMLElement;
  if (!card) return;

  const id = Number(card.dataset.id);
  renderRightBox(id);
});



function openRestaurant() {
  container?.classList.add("show-detail");
}
document.getElementById("back-button")?.addEventListener("click", () => {
  document.querySelector(".container")?.classList.remove("show-detail");
});

loadFavorites();

