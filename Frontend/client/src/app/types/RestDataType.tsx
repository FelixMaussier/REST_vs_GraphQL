import { Product } from "./product";
interface SvarTiderData {
  rest_avg?: number;
  cpu_time?: number;
  memory_diff?: number;
  number_of_req?: number;
  number_of_user?: number;
  data?: Product[];
}
export default SvarTiderData;

export interface metricsData {
  api?: string; // REST eller GraphQL
  method?: string; // GET, POST, PUT, DELETE
  numOfReq?: number; // Antal requests
  numOfUsers?: number; // Antal användare
  totalTime?: number; // Total tid i ms
  throughput?: number; // Genomströmning i req/s
  avaregeResponseTime?: number; // Genomsnittlig svarstid i ms
  requestsPer10ms?: number[]; // Antal requests per 10ms
}
