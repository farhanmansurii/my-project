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
          className="h-[300px] lg:my-auto mx-auto lg:mx-6 rounded-md shadow-xl"
        />
      )}
      <div className="px-4 lg:py-12 pt-3 md:py-16">
      <h1 className="text-2xl flex md:text-3xl lg:text-4xl  text-white mb-4">
          {title}
        </h1>
        <div className="flex items-center mb-4">
          {rating && (
            <div className="flex items-center mr-4">
              <span className="text-sm  mr-1">{rating.toFixed(1)}</span>
              <span className="text-xs">⭐</span>
            </div>
          )}
          {releaseDate && (
            <div className="text-sm opacity-60">{releaseDate}</div>
          )}
        </div>
        {genres && (
          <div className="flex items-center my-2">
           {genres.map((genre) => (
            <span key={genre} className="bg-gray-600/20 rounded-full px-3 py-1 text-sm mr-2 mb-2">
              {genre}
            </span>
          ))}
          </div>
        )}
        {description && (
          <div className="mb-4 text-sm line-clamp-4">{description}</div>
        )}
        <div className="flex flex-wrap gap-2 mb-3 mt-4">
          {duration && (
            <div className="bg-gray-600/20 rounded-full px-3 py-1 text-sm mr-2 mb-2">
              {duration} min
            </div>
          )}
          {directors && (
            <div className="bg-gray-600/20 rounded-full px-3 py-1 text-sm mr-2 mb-2">
              Directed by: {directors.join(", ")}
            </div>
          )}
          {writers && (
            <div className="bg-gray-600/20 rounded-full px-3 py-1 text-sm mr-2 mb-2">
              Written by: {writers.join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
