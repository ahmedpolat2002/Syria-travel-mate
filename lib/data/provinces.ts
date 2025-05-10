import DB from "@/lib/db";
import { Provinces } from "@/types/provinces";

export function getProvinces() {
  const db = DB();
  return db
    .prepare("SELECT * FROM provinces WHERE deleted = 0")
    .all() as Provinces[];
}

export function getAllProvinces(): Provinces[] {
  const db = DB();
  return db
    .prepare("SELECT * FROM provinces WHERE deleted = 0 ORDER BY id DESC")
    .all() as Provinces[];
}

export function getProvinceById(id: string): Provinces | null {
  const db = DB();
  return db
    .prepare("SELECT * FROM provinces WHERE id = ? AND deleted = 0")
    .get(id) as Provinces | null;
}
