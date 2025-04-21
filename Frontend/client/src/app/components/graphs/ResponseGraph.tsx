import { Product } from "@/app/types/product";
import SvarTiderData from "@/app/types/RestDataType";
import { DisplayDataInChart } from "./DisplayDataInChart";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import Graph from "./Graph";
import { ResponseTime } from "./ResponseTime";
import React from "react";

const SvarTiderGraf = ({
  rest_avg,
  cpu_time,
  memory_diff,
  number_of_req,
  number_of_user,
  data,
}: SvarTiderData) => {
  return (
    <>
      {/*<DisplayDataInChart />*/}
      <h1> SvartiderGraf</h1>
      <p>rest_avg: {rest_avg}</p>
      <p>cpu_time: {cpu_time}</p>
      <p>number_of_req: {number_of_req}</p>
      <p>memory diff: {memory_diff}</p>
      <p>number of requests: {number_of_req}</p>
      {/*<Graph />*/}
    </>
  );
};

export default SvarTiderGraf;
