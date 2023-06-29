import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "./Button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";

function MovieDetails({ movie }) {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }
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
            <h1 className="text-3xl items-center gap-2 flex md:text-4xl lg:text-4xl  text-white mb-2">
              {title}
              {rating && (
                <Button variant='chip' size='sm' className='bg-yellow-500 text-black'>
                  <span className="text-sm flex  items-center gap-2">{rating.toFixed(1)}  <svg
                    viewBox="0 0 1024 1024"
                    fill="currentColor"
                    height="1em"
                    width="1em"
                  >
                    <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 00.6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0046.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z" />
                  </svg></span>


                </Button>
              )}
            </h1>


            {genres && (
              <div className="flex gap-2 items-center my-2">
                {genres.map((genre) => (
                  <Button variant='chip' size='sm' key={genre}>

                    {genre}
                  </Button>
                ))}
              </div>
            )}
            <Collapsible>
              <CollapsibleTrigger>
                <Button variant='chip' size='sm'>

                  Description  <CaretSortIcon className=" ml-3 h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="bg-primary/20 mt-2 text-sm rounded-xl p-3">

                  {description}
                </div>
              </CollapsibleContent>
            </Collapsible>
            <div className="flex flex-wrap gap-2 mb-2 mt-2">
              {duration && (
                <Button variant='chip' size='sm' >

                  {Math.floor(duration / 60)} hr {duration % 60} min
                </Button>
              )}
              {releaseDate && (
                <Button variant='chip' size='sm' >

                  {formatDate(releaseDate)}
                </Button>
              )}

              {directors && (
                <Button variant='chip' size='sm'>

                  Directed by: {directors.join(", ")}
                </Button>
              )}



            </div>
            {actors && (
              <div className="flex flex-wrap gap-2 items-center my-1">
                <Button size='sm' variant='chip' >

                  Cast
                </Button>
                {actors.slice(0, 3).map((actor) => (
                  <Button key={actor} variant='chip' size='sm'>
                    {actor}
                  </Button>

                ))}
              </div>
            )}
          </div>
        </div></div>
    </div>
  );
}

export default MovieDetails;
