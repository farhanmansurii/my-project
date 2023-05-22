function TvShowDetails({ show }) {
  const {
    title,
    image,
    rating,
    description,
    releaseDate,
    genres,
    duration,
    totalEpisodes,
    totalSeasons,
    nextAiringEpisode,
  } = show;

  return (
    <div className="md:flex text-white rounded-md overflow-hidden lg:w-10/12 mx-auto">
      {image && (
        <img
          src={image}
          alt={title}
          className="h-[300px] lg:my-auto mx-auto lg:mx-6 rounded-md shadow-xl"
        />
      )}
      <div className="px-4 lg:py-6 ">
      <h1 className="text-2xl flex md:text-3xl lg:text-4xl  text-white mb-4">
          {title}
        </h1>
        <div className="flex items-center">
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
        <div className="flex items-center ">
        {genres && (
          <div className="flex flex-wrap mt-2">
          {genres.map((genre) => (
            <span key={genre} className="bg-gray-600/20 rounded-full px-3 py-1 text-sm mr-2 mb-2">
              {genre}
            </span>
          ))}
        </div>
        )}
        </div>
        {description && <div className="mb-4 text-sm">{description}</div>}
        <div className="flex flex-wrap gap-2 mt-4">
          {duration && (
            <div className="bg-gray-600/20 rounded-full px-3 py-1 text-sm mr-2 mb-2">
              {duration} min
            </div>
          )}
          {totalEpisodes && (
            <div className="bg-gray-600/20 rounded-full px-3 py-1 text-sm mr-2 mb-2">
              {totalEpisodes} episodes
            </div>
          )}
          {totalSeasons && (
            <div className="bg-gray-600/20 rounded-full px-3 py-1 text-sm mr-2 mb-2">
              {totalSeasons} seasons
            </div>
          )}
        </div>
        <div className="text-sm">
          {nextAiringEpisode
            ? `Next episode: ${nextAiringEpisode.title} (S${nextAiringEpisode.season}E${nextAiringEpisode.episode}) on ${nextAiringEpisode.releaseDate}`
            : ""}
        </div>
      </div>
    </div>
  );
}

export default TvShowDetails;
