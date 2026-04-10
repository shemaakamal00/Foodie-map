import { fromTable } from "../supabase.ts";

export type Restaurant = {
  id: number;
  name: string;
  image_url: string;
  website_url: string;
  description: string;
};

export type Diet = {
  id: number;
  name: string;
};

export type RestaurantDiet = {
  restaurant_id: number;
  diet_id: number;
};

type DietCard = {
  id: number;
  name: string;
  image_url: string;
};

const homeSampleList = document.getElementById("home-sample-list-unique");

function getDietDescription(name: string): string {
  const lower = name.toLowerCase();

  if (lower.includes("halal")) return "Hitta restauranger med halalalternativ.";
  if (lower.includes("vegan")) return "Utforska växtbaserade alternativ.";
  if (lower.includes("kosher")) return "Se restauranger med kosheranpassad mat.";
  if (lower.includes("gluten")) return "Hitta tryggare glutenfria alternativ.";

  return `Visa restauranger med ${name.toLowerCase()} alternativ.`;
}

function renderDietLinks(dietCards: DietCard[]) {
  if (!homeSampleList) return;

  if (!dietCards.length) {
    homeSampleList.innerHTML = "<p>Inga kosttyper kunde visas.</p>";
    return;
  }

  homeSampleList.innerHTML = dietCards
    .map(
      (diet) => `
        <a href="/restaurangsida.html?dietId=${diet.id}" class="card home-diet-link">
          <img
            src="${diet.image_url}"
            alt="${diet.name}"
            class="home-diet-image"
          />
          <h3>${diet.name}</h3>
          <p>${getDietDescription(diet.name)}</p>
        </a>
      `
    )
    .join("");
}

async function loadDietLinks() {
  try {
    const [restaurants, diets, restaurantDiets] = await Promise.all([
      fromTable("restaurant", "id,name,image_url,website_url,description"),
      fromTable("diet", "id,name"),
      fromTable("restaurant_diet", "restaurant_id,diet_id"),
    ]);

    if (
      !Array.isArray(restaurants) ||
      !Array.isArray(diets) ||
      !Array.isArray(restaurantDiets)
    ) {
      if (homeSampleList) {
        homeSampleList.innerHTML = "<p>Kunde inte ladda kosttyper.</p>";
      }
      return;
    }

    const typedRestaurants = restaurants as Restaurant[];
    const typedDiets = diets as Diet[];
    const typedRestaurantDiets = restaurantDiets as RestaurantDiet[];

    const selectedDiets = typedDiets.filter((diet) => {
      const lower = diet.name.toLowerCase();
      return (
        lower.includes("halal") ||
        lower.includes("vegan") ||
        lower.includes("kosher") ||
        lower.includes("gluten")
      );
    });

    const fallbackImage =
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80";

    const dietCards: DietCard[] = selectedDiets.map((diet) => {
      const relation = typedRestaurantDiets.find(
        (restaurantDiet) => restaurantDiet.diet_id === diet.id
      );

      const matchedRestaurant = typedRestaurants.find(
        (restaurant) => restaurant.id === relation?.restaurant_id
      );

      return {
        id: diet.id,
        name: diet.name,
        image_url: matchedRestaurant?.image_url || fallbackImage,
      };
    });

    renderDietLinks(dietCards);
  } catch (error) {
    console.error("Kunde inte hämta kosttyper:", error);
    if (homeSampleList) {
      homeSampleList.innerHTML = "<p>Kunde inte ladda kosttyper.</p>";
    }
  }
}

loadDietLinks();