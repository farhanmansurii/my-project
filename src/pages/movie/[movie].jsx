import MovieDetails from "@/components/MovieDetails";
import Player from "@/components/Player";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
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
      <MovieDetails movie={deets} />
      {episode ? (
        <div className="pb-[3rem]">
          <Player episode={episode} />
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
                      <span className="text-red-500"> {e.type}</span> ???{" "}
                      {e.rating.toFixed(1)}???
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
