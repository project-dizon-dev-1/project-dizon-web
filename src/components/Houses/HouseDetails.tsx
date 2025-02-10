const HouseDetails = ({
  address,
  phase,
  mainContact,
  latestPayment,
}: {
  address: string;
  phase: string;
  mainContact: string;
  latestPayment: string | null;
}) => {
  return (
    <div className=" flex justify-between">
      <div className=" flex flex-col gap-3">
        <p>Address:</p>
        <p>Phase:</p>
        <p>Main Contact:</p>
        <p>Latest Payment:</p>
      </div>
      <div className=" flex flex-col gap-3">
        <p>{address}</p>
        <p>{phase}</p>
        <p>{mainContact}</p>
        <p>{latestPayment}</p>
      </div>
    </div>
  );
};

export default HouseDetails;
