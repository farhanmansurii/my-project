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
  const movies = useSelector((state) => state.recentlyWatched.movies);

  useEffect(() => {
    const storedState = localStorage.getItem("recentlyWatched");

    if (storedState)
    {
      const parsedState = JSON.parse(storedState);

      dispatch(updateFavoriteMovies(parsedState.movies));
    }
  }, []);
  function checkIfExists(movies, id) {
    for (let i = 0; i < movies.length; i++)
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
      <Navbar />
      <MovieDetails movie={deets} />
      {
        !ifExists ?
          <button className="flex gap-3 w-fit mx-auto p-3 px-5 bg-white rounded-xl text-black  items-center" onClick={() => dispatch(addFavoriteMovie({ movieid: id, deets }))}>
            Add to Library
            <svg fill="none" viewBox="0 0 24 24" height="1.3em" width="1.3em" >
              <path
                fill="currentColor"
                d="M2 5h12v2H2V5zM2 9h12v2H2V9zM10 13H2v2h8v-2z"
              />
              <path fill="currentColor" d="M16 9h2v4h4v2h-4v4h-2v-4h-4v-2h4V9z" />
            </svg>
          </button> : <button className="flex gap-3 w-fit mx-auto p-3 px-5 bg-black border-white border-2 rounded-xl text-white  items-center" onClick={() => dispatch(deleteFavoriteMovie(id))}>
            Remove from Library
            <svg fill="none" viewBox="0 0 24 24" height="1.3em" width="1.3em" >
              <path
                fill="currentColor"
                d="M15.964 4.634h-12v2h12v-2zM15.964 8.634h-12v2h12v-2zM3.964 12.634h8v2h-8v-2zM12.964 13.71l1.415-1.415 2.121 2.121 2.121-2.12 1.415 1.413-2.122 2.122 2.122 2.12-1.415 1.415-2.121-2.121-2.121 2.121-1.415-1.414 2.122-2.122-2.122-2.12z"
              />
            </svg>
          </button>
      }
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
