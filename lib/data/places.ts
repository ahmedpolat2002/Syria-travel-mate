import DB from "@/lib/db";
import { Provinces } from "@/types/provinces";
import { Place } from "@/types/places";
import { PlaceType } from "@/types/placeTypes";

export function getAllPlaces(): (Place & {
  typeName: string;
  provinceName: string;
})[] {
  const db = DB();
  return db
    .prepare(
      `
    SELECT
      places.*,
      place_types.name as typeName,
      provinces.name as provinceName
    FROM places
    JOIN place_types ON places.typeId = place_types.id
    JOIN provinces ON places.provinceId = provinces.id
    WHERE places.deleted = 0
    ORDER BY places.created_at DESC
  `
    )
    .all() as (Place & { typeName: string; provinceName: string })[];
}

export function getPlaceById(id: string): Place | null {
  const db = DB();
  return db
    .prepare("SELECT * FROM places WHERE id = ? AND deleted = 0")
    .get(id) as Place | null;
}

export function getPlaceTypes(): PlaceType[] {
  const db = DB();
  return db
    .prepare("SELECT * FROM place_types WHERE deleted = 0")
    .all() as PlaceType[];
}

export function getProvinces(): Provinces[] {
  const db = DB();
  return db
    .prepare("SELECT * FROM provinces WHERE deleted = 0")
    .all() as Provinces[];
}
