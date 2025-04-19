"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export type PerformanceDataPoint = {
  timestamp: number
  REST: number | null
  GraphQL: number | null
}

export function ChartAreaInteractive({ data }: { data: PerformanceDataPoint[] }) {
  const isMobile = useIsMobile()

  const formattedData = React.useMemo(() => {
    const now = Date.now();
    // Visa data från senaste timmen
    const cutoff = now - (60 * 60 * 1000);

    return data
      .filter(item => item.timestamp >= cutoff)
      .map(item => ({
        label: new Date(item.timestamp).toLocaleTimeString(),
        timestamp: item.timestamp,
        REST: item.REST,
        GraphQL: item.GraphQL
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  const averageTimes = React.useMemo(() => {
    const restTimes = formattedData.map(d => d.REST).filter(Boolean) as number[]
    const graphqlTimes = formattedData.map(d => d.GraphQL).filter(Boolean) as number[]

    return {
      REST: restTimes.length ? Math.round(restTimes.reduce((a, b) => a + b, 0) / restTimes.length) : 0,
      GraphQL: graphqlTimes.length ? Math.round(graphqlTimes.reduce((a, b) => a + b, 0) / graphqlTimes.length) : 0
    }
  }, [formattedData])

  return (
    <Card className="@container/card mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>API Performance</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Real-time response times comparison
              </span>
            </CardDescription>
          </div>
          <div className="flex gap-4">
            <div className="text-sm text-blue-500">
              REST Avg: {averageTimes.REST}ms
            </div>
            <div className="text-sm text-pink-500">
              GraphQL Avg: {averageTimes.GraphQL}ms
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="aspect-video w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="colorRest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorGraphql" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                tickMargin={8}
                minTickGap={20}
              />
              <YAxis
                domain={[0, 'dataMax + 100']}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background p-4 border rounded-lg shadow-lg">
                        <p className="font-medium">{label}</p>
                        {payload.map((entry, index) => (
                          <div key={`tooltip-${index}`} className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="mr-2">{entry.name}:</span>
                            <span className="font-medium">{entry.value}ms</span>
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="REST"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorRest)"
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="GraphQL"
                stroke="#ec4899"
                fillOpacity={1}
                fill="url(#colorGraphql)"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}