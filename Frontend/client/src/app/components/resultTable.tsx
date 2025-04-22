import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import React from "react";

// Definiera typen för metricsData för att säkerställa att komponenten tar emot rätt data
interface MetricsProps {
  api?: string;
  averageResponseTime?: number;
  method?: string;
  numOfReq?: number;
  numOfUsers?: number;
  requestsPer10ms?: number[];
  throughput?: number;
  totalTime?: number;
}

const MetricsTable: React.FC<MetricsProps> = ({
  api,
  averageResponseTime,
  method,
  numOfReq,
  numOfUsers,
  requestsPer10ms,
  throughput,
  totalTime,
}) => {
  return (
    <div className="metrics-table-container">
      <div className="metrics-table-container">
        <Table>
          <TableCaption>Performance Metrics</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">API</TableCell>
              <TableCell>{api ?? "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Average Response Time (ms)
              </TableCell>
              <TableCell>{averageResponseTime ?? "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Method</TableCell>
              <TableCell>{method ?? "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Number of Requests</TableCell>
              <TableCell>{numOfReq ?? "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Number of Users</TableCell>
              <TableCell>{numOfUsers ?? "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Requests per 10ms</TableCell>
              <TableCell>
                {requestsPer10ms && requestsPer10ms.length > 0
                  ? requestsPer10ms
                      .map((item) => (item != null ? item : 0)) // Ersätt null eller undefined med 0
                      .join(", ")
                  : "N/A"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Throughput (req/s)</TableCell>
              <TableCell>{throughput ?? "N/A"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Total Time (ms)</TableCell>
              <TableCell>{totalTime ?? "N/A"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MetricsTable;
