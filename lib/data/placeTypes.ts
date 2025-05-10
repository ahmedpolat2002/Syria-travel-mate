// lib/data/placeTypes.ts
import DB from "@/lib/db";
import { PlaceType } from "@/types/placeTypes";

export function getAllPlaceTypes(): PlaceType[] {
  const db = DB();
  return db
    .prepare("SELECT * FROM place_types WHERE deleted = 0 ORDER BY id DESC")
    .all() as PlaceType[];
}

export function getPlaceTypeById(id: string): PlaceType | null {
  const db = DB();
  return db
    .prepare("SELECT * FROM place_types WHERE id = ? AND deleted = 0")
    .get(id) as PlaceType | null;
}
