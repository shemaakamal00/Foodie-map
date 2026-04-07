import { fromTable } from "../supabase";
import type {
  Restaurant,
  Diet,
  RestaurantDiet,
  RestaurantWithDiets,
} from "../types/restaurant";

export async function fetchRestaurants(): Promise<RestaurantWithDiets[]> {
  const restaurants = await fromTable<Restaurant>("restaurant");
  const diets = await fromTable<Diet>("diet");
  const restaurantDiets = await fromTable<RestaurantDiet>("restaurant_diet");

  const restaurantsWithDiets: RestaurantWithDiets[] = restaurants.map(
    (restaurant) => {
      const matchingDietIds = restaurantDiets
        .filter((item) => item.restaurant_id === restaurant.id)
        .map((item) => item.diet_id);

      const matchingDietNames = diets
        .filter((diet) => matchingDietIds.includes(diet.id))
        .map((diet) => diet.name);

      return {
        ...restaurant,
        diets: matchingDietNames,
      };
    }
  );

  return restaurantsWithDiets;
}