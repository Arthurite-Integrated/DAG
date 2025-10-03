"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { useState } from "react"

interface AttendanceTrendChartProps {
  data: Array<{
    date: string
    status: string
  }>
}

export function AttendanceTrendChart({ data }: AttendanceTrendChartProps) {
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set())

  const chartData = data.reduce(
    (acc, record) => {
      const dateObj = new Date(record.date)
      const dateKey = dateObj.toISOString().split("T")[0] // Use ISO date for sorting
      const displayDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })

      if (!acc[dateKey]) {
        acc[dateKey] = { date: displayDate, dateKey, present: 0, absent: 0, late: 0 }
      }
      if (record.status === "present") acc[dateKey].present++
      if (record.status === "absent") acc[dateKey].absent++
      if (record.status === "late") acc[dateKey].late++
      return acc
    },
    {} as Record<string, { date: string; dateKey: string; present: number; absent: number; late: number }>,
  )

  const formattedData = Object.values(chartData)
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .map(({ dateKey, ...rest }) => rest)

  const toggleLine = (dataKey: string) => {
    setHiddenLines((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey)
      } else {
        newSet.add(dataKey)
      }
      return newSet
    })
  }

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle>Attendance Trend</CardTitle>
        <CardDescription>Last 7 days attendance overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => toggleLine("present")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              hiddenLines.has("present")
                ? "bg-muted text-muted-foreground opacity-50 hover:opacity-70"
                : "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20 ring-1 ring-green-500/20"
            }`}
          >
            <div
              className={`h-3 w-3 rounded-full ${hiddenLines.has("present") ? "bg-muted-foreground" : "bg-green-500"}`}
            />
            Present
          </button>
          <button
            onClick={() => toggleLine("late")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              hiddenLines.has("late")
                ? "bg-muted text-muted-foreground opacity-50 hover:opacity-70"
                : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20 ring-1 ring-yellow-500/20"
            }`}
          >
            <div
              className={`h-3 w-3 rounded-full ${hiddenLines.has("late") ? "bg-muted-foreground" : "bg-yellow-500"}`}
            />
            Late
          </button>
          <button
            onClick={() => toggleLine("absent")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              hiddenLines.has("absent")
                ? "bg-muted text-muted-foreground opacity-50 hover:opacity-70"
                : "bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20 ring-1 ring-red-500/20"
            }`}
          >
            <div
              className={`h-3 w-3 rounded-full ${hiddenLines.has("absent") ? "bg-muted-foreground" : "bg-red-500"}`}
            />
            Absent
          </button>
        </div>

        <ChartContainer
          config={{
            present: {
              label: "Present",
              color: "hsl(142 76% 36%)",
            },
            late: {
              label: "Late",
              color: "hsl(48 96% 53%)",
            },
            absent: {
              label: "Absent",
              color: "hsl(0 84% 60%)",
            },
          }}
          className="h-[320px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(48 96% 53%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(48 96% 53%)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0 84% 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0 84% 60%)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1, strokeDasharray: "5 5" }}
              />
              {!hiddenLines.has("present") && (
                <Area
                  type="monotone"
                  dataKey="present"
                  stroke="hsl(142 76% 36%)"
                  fill="url(#colorPresent)"
                  strokeWidth={2.5}
                  animationDuration={1000}
                  dot={{ fill: "hsl(142 76% 36%)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              )}
              {!hiddenLines.has("late") && (
                <Area
                  type="monotone"
                  dataKey="late"
                  stroke="hsl(48 96% 53%)"
                  fill="url(#colorLate)"
                  strokeWidth={2.5}
                  animationDuration={1000}
                  dot={{ fill: "hsl(48 96% 53%)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              )}
              {!hiddenLines.has("absent") && (
                <Area
                  type="monotone"
                  dataKey="absent"
                  stroke="hsl(0 84% 60%)"
                  fill="url(#colorAbsent)"
                  strokeWidth={2.5}
                  animationDuration={1000}
                  dot={{ fill: "hsl(0 84% 60%)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
