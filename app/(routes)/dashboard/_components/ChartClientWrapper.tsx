"use client";

import { useState, useMemo } from "react";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { Calendar as CalendarIcon, Filter, Circle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

export default function ChartClientWrapper({
  initialData,
}: {
  initialData:
    | { day: string; count: number; priority: string; date: Date }[]
    | undefined;
}) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Fixed filtering logic to include Date Range
  const filteredData = useMemo(() => {
    return initialData?.filter((item) => {
      const matchesPriority =
        priorityFilter === "all" || item.priority === priorityFilter;

      let matchesDate = true;
      if (date?.from && date?.to) {
        matchesDate = isWithinInterval(new Date(item.date), {
          start: startOfDay(date.from),
          end: endOfDay(date.to),
        });
      }

      return matchesPriority && matchesDate;
    });
  }, [initialData, priorityFilter, date]);

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
        <div className="flex items-center justify-start gap-2 flex-wrap">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="!w-full md:!w-[200px] clay-button border-none !h-10 font-bold">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="!clay-card !rounded-md border-none">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="high">High Only</SelectItem>
              <SelectItem value="medium">Medium Only</SelectItem>
              <SelectItem value="low">Low Only</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full md:w-[200px] justify-center items-center font-bold clay-button border-none h-10",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd")} -{" "}
                      {format(date.to, "LLL dd")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-none clay-card shadow-2xl"
              align="end"
            >
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Legend Section */}
        <div className="flex items-center mt-4 md:mt-0 gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <div className="flex items-center gap-1">
            <Circle className="fill-[#f43f5e] text-[#f43f5e] size-2" /> High
          </div>
          <div className="flex items-center gap-1">
            <Circle className="fill-[#eab308] text-[#eab308] size-2" /> Medium
          </div>
          <div className="flex items-center gap-1">
            <Circle className="fill-[#10b981] text-[#10b981] size-2" /> Low
          </div>
        </div>
      </div>

      <div className="h-[350px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              opacity={0.1}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fontWeight: 700,
                fill: "currentColor",
                opacity: 0.5,
              }}
            />
            <Tooltip
              cursor={{ fill: "var(--primary)", opacity: 0.05 }}
              contentStyle={{
                borderRadius: "16px",
                border: "none",
                boxShadow: "var(--clay-shadow)",
                background: "hsl(var(--card))",
              }}
            />
            <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={30}>
              {filteredData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.priority === "high"
                      ? "#f43f5e"
                      : entry.priority === "medium"
                        ? "#eab308"
                        : "#10b981"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
