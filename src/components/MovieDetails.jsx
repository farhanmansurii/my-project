import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "./Button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";

function MovieDetails({ movie }) {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }
  const {
    title,
    backdrop_path,
    poster_path,
    vote_average,
    tagline,
    overview,
    release_date,
    genres,
    runtime,
  } = movie;

  return (
    <div
      style={{
        backgroundImage: `url(${`https://image.tmdb.org/t/p/w300${poster_path}`})`,
      }}
      className="bg-cover bg-center  backdrop-blur-sm   bg-hidden lg:block lg:mx-auto"
    >
      {" "}
      <div className="bg-gradient-to-t from-black   to-black/20 lg:to-black/70  lg: w-100">
        <div className="w-full justify-around pt-[15rem] lg:pt-24 lg:w-10/12 mx-auto items-center flex flex-col lg:flex-row">
          <div className="hidden  lg:block ">
            <img
              src={`https://image.tmdb.org/t/p/w300${poster_path}`}
              className="w-[200px] rounded-xl "
            />
          </div>
          <div className="px-4 z-30  w-full  lg:py-12 pt-3 md:py-16">
            <h1 className="text-3xl items-center gap-2 flex md:text-4xl lg:text-4xl  text-white ">
              {title}
              {vote_average && (
                <Button
                  variant="chip"
                  size="sm"
                  className="bg-yellow-500 text-black"
                >
                  <span className="text-sm flex  items-center gap-2">
                    {vote_average.toFixed(1)}
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      height="2em"
                      width="2em"
                    >
                      <path d="M13.646 10.237c-.057-.032-.16-.048-.313-.048v3.542c.201 0 .324-.041.371-.122s.07-.301.07-.66v-2.092c0-.244-.008-.4-.023-.469a.223.223 0 00-.105-.151zm3.499 1.182c-.082 0-.137.031-.162.091-.025.061-.037.214-.037.46v1.426c0 .237.014.389.041.456.029.066.086.1.168.1.086 0 .199-.035.225-.103.027-.069.039-.234.039-.495V11.97c0-.228-.014-.377-.043-.447-.032-.069-.147-.104-.231-.104z" />
                      <path d="M20 3H4a1 1 0 00-1 1v16a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1zM6.631 14.663H5.229V9.266h1.402v5.397zm4.822 0H10.23l-.006-3.643-.49 3.643h-.875L8.342 11.1l-.004 3.563H7.111V9.266H8.93c.051.327.107.71.166 1.15l.201 1.371.324-2.521h1.832v5.397zm3.664-1.601c0 .484-.027.808-.072.97a.728.728 0 01-.238.383.996.996 0 01-.422.193c-.166.037-.418.055-.754.055h-1.699V9.266h1.047c.678 0 1.07.031 1.309.093.24.062.422.164.545.306.125.142.203.3.234.475.031.174.051.516.051 1.026v1.896zm3.654.362c0 .324-.023.565-.066.723a.757.757 0 01-.309.413.947.947 0 01-.572.174c-.158 0-.365-.035-.502-.104a1.144 1.144 0 01-.377-.312l-.088.344h-1.262V9.266h1.35v1.755a1.09 1.09 0 01.375-.289c.137-.064.344-.096.504-.096.186 0 .348.029.484.087a.716.716 0 01.44.549c.016.1.023.313.023.638v1.514z" />
                    </svg>
                  </span>
                </Button>
              )}
            </h1>
            {tagline && (
              <p className="text-sm italic opacity-50 my-2">{tagline}</p>
            )}

            {genres && (
              <div className="flex gap-2 items-center my-2">
                {genres.map((genre) => (
                  <Button variant="chip" size="sm" key={genre}>
                    {genre.name}
                  </Button>
                ))}
              </div>
            )}
            <Collapsible>
              <CollapsibleTrigger>
                <Button variant="chip" size="sm">
                  Overview <CaretSortIcon className=" ml-3 h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="bg-primary/20 mt-2 text-sm rounded-xl p-3">
                  {overview}
                </div>
              </CollapsibleContent>
            </Collapsible>
            <div className="flex flex-wrap gap-2 mb-2 mt-2">
              {runtime && (
                <Button variant="chip" size="sm">
                  {Math.floor(runtime / 60)} hr {runtime % 60} min
                </Button>
              )}
              {release_date && (
                <Button variant="chip" size="sm">
                  {formatDate(release_date)}
                </Button>
              )}

              {/* {directors && (
                <Button variant='chip' size='sm'>

                  Directed by: {directors.join(", ")}
                </Button>
              )} */}
            </div>
            {/* {actors && (
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
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
