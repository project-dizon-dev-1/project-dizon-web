import PieChartComponent from "@/components/PieChartComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHousesSummary } from "@/services/houseServices";
import { useQuery } from "@tanstack/react-query";

const FinanceDashboard = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["houseSummary"],
    queryFn: getHousesSummary,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className=" w-full h-full overflow-y-auto no-scrollbar">
      <h1 className="font-bold text-3xl mb-5">Finance Dashboard</h1>

      <div className="flex flex-wrap justify-start gap-5 w-full">
        {data &&
          data.length > 0 &&
          data.map((phase) => {
            // Calculate the paid dues percentage dynamically
            // const paidDuesPercentage = (
            //   (phase.totalPaidAmount / phase.totalExpectedAmount) * 100
            // ).toFixed(2);

            return (
              <Card key={phase.phase}>
                <CardHeader>
                  <CardTitle>{phase.phase}</CardTitle>
                  <PieChartComponent
                    paidResidentsCount={phase.paidResidentsCount}
                    unpaidResidentsCount={phase.unpaidResidentsCount}
                    totalResidents={phase.totalResidents}
                  />
                </CardHeader>
                <CardContent>
                  <div>
                    {/* <div className="flex justify-between">
                      <p>Residents</p>
                      <p>{phase.totalResidents}</p>
                    </div> */}
                    {/* <div className="flex justify-between">
                      <p>Paid Dues</p>
                      <p>{phase.paidResidentsCount}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Unpaid Dues</p>
                      <p>{phase.unpaidResidentsCount}</p>
                    </div> */}
                    <div className="flex justify-between">
                      <p>Due Amount</p>
                      <p>
                        {phase.dueAmountPerResident.toLocaleString("en-PH")} ₱
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p>Total Paid Dues</p>
                      <p>{phase.totalPaidAmount.toLocaleString("en-PH")} ₱</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Total Unpaid Dues</p>
                      <p>{phase.totalUnpaidAmount.toLocaleString("en-PH")} ₱</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Expected Amount</p>
                      <p>
                        {phase.totalExpectedAmount.toLocaleString("en-PH")} ₱
                      </p>
                    </div>
                  </div>
                </CardContent>
                {/* <CardFooter>
                  <div>
                    <p>Paid Dues: {paidDuesPercentage}%</p>
                  </div>
                </CardFooter> */}
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default FinanceDashboard;
