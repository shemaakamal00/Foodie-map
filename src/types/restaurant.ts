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
  
  export type RestaurantWithDiets = Restaurant & {
    diets: string[];
  };