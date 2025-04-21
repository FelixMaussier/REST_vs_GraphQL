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
