import MovieDetails from "@/components/MovieDetails";
import Navbar from "@/components/Navbar";
import Player from "@/components/Player";
import { addFavoriteMovie, deleteFavoriteMovie, updateFavoriteMovies } from "@/redux/reducers/recentlyWatchedReducers";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-spinner-material";

export async function getServerSideProps(context) {
  const tvid = context.query.movie;
  const detailsResponse = await fetch(
    `https://spicyapi.vercel.app/meta/tmdb/info/${tvid}?type=MOVIE`
  );
  const details = await detailsResponse.json();
  return {
    props: {
      deets: details,
      id: tvid,
    },
  };
}

function MyPage({ id, deets }) {
  const [episode, setEpisode] = useState();
  console.log(deets);
  const dispatch = useDispatch()
  const movies = useSelector((state) => state.recentlyWatched.favoriteMovies);

  useEffect(() => {
    const storedState = localStorage.getItem("favoriteMovies");

    if (storedState)
    {
      const parsedState = JSON.parse(storedState);

      dispatch(updateFavoriteMovies(parsedState.movies));
    }
  }, []);
  function checkIfExists(movies, id) {
    for (let i = 0; i < movies?.length; i++)
    {
      if (movies[i].movieid === id)
      {
        return true;
      }
    }
    return false;
  }

  const ifExists = checkIfExists(movies, id);
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get(
          `https://spicyapi.vercel.app/meta/tmdb/watch/${deets.episodeId}?id=${deets.id}`
        );
        setEpisode(response.data);
        console.log(response.data);
      } catch (error) {
        setEpisode("");
        console.log(error.message);
      }
    };

    fetchEpisode();
  }, [deets]);
  return (
    <div className="min-h-screen ">

      <Navbar/>
      <MovieDetails movie={deets} />
      <div className="w-full flex justify-center">

     

      <button
        className={
          !ifExists
              ? "flex text-sm  max-w-full w-fit  flex-row items-center bg-white/5 gap-3 rounded-full py-2 border-4 border-white/20 px-6 my-4"
              : "flex text-sm  max-w-full w-fit  flex-row items-center bg-white gap-3 text-black rounded-full py-2 border-4 border-black/50 px-6 my-4"
        }
        onClick={
          !ifExists
            ? () => dispatch(addFavoriteMovie({ movieid: id, deets }))
            : () => dispatch(deleteFavoriteMovie(id))
        }
      >
        {ifExists ? "Remove from Library" : "Add to Library"}
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {!ifExists ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          ) : (
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
          )}
        </svg>
      </button>
      </div>

      {episode ? (
        <div className="pb-[3rem]">
        <Player episode={episode}  deets={deets} />
         
        </div>
      ) : (
        <div className="flex w-full justify-center text-center text-2xl my-10 text-white">
          <Spinner />
        </div>
      )}
      <div className="w-11/12 text-2xl pb-[10rem] mx-auto">
        {" "}
        Recommendations
        <div className="flex overflow-x-scroll p-2 space-x-4 scrollbar-hide  mx-auto ">
          {deets.recommendations?.map((e) => (
            <Link key={e.id} href={`/movie/${e.id}`}>
              <div className="flex-none w-32 lg:w-40">
                <div className="relative">
                  <img
                    className="object-cover w-full h-48 lg:h-56 rounded-lg shadow-md transform transition-all duration-500"
                    src={e.image}
                    alt={e.title}
                  />
                  <div className="absolute flex flex-col-reverse inset-0 p-2 bg-gradient-to-t from-black w-full ">
                    <p className="text-xs text-white/40">{e.releaseDate}</p>
                    <p className="text-xs text-white/40">
                      <span className="text-red-500"> {e.type}</span> •{" "}
                      {e.rating.toFixed(1)}⭐
                    </p>
                    <h3 className="text-white  text-sm lg:text-lg  ">
                      {e.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
