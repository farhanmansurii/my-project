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
    writers, actors, logos
  } = movie;

  return (
    <div
    style={{ backgroundImage: `url(${image})` }}
    className="bg-cover bg-center  backdrop-blur-sm   bg-hidden lg:block lg:mx-auto"
  >  <div className="bg-gradient-to-t from-black   to-black/20 lg:to-black/70  lg: w-100">
  <div className="w-11/12 justify-around pt-[15rem] lg:pt-24 lg:w-10/12 mx-auto items-center flex flex-col lg:flex-row">

  <div className="hidden  lg:block ">
          <img src={image} className="w-[200px] rounded-xl " />
        </div>
    <div className="px-4 z-30  w-full  lg:py-12 pt-3 md:py-16">
      <h1 className="text-3xl flex md:text-4xl lg:text-4xl  text-white mb-2">
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
          <div className="mb-2 text-xs line-clamp-4">{description}</div>
        )}
        <div className="flex flex-wrap gap-2 mb-3 mt-4">
          {duration && (
           <div className="bg-gray-600/20 rounded-full px-3 py-1 text-sm mr-2 mb-2">
           {Math.floor(duration / 60)} hr {duration % 60} min
         </div>
          )}
          {directors && (
            <div className="bg-gray-600/20 rounded-full px-3 py-1 text-sm mr-2 mb-2">
              Directed by: {directors.join(", ")}
            </div>
          )}



            </div>
            {actors && (
              <div className="flex flex-wrap items-center my-1">
                <span className="bg-gray-600/20 border-gray-900 whitespace-nowrap rounded-full px-3 py-1 text-sm mr-2 mb-2">
                  Cast
                </span>
                {actors.slice(0, 3).map((actors) => (
                  <span key={actors} className="bg-gray-600/20 whitespace-nowrap rounded-full px-3 py-1 text-sm mr-2 mb-2">
                    {actors}
                  </span>
                ))}
              </div>
            )}
      </div>
    </div></div>
    </div>
  );
}

export default MovieDetails;
