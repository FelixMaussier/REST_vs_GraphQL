"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Sample data based on your logs
const sampleApiData = {
  rounds: [
    {
      round: 1,
      rest: {
        cpu: 0.71,
        ram: 0.06,
        responseTime: 7,
        sizeInBytes: 3.283203125,
      },
      graphql: {
        cpu: 1.79,
        ram: 0.22,
        responseTime: 21,
        sizeInBytes: 2.2451171875,
      },
    },
    {
      round: 2,
      rest: {
        cpu: 0.57,
        ram: 0.07,
        responseTime: 8,
        sizeInBytes: 3.283203125,
      },
      graphql: {
        cpu: 0.89,
        ram: 0.2,
        responseTime: 9,
        sizeInBytes: 2.2451171875,
      },
    },
  ],
};

interface ApiData {
  rounds: Array<{
    round: number;
    rest: {
      cpu: number;
      ram: number;
      responseTime: number;
      sizeInBytes: number;
    };
    graphql: {
      cpu: number;
      ram: number;
      responseTime: number;
      sizeInBytes: number;
    };
  }>;
}

interface ChartDataPoint {
  name: string;
  rest: number;
  graphql: number;
}

type MetricType = "cpu" | "ram" | "responseTime" | "sizeInBytes";

// Chart configuration for styling
const chartConfig = {
  rest: {
    label: "REST API",
    color: "hsl(217, 91%, 60%)", // Blue
  },
  graphql: {
    label: "GraphQL API",
    color: "hsl(330, 86%, 65%)", // Pink
  },
} satisfies ChartConfig;

const metricLabels: Record<MetricType, string> = {
  cpu: "CPU Usage (%)",
  ram: "RAM Usage (GB)",
  responseTime: "Response Time (ms)",
  sizeInBytes: "Size (MB)",
};

export default function ApiComparisonChart({
  apiData = sampleApiData,
}: {
  apiData?: ApiData;
}) {
  const isMobile = useIsMobile ? useIsMobile() : false;
  const [metricType, setMetricType] = useState<MetricType>("cpu");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const formatTooltipValue = (value: number, name: string) => {
    if (metricType === "cpu") {
      return `${value}%`;
    } else if (metricType === "ram") {
      return `${value} GB`;
    } else if (metricType === "responseTime") {
      return `${value} ms`;
    } else if (metricType === "sizeInBytes") {
      return `${value} MB`;
    }
    return value;
  };

  useEffect(() => {
    // Transform data for the selected metric
    const transformedData: ChartDataPoint[] = apiData.rounds.map((round) => {
      let restValue: number, graphqlValue: number;

      if (metricType === "cpu") {
        restValue = round.rest.cpu;
        graphqlValue = round.graphql.cpu;
      } else if (metricType === "ram") {
        restValue = round.rest.ram;
        graphqlValue = round.graphql.ram;
      } else if (metricType === "responseTime") {
        restValue = round.rest.responseTime;
        graphqlValue = round.graphql.responseTime;
      } else {
        restValue = round.rest.sizeInBytes;
        graphqlValue = round.graphql.sizeInBytes;
      }

      return {
        name: `Round ${round.round}`,
        rest: restValue,
        graphql: graphqlValue,
      };
    });

    setChartData(transformedData);
  }, [metricType, apiData]);

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>API Comparison</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Performance comparison between REST and GraphQL APIs
          </span>
          <span className="@[540px]/card:hidden">REST vs GraphQL</span>
        </CardDescription>
        <div className="absolute right-4 top-4">
          <ToggleGroup
            type="single"
            value={metricType}
            onValueChange={(value: MetricType) => value && setMetricType(value)}
            variant="outline"
            className="@[767px]/card:flex hidden"
          >
            <ToggleGroupItem value="cpu" className="h-8 px-2.5">
              CPU
            </ToggleGroupItem>
            <ToggleGroupItem value="ram" className="h-8 px-2.5">
              RAM
            </ToggleGroupItem>
            <ToggleGroupItem value="responseTime" className="h-8 px-2.5">
              Time
            </ToggleGroupItem>
            <ToggleGroupItem value="sizeInBytes" className="h-8 px-2.5">
              Size
            </ToggleGroupItem>
          </ToggleGroup>
          <Select
            value={metricType}
            onValueChange={(value: MetricType) => setMetricType(value)}
          >
            <SelectTrigger
              className="@[767px]/card:hidden flex w-40"
              aria-label="Select a metric"
            >
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="cpu" className="rounded-lg">
                CPU Usage
              </SelectItem>
              <SelectItem value="ram" className="rounded-lg">
                RAM Usage
              </SelectItem>
              <SelectItem value="responseTime" className="rounded-lg">
                Response Time
              </SelectItem>
              <SelectItem value="sizeInBytes" className="rounded-lg">
                Size in Bytes
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillRest" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rest)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rest)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillGraphql" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-graphql)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-graphql)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              label={{
                value: metricLabels[metricType],
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
                dy: -10,
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value: any) =>
                    formatTooltipValue(Number(value), "")
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="rest"
              type="monotone"
              fill="url(#fillRest)"
              stroke="var(--color-rest)"
              name="REST API"
              stackId="1"
            />
            <Area
              dataKey="graphql"
              type="monotone"
              fill="url(#fillGraphql)"
              stroke="var(--color-graphql)"
              name="GraphQL API"
              stackId="2"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
