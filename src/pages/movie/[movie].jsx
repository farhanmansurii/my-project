import { Button } from "@/components/Button";
import MovieDetails from "@/components/MovieDetails";
import Navbar from "@/components/Navbar";
import Player from "@/components/Player";
import { Toggle } from "@/components/ui/toggle";
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

     

        <Toggle
          className="rounded"
        onClick={
          !ifExists
            ? () => dispatch(addFavoriteMovie({ movieid: id, deets }))
            : () => dispatch(deleteFavoriteMovie(id))
        }
      >
        {ifExists ? "Remove from Library" : "Add to Library"}

        </Toggle>
      </div>

      {episode ? (
        <div className="pb-[3rem]">
        <Player episode={episode}  deets={deets} />
         
        </div>
      ) : (

          <div className="w-full h-full lg:w-[720px] aspect-video  flex items-center justify-center  mx-auto">

          <Spinner />
        </div>
      )}
      <div className="w-11/12 text-2xl pb-[2rem] mx-auto">
        <p className="p-3">Recommendations</p>
        <div className="flex overflow-x-scroll p-2 space-x-4 scrollbar-hide  mx-auto ">
          {deets.recommendations?.map((e) => (
            <Link key={e.id} href={`/movie/${e.id}`}>
              <div className="flex-none w-32 lg:w-40">
                <div className="relative">
                  <img
                    className="object-cover w-full h-48 lg:h-56 rounded shadow-md transform transition-all duration-500"
                    src={e.image}
                    alt={e.title}
                  />
                  <div className="absolute flex flex-col-reverse inset-0 p-2 bg-gradient-to-t from-black w-full ">
                    <p className="text-xs text-white/40">{new Date(e.releaseDate).getFullYear()}</p>
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
      <div className="w-11/12 text-2xl pb-[10rem] mx-auto">
        {" "}
        <p className="p-3">Similar to {deets.title}</p>
        <div className="flex overflow-x-scroll p-2 space-x-4 scrollbar-hide  mx-auto ">
          {deets.similar?.filter((e) => e.rating > 4)
            .map((e) => (
            <Link key={e.id} href={`/movie/${e.id}`}>
              <div className="flex-none w-32 lg:w-40">
                <div className="relative">
                  <img
                      className="object-cover w-full h-48 lg:h-56 rounded shadow-md transform transition-all duration-500"
                    src={e.image}
                    alt={e.title}
                  />
                  <div className="absolute flex flex-col-reverse inset-0 p-2 bg-gradient-to-t from-black w-full ">
                      <p className="text-xs text-white/40">{new Date(e.releaseDate).getFullYear()}</p>

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
