import MovieDetails from "@/components/MovieDetails";
import Player from "@/components/Player";
import axios from "axios";
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
        <div className="pb-[10rem]">
          <Player episode={episode} />
        </div>
      ) : (
        <div className="flex w-full justify-center text-center text-2xl my-10 text-white">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default MyPage;
