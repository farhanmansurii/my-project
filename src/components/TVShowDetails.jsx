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
    <div
      style={{ backgroundImage: `url(${image})` }}
      className="bg-cover bg-center backdrop-blur-sm bg-hidden lg:block lg:mx-auto"
    >
      <div className="bg-gradient-to-t from-black to-black/20 lg:to-black/20 ">
       <div className="w-11/12 justify-around pt-[15rem] lg:pt-24 lg:w-10/12 mx-auto items-center flex flex-col lg:flex-row">

  <div className="hidden  lg:block ">
          <img src={image} className="w-[200px] rounded-xl " />
        </div>
    <div className="px-4 z-30  w-full  lg:py-12 pt-3 md:py-16">
          <h1 className="text-3xl flex md:text-4xl lg:text-5xl text-white mb-2">
            {title}
          </h1>
          <div className="flex items-center">
            {rating && (
              <div className="flex items-center mr-4">
                <span className="text-lg mr-1">{rating.toFixed(1)}</span>
                <span className="text-sm">⭐</span>
              </div>
            )}
            {releaseDate && (
              <div className="text-sm opacity-60">{releaseDate}</div>
            )}
          </div>
          <div className="flex items-center">
            {genres && (
              <div className="flex flex-wrap mt-2">
                {genres.map((genre) => (
                  <span
                    key={genre}
                    className="bg-gray-600/20 rounded-full px-3 py-1 text-sm mr-2 mb-2"
                  >
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
        </div></div>
      </div>
    </div>
  );
}

export default TvShowDetails;
