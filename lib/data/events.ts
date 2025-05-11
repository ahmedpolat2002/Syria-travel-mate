import DB from "@/lib/db";
import { Event } from "@/types/events";
import { Provinces } from "@/types/provinces";

export function getAllEvents(): (Event & { provinceName: string })[] {
  const db = DB();
  return db
    .prepare(
      `
      SELECT events.*, provinces.name as provinceName
      FROM events
      JOIN provinces ON events.provinceId = provinces.id
      WHERE events.deleted = 0
      ORDER BY events.created_at DESC
    `
    )
    .all() as (Event & { provinceName: string })[];
}

export function getEventById(id: string): Event | null {
  const db = DB();
  return db
    .prepare("SELECT * FROM events WHERE id = ? AND deleted = 0")
    .get(id) as Event | null;
}

export function getProvinces(): Provinces[] {
  const db = DB();
  return db
    .prepare("SELECT * FROM provinces WHERE deleted = 0")
    .all() as Provinces[];
}
