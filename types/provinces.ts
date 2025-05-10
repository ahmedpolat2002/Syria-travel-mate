export interface Provinces {
  id: number;
  name: string;
  description: string;
  safetyStatus: "safe" | "warning" | "danger";
  image: string;
  latitude: number;
  longitude: number;
  deleted: boolean;
  created_at: Date;
}
