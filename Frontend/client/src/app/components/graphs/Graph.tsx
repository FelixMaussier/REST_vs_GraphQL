import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CartesianGrid, XAxis, AreaChart, Area } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ChartContainer } from "@/components/ui/chart";

const placeholderData = {
  rest_data: [
    { date: "2025-04-01", responseTime: 120 },
    { date: "2025-04-02", responseTime: 130 },
    { date: "2025-04-03", responseTime: 115 },
    { date: "2025-04-04", responseTime: 125 },
    { date: "2025-04-05", responseTime: 140 },
    { date: "2025-04-06", responseTime: 135 },
    { date: "2025-04-07", responseTime: 120 },
  ],

  graphql_data: [
    { date: "2025-04-01", responseTime: 95 },
    { date: "2025-04-02", responseTime: 100 },
    { date: "2025-04-03", responseTime: 90 },
    { date: "2025-04-04", responseTime: 105 },
    { date: "2025-04-05", responseTime: 110 },
    { date: "2025-04-06", responseTime: 105 },
    { date: "2025-04-07", responseTime: 98 },
  ],
};

const chartConfig = {
  rest: {
    label: "REST",
    color: "hsl(var(--chart-1))", // Use your preferred color
  },
  graphql: {
    label: "GraphQL",
    color: "hsl(var(--chart-2))", // Use your preferred color
  },
};

const Graph = () => {
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>REST vs. GraphQL</CardTitle>
          <CardDescription>Showing performance differences</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={placeholderData.rest_data}>
            <defs>
              <linearGradient id="fillREST" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillGraphQL" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="responseTime"
              type="natural"
              fill="url(#fillREST)"
              stroke="var(--color-desktop)" // Use color for REST
              stackId="a"
            />
            <Area
              dataKey="responseTime"
              type="natural"
              fill="url(#fillGraphQL)"
              stroke="var(--color-mobile)" // Use color for GraphQL
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Graph;
