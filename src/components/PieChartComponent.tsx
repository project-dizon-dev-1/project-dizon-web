
import { TrendingDown, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {

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
// const chartData = [
//   { payment: "Paid", PaidResidentsCount: 275, fill: "var(--color-chrome)" },
//   { payment: "Unpaid", UnpaidResidentsCount: 200, fill: "var(--color-safari)" },

// ]

const chartConfig = {
  residents: {
    label: "Residents",
  },
  paid: {
    label: "Paid",
    color: "hsl(var(--chart-2))",
  },
  unpaid: {
    label: "Unpaid",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// const chartConfig = {
//   residents: {
//     label: "Residents",
//   },
//   paid: {
//     label: "Paid",
//     color: "hsl(var(--chart-1))",
//   },
//   unpaid: {
//     label: "Unpaid",
//     color: "hsl(var(--chart-2))",
//   },
// } satisfies ChartConfig

const PieChartComponent = ({
  totalResidents,
  paidResidentsCount,
  unpaidResidentsCount,
}: {
  totalResidents: number;
  paidResidentsCount: number;
  unpaidResidentsCount: number;
}) => {
  const chartData = [
    {
      payment: "paid",
      residents: paidResidentsCount,
      fill: "hsl(var(--chart-2))",
    },
    {
      payment: "unpaid",
      residents: unpaidResidentsCount,
      fill: "hsl(var(--chart-1))",
    },
  ];

  return (
    <div className="flex flex-col">
      <CardHeader className="items-center p-0">
        <CardTitle>Residents Payment Status</CardTitle>
        <CardDescription>
          {new Date().toLocaleString("en-US", { month: "long" })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="residents"
              nameKey="payment"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalResidents}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Residents
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm p-0">
        <div className="flex items-center gap-2 font-medium leading-none">
          {paidResidentsCount > unpaidResidentsCount
            ? "More paid residents than unpaid"
            : "More unpaid residents than paid"}
          { paidResidentsCount > unpaidResidentsCount ?<TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4"/>}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total paid and unpaid residents for this month.
        </div>
      </CardFooter>
    </div>
  );
};

export default PieChartComponent;
