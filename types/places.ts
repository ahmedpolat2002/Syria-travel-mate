export interface Place {
  id: number;
  name: string;
  description: string;
  typeId: number;
  provinceId: number;
  image: string;
  safetyStatus: "safe" | "warning" | "danger";
  latitude: number;
  longitude: number;
  deleted: boolean;
  created_at: string;
}
