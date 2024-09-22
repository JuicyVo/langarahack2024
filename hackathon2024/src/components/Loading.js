export const Loading = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-4 bg-gradient-to-tr animate-spin from-primary to-secondary via-primary-light rounded-full">
        <div className="bg-secondary rounded-full">
          <div className="w-24 h-24 rounded-full"></div>
        </div>
      </div>
      <p className="text-gray-500 text-lg" >Loading...</p>
    </div>
  );
};
