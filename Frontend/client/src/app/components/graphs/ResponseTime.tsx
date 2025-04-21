"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { number } from "zod";
const chartData = [
  { time: "10ms", rest: 186, graphQL: 80 },
  { time: "10ms", rest: 305, graphQL: 200 },
  { time: "10ms", rest: 237, graphQL: 120 },
  { time: "10ms", rest: 73, graphQL: 190 },
  { time: "10ms", rest: 209, graphQL: 130 },
  { time: "10ms", rest: 214, graphQL: 140 },
];

const chartConfig = {
  rest: {
    label: "REST",
    color: "#3498db",
  },
  graphQL: {
    label: "graphQL",
    color: "#e535ab",
  },
} satisfies ChartConfig;

interface Props {
  rest_avg: number;
  number_of_req: number;
}

export function ResponseTime({ rest_avg, number_of_req }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="graphQL"
              type="natural"
              fill="var(--color-graphQL)"
              fillOpacity={0.4}
              stroke="var(--color-graphQL)"
              stackId="a"
            />
            <Area
              dataKey="rest"
              type="natural"
              fill="var(--color-rest)"
              fillOpacity={0.4}
              stroke="var(--color-rest)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              placeholder <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Avg time
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
