export interface Event {
  id: number;
  title: string;
  description: string;
  provinceId: number;
  image: string;
  startDate: string;
  endDate: string;
  latitude: number;
  longitude: number;
  status: "active" | "finished" | "cancelled";
  deleted: boolean;
  created_at: string;
}
