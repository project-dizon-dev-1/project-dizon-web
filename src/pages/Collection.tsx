import ConfigureCollectionForm from "@/components/Collection/ConfigureCollectionForm";
import PieChartComponent from "@/components/PieChartComponent";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getHousesSummary } from "@/services/houseServices";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const Collection = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["houseSummary"],
    queryFn: getHousesSummary,
  });
  const navigate = useNavigate();

  const handleCardClick = (phase: string) => {
    navigate(`/collection/${phase}`, { replace: true });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  return (
    <div className="  w-full h-full overflow-y-auto no-scrollbar">
      {/* Grid layout for cards */}
      <ConfigureCollectionForm />
      <div className=" grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {data &&
          data.length > 0 &&
          data.map((phase) => (
            <Card
              onClick={() => handleCardClick(phase.phase)}
              className="hover:cursor-pointer"
              key={phase.phase}
            >
              <CardHeader>
                <CardTitle>Phase {phase.phase}</CardTitle>
                <PieChartComponent
                  paidResidentsCount={phase.paidResidentsCount}
                  unpaidResidentsCount={phase.unpaidResidentsCount}
                  totalResidents={phase.totalResidents}
                />
              </CardHeader>
              <CardContent>
                <div>
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
                    <p>{phase.totalExpectedAmount.toLocaleString("en-PH")} ₱</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Collection;
