import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the prop types for our component
export default function APIComparisonChart({
  restData = {
    cpuArr: ["0"],
    ramArr: ["0"],
    responseTime: [0],
    sizeInBytes: [0],
  },
  graphqlData = {
    cpuArr: [0],
    ramArr: [0],
    responseTime: [0],
    sizeInBytes: [0],
  },
  iterations = 1,
  numOfReq = 10,
  title = "REST API vs GraphQL Performance",
  description = "",
}) {
  const toFloat = (val: string | number | undefined): number => {
    return parseFloat(val as string) || 0;
  };
  // Extract values from the passed data props with fallbacks
  const restResponseTime = toFloat(restData.responseTime?.[0]);
  const restCpuUsage = toFloat(restData.cpuArr?.[0]);
  const restRamUsage = toFloat(restData.ramArr?.[0]);
  const restResponseSize = toFloat(restData.sizeInBytes?.[0]);

  const graphqlResponseTime = toFloat(graphqlData.responseTime?.[0]);
  const graphqlCpuUsage = toFloat(graphqlData.cpuArr?.[0]);
  const graphqlRamUsage = toFloat(graphqlData.ramArr?.[0]);
  const graphqlResponseSize = toFloat(graphqlData.sizeInBytes?.[0]);

  // Create the single run data object
  const singleRunData = [
    {
      name: "Response Time (ms)",
      REST: restResponseTime,
      GraphQL: graphqlResponseTime,
    },
    {
      name: "CPU Usage (%)",
      REST: restCpuUsage,
      GraphQL: graphqlCpuUsage,
    },
    {
      name: "RAM Usage (MB)",
      REST: restRamUsage,
      GraphQL: graphqlRamUsage,
    },
    {
      name: "Size (KB)",
      REST: restResponseSize,
      GraphQL: graphqlResponseSize,
    },
  ];

  // Function to create multiple runs data based on arrays
  const createMultipleRunsData = () => {
    // Get the arrays from props or use defaults
    const restResponseTimes = restData.responseTime || [15];
    const restCpuUsages = restData.cpuArr || [2.32];
    const restRamUsages = restData.ramArr || [0.08];
    const restResponseSizes = restData.sizeInBytes || [3.28];

    const graphqlResponseTimes = graphqlData.responseTime || [20];
    const graphqlCpuUsages = graphqlData.cpuArr || [2.64];
    const graphqlRamUsages = graphqlData.ramArr || [0.21];
    const graphqlResponseSizes = graphqlData.sizeInBytes || [2.25];

    // Determine max length of any array to know how many runs to show
    const maxLength = Math.max(
      restResponseTimes.length,
      restCpuUsages.length,
      restRamUsages.length,
      restResponseSizes.length,
      graphqlResponseTimes.length,
      graphqlCpuUsages.length,
      graphqlRamUsages.length,
      graphqlResponseSizes.length
    );

    // Prepare the multiple runs data object
    const responseTimeData = [];
    const cpuUsageData = [];
    const ramUsageData = [];
    const responseSizeData = [];

    for (let i = 0; i < maxLength; i++) {
      responseTimeData.push({
        name: `Run ${i + 1}`,
        REST: restResponseTimes[i] || restResponseTimes[0],
        GraphQL: graphqlResponseTimes[i] || graphqlResponseTimes[0],
      });

      cpuUsageData.push({
        name: `Run ${i + 1}`,
        REST: restCpuUsages[i] || restCpuUsages[0],
        GraphQL: graphqlCpuUsages[i] || graphqlCpuUsages[0],
      });

      ramUsageData.push({
        name: `Run ${i + 1}`,
        REST: restRamUsages[i] || restRamUsages[0],
        GraphQL: graphqlRamUsages[i] || graphqlRamUsages[0],
      });

      responseSizeData.push({
        name: `Run ${i + 1}`,
        REST: restResponseSizes[i] || restResponseSizes[0],
        GraphQL: graphqlResponseSizes[i] || graphqlResponseSizes[0],
      });
    }

    return {
      responseTime: responseTimeData,
      cpuUsage: cpuUsageData,
      ramUsage: ramUsageData,
      responseSize: responseSizeData,
    };
  };

  // Generate the multiple runs data
  const multipleRunsData = createMultipleRunsData();

  const key: MetricKey = "responseTime";
  const data = multipleRunsData[key];

  type MetricKey = keyof typeof multipleRunsData;
  const [selectedMetric, setSelectedMetric] =
    React.useState<MetricKey>("responseTime");
  const [viewType, setViewType] = React.useState("overview");

  const getYAxisLabel = () => {
    switch (selectedMetric) {
      case "responseTime":
        return "Time (ms)";
      case "cpuUsage":
        return "CPU (%)";
      case "ramUsage":
        return "RAM (GB)";
      case "responseSize":
        return "Size (KB)";
      default:
        return "";
    }
  };

  const metricNames: { [key: string]: string } = {
    responseTime: "Response Time (ms)",
    cpuUsage: "CPU Usage (%)",
    ramUsage: "RAM Usage (GB)",
    responseSize: "Size (KB)",
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {description ||
              `Comparing performance metrics between REST and GraphQL (${numOfReq} requests, ${iterations} iteration${
                iterations > 1 ? "s" : ""
              })`}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Tabs value={viewType} onValueChange={setViewType} className="w-full">
          <TabsList className="grid w-[200px] grid-cols-2 mx-auto mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={singleRunData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="REST" fill="#3B82F6" name="REST API" />
                <Bar dataKey="GraphQL" fill="#e535ab" name="GraphQL" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="detailed" className="mt-0">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {metricNames[selectedMetric]}
              </h3>
              <Select
                value={selectedMetric}
                onValueChange={(value: MetricKey) => setSelectedMetric(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="responseTime">Response Time</SelectItem>
                  <SelectItem value="cpuUsage">CPU Usage</SelectItem>
                  <SelectItem value="ramUsage">RAM Usage</SelectItem>
                  <SelectItem value="responseSize">Response Size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={multipleRunsData[selectedMetric]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{
                    value: getYAxisLabel(),
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="REST" fill="#3B82F6" name="REST API" />
                <Bar dataKey="GraphQL" fill="#e535ab" name="GraphQL" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
