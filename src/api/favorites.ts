import { fromTable} from "../supabase";
import { SUPABASE_URL, SUPABASE_KEY } from "../database";

type Favorite = {
  id: number;
  restaurant_id: number;
  device_id: string;
};

export async function fetchFavorites(): Promise<Favorite[]> {
  const favorites = await fromTable<Favorite>("favorites");
  return favorites;
}

export async function removeFavorite(
  restaurantId: number,
  deviceId: string
) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/favorites?restaurant_id=eq.${restaurantId}&device_id=eq.${deviceId}`,
    {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    console.error("Delete error:", await res.text());
  }
}
