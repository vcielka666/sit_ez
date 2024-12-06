const MoreDetailsComponent = ({ place, onBack }: { place: any; onBack: () => void }) => {
    return (
      <div className="flex flex-col items-center justify-center bg-purple-300 w-full h-full">
        <h1 className="text-2xl font-bold">More Details</h1>
        {place && (
          <div className="text-center">
            <h2 className="text-lg font-semibold">{place.name}</h2>
            <p>{place.description}</p>
            {place.pictureUrls?.length > 0 && (
              <div>
                {place.pictureUrls.map((url: string, index: number) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-32 h-32 object-cover m-2"
                  />
                ))}
              </div>
            )}
          </div>
        )}
        <button
          onClick={onBack}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    );
  };
  
  export default MoreDetailsComponent;
  