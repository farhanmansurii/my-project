function MovieDetails({ movie }) {
  const {
    title,
    image,
    rating,
    description,
    releaseDate,
    genres,
    duration,
    directors,
    writers,
  } = movie;

  return (
    <div className="md:flex text-white rounded-md overflow-hidden lg:w-10/12 mx-auto">
      {image && (
        <img
          src={image}
          alt={title}
          className="h-[300px] mt-4 lg:my-auto mx-auto lg:mx-6 rounded-md shadow-xl"
        />
      )}
      <div className="px-4 lg:py-12 py-6 md:py-16">
        <h1 className="text-3xl flex md:text-4xl lg:text-5xl font-semibold  text-white mb-4">
          {title}
        </h1>
        <div className="flex items-center mb-4">
          {rating && (
            <div className="flex items-center mr-4">
              <span className="text-lg  mr-1">{rating.toFixed(1)}</span>
              <span className="text-sm">⭐</span>
            </div>
          )}
          {releaseDate && (
            <div className="text-sm opacity-60">{releaseDate}</div>
          )}
        </div>
        {genres && (
          <div className="flex items-center mb-4">
            <div className="px-2 py-1 text-sm  rounded-md mr-2">
              {genres[0]}
            </div>
            {genres.slice(1, 3).map((genre, index) => (
              <div key={index} className="px-2 py-1 text-sm  rounded-md mr-2">
                {genre}
              </div>
            ))}
          </div>
        )}
        {description && <div className="mb-4 text-sm">{description}</div>}
        <div className="flex flex-wrap gap-2 my-4">
          {duration && (
            <div className=" text-white px-2 py-1 text-sm rounded-md mr-2">
              {duration} min
            </div>
          )}
          {directors && (
            <div className=" text-white px-2 py-1 text-sm rounded-md mr-2">
              Directed by: {directors.join(", ")}
            </div>
          )}
          {writers && (
            <div className=" text-white px-2 py-1 text-sm rounded-md mr-2">
              Written by: {writers.join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
