"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the type for combined REST and GraphQL API performance data
export interface ApiPerformanceData {
  // REST API data
  rest_avg: number[];
  rest_cpu_time: number[];
  rest_memory_diff: number[];
  rest_number_of_req: number;
  rest_number_of_user: number;
  rest_data: {
    date: string;
    responseTime: number;
    cpuTime: number;
    memoryUsage: number;
  }[];

  // GraphQL API data
  graphql_avg: number[];
  graphql_cpu_time: number[];
  graphql_memory_diff: number[];
  graphql_number_of_req: number;
  graphql_number_of_user: number;
  graphql_data: {
    date: string;
    responseTime: number;
    cpuTime: number;
    memoryUsage: number;
  }[];
}

// Placeholder data for demonstration
const placeholderData = {
  rest_avg: [120, 130, 115, 125, 140, 135, 120],
  rest_cpu_time: [80, 85, 75, 82, 90, 88, 79],
  rest_memory_diff: [15, 16, 14, 15, 17, 16, 15],
  rest_number_of_req: 1500,
  rest_number_of_user: 350,
  rest_data: [
    { date: "2025-04-01", responseTime: 120, cpuTime: 80, memoryUsage: 15 },
    { date: "2025-04-02", responseTime: 130, cpuTime: 85, memoryUsage: 16 },
    { date: "2025-04-03", responseTime: 115, cpuTime: 75, memoryUsage: 14 },
    { date: "2025-04-04", responseTime: 125, cpuTime: 82, memoryUsage: 15 },
    { date: "2025-04-05", responseTime: 140, cpuTime: 90, memoryUsage: 17 },
    { date: "2025-04-06", responseTime: 135, cpuTime: 88, memoryUsage: 16 },
    { date: "2025-04-07", responseTime: 120, cpuTime: 79, memoryUsage: 15 },
  ],

  graphql_avg: [95, 100, 90, 105, 110, 105, 98],
  graphql_cpu_time: [65, 70, 60, 72, 75, 71, 67],
  graphql_memory_diff: [18, 19, 17, 18, 20, 19, 18],
  graphql_number_of_req: 1200,
  graphql_number_of_user: 300,
  graphql_data: [
    { date: "2025-04-01", responseTime: 95, cpuTime: 65, memoryUsage: 18 },
    { date: "2025-04-02", responseTime: 100, cpuTime: 70, memoryUsage: 19 },
    { date: "2025-04-03", responseTime: 90, cpuTime: 60, memoryUsage: 17 },
    { date: "2025-04-04", responseTime: 105, cpuTime: 72, memoryUsage: 18 },
    { date: "2025-04-05", responseTime: 110, cpuTime: 75, memoryUsage: 20 },
    { date: "2025-04-06", responseTime: 105, cpuTime: 71, memoryUsage: 19 },
    { date: "2025-04-07", responseTime: 98, cpuTime: 67, memoryUsage: 18 },
  ],
};

export const DisplayDataInChart = ({
  // Use props if available, otherwise use placeholder data
  rest_avg = placeholderData.rest_avg,
  rest_cpu_time = placeholderData.rest_cpu_time,
  rest_memory_diff = placeholderData.rest_memory_diff,
  rest_number_of_req = placeholderData.rest_number_of_req,
  rest_number_of_user = placeholderData.rest_number_of_user,
  rest_data = placeholderData.rest_data,
  graphql_avg = placeholderData.graphql_avg,
  graphql_cpu_time = placeholderData.graphql_cpu_time,
  graphql_memory_diff = placeholderData.graphql_memory_diff,
  graphql_number_of_req = placeholderData.graphql_number_of_req,
  graphql_number_of_user = placeholderData.graphql_number_of_user,
  graphql_data = placeholderData.graphql_data,
}: Partial<ApiPerformanceData> = {}) => {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [metricType, setMetricType] = React.useState("responseTime");
  const [chartType, setChartType] = React.useState("line");

  // Combine and process data for visualization
  const processedData = React.useMemo(() => {
    // Get all unique dates from both datasets
    const allDates = new Set([
      ...rest_data.map((item) => item.date),
      ...graphql_data.map((item) => item.date),
    ]);

    // Create combined data array
    const combined = Array.from(allDates).map((date) => {
      const restItem = rest_data.find((item) => item.date === date) || {
        responseTime: null,
        cpuTime: null,
        memoryUsage: null,
      };

      const graphqlItem = graphql_data.find((item) => item.date === date) || {
        responseTime: null,
        cpuTime: null,
        memoryUsage: null,
      };

      return {
        date,
        restResponseTime: restItem.responseTime,
        restCpuTime: restItem.cpuTime,
        restMemoryUsage: restItem.memoryUsage,
        graphqlResponseTime: graphqlItem.responseTime,
        graphqlCpuTime: graphqlItem.cpuTime,
        graphqlMemoryUsage: graphqlItem.memoryUsage,
      };
    });

    // Sort by date
    return combined.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [rest_data, graphql_data]);

  // Filter data based on selected time range
  const filteredData = React.useMemo(() => {
    if (!processedData || !processedData.length) return [];

    const referenceDate = new Date();
    let daysToSubtract = 90;

    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return processedData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [processedData, timeRange]);

  // Get metric label based on selected type
  const getMetricLabel = () => {
    switch (metricType) {
      case "responseTime":
        return "Response Time (ms)";
      case "cpuTime":
        return "CPU Time (ms)";
      case "memoryUsage":
        return "Memory Usage (MB)";
      default:
        return "";
    }
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label).toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
          <p className="font-bold">{date}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value !== null ? entry.value : "N/A"} ${
                metricType === "memoryUsage" ? "MB" : "ms"
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Color constants
  const REST_COLOR = "#2563eb"; // blue-600
  const GRAPHQL_COLOR = "#ea580c"; // orange-600

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>REST vs GraphQL API Performance</CardTitle>
          <CardDescription>
            Comparing performance metrics between REST and GraphQL APIs
          </CardDescription>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={metricType} onValueChange={setMetricType}>
            <SelectTrigger
              className="w-40 rounded-lg"
              aria-label="Select metric type"
            >
              <SelectValue placeholder="Response Time" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="responseTime" className="rounded-lg">
                Response Time
              </SelectItem>
              <SelectItem value="cpuTime" className="rounded-lg">
                CPU Time
              </SelectItem>
              <SelectItem value="memoryUsage" className="rounded-lg">
                Memory Usage
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-40 rounded-lg"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger
              className="w-40 rounded-lg"
              aria-label="Select chart type"
            >
              <SelectValue placeholder="Line Chart" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="line" className="rounded-lg">
                Line Chart
              </SelectItem>
              <SelectItem value="area" className="rounded-lg">
                Area Chart
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={true}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("sv-SE", {
                      month: "numeric",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={true}
                  tickMargin={8}
                  domain={["auto", "auto"]}
                  label={{
                    value: metricType === "memoryUsage" ? "MB" : "ms",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {metricType === "responseTime" && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="restResponseTime"
                      name="REST Response Time"
                      stroke={REST_COLOR}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="graphqlResponseTime"
                      name="GraphQL Response Time"
                      stroke={GRAPHQL_COLOR}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls={true}
                    />
                  </>
                )}

                {metricType === "cpuTime" && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="restCpuTime"
                      name="REST CPU Time"
                      stroke={REST_COLOR}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="graphqlCpuTime"
                      name="GraphQL CPU Time"
                      stroke={GRAPHQL_COLOR}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls={true}
                    />
                  </>
                )}

                {metricType === "memoryUsage" && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="restMemoryUsage"
                      name="REST Memory Usage"
                      stroke={REST_COLOR}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="graphqlMemoryUsage"
                      name="GraphQL Memory Usage"
                      stroke={GRAPHQL_COLOR}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls={true}
                    />
                  </>
                )}
              </LineChart>
            ) : (
              <AreaChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={true}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("sv-SE", {
                      month: "numeric",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={true}
                  tickMargin={8}
                  domain={["auto", "auto"]}
                  label={{
                    value: metricType === "memoryUsage" ? "MB" : "ms",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />

                {metricType === "responseTime" && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="restResponseTime"
                      name="REST Response Time"
                      stroke={REST_COLOR}
                      fill={`${REST_COLOR}33`}
                      connectNulls={true}
                    />
                    <Area
                      type="monotone"
                      dataKey="graphqlResponseTime"
                      name="GraphQL Response Time"
                      stroke={GRAPHQL_COLOR}
                      fill={`${GRAPHQL_COLOR}33`}
                      connectNulls={true}
                    />
                  </>
                )}

                {metricType === "cpuTime" && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="restCpuTime"
                      name="REST CPU Time"
                      stroke={REST_COLOR}
                      fill={`${REST_COLOR}33`}
                      connectNulls={true}
                    />
                    <Area
                      type="monotone"
                      dataKey="graphqlCpuTime"
                      name="GraphQL CPU Time"
                      stroke={GRAPHQL_COLOR}
                      fill={`${GRAPHQL_COLOR}33`}
                      connectNulls={true}
                    />
                  </>
                )}

                {metricType === "memoryUsage" && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="restMemoryUsage"
                      name="REST Memory Usage"
                      stroke={REST_COLOR}
                      fill={`${REST_COLOR}33`}
                      connectNulls={true}
                    />
                    <Area
                      type="monotone"
                      dataKey="graphqlMemoryUsage"
                      name="GraphQL Memory Usage"
                      stroke={GRAPHQL_COLOR}
                      fill={`${GRAPHQL_COLOR}33`}
                      connectNulls={true}
                    />
                  </>
                )}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-500">
            <div className="text-lg font-bold mb-2 text-blue-700">
              REST API Stats
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-blue-600">
                  Avg Response Time
                </div>
                <div className="text-xl font-bold text-blue-800">
                  {rest_avg.length > 0
                    ? `${Math.round(
                        rest_avg.reduce((a, b) => a + b, 0) / rest_avg.length
                      )} ms`
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-blue-600">
                  Avg CPU Time
                </div>
                <div className="text-xl font-bold text-blue-800">
                  {rest_cpu_time.length > 0
                    ? `${Math.round(
                        rest_cpu_time.reduce((a, b) => a + b, 0) /
                          rest_cpu_time.length
                      )} ms`
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-blue-600">
                  Avg Memory Usage
                </div>
                <div className="text-xl font-bold text-blue-800">
                  {rest_memory_diff.length > 0
                    ? `${Math.round(
                        rest_memory_diff.reduce((a, b) => a + b, 0) /
                          rest_memory_diff.length
                      )} MB`
                    : "N/A"}
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-blue-500">
              {`${rest_number_of_req} requests from ${rest_number_of_user} users`}
            </div>
          </div>

          <div className="rounded-lg bg-orange-50 p-4 border-l-4 border-orange-500">
            <div className="text-lg font-bold mb-2 text-orange-700">
              GraphQL API Stats
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-orange-600">
                  Avg Response Time
                </div>
                <div className="text-xl font-bold text-orange-800">
                  {graphql_avg.length > 0
                    ? `${Math.round(
                        graphql_avg.reduce((a, b) => a + b, 0) /
                          graphql_avg.length
                      )} ms`
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-orange-600">
                  Avg CPU Time
                </div>
                <div className="text-xl font-bold text-orange-800">
                  {graphql_cpu_time.length > 0
                    ? `${Math.round(
                        graphql_cpu_time.reduce((a, b) => a + b, 0) /
                          graphql_cpu_time.length
                      )} ms`
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-orange-600">
                  Avg Memory Usage
                </div>
                <div className="text-xl font-bold text-orange-800">
                  {graphql_memory_diff.length > 0
                    ? `${Math.round(
                        graphql_memory_diff.reduce((a, b) => a + b, 0) /
                          graphql_memory_diff.length
                      )} MB`
                    : "N/A"}
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-orange-500">
              {`${graphql_number_of_req} requests from ${graphql_number_of_user} users`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
