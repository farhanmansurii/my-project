import Player from "@/components/Player";
import axios from "axios";
import { useEffect, useState } from "react";

export async function getServerSideProps(context) {
  const tvid = context.query.id;
  const detailsResponse = await fetch(
    `https://api.consumet.org/movies/flixhq/info?id=tv/${tvid}`
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
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episode, setEpisode] = useState();
  const [episodeobj, setEpisodeobj] = useState();
  const handleEpisodeClick = (epid) => {
    setSelectedEpisode(epid);
  };
  const episodesBySeason = deets.episodes.reduce((acc, episode) => {
    const season = episode.season;
    acc[season] = acc[season] || [];
    acc[season].push(episode);
    return acc;
  }, {});
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get(
          `https://api.consumet.org/movies/flixhq/watch?mediaId=tv/${id}&episodeId=${selectedEpisode}`
        );
        setEpisode(response.data);
        console.log(response.data);
      } catch (error) {
        setEpisode(null);
      }
    };

    if (selectedEpisode) {
      fetchEpisode();
    }
  }, [selectedEpisode]);
  return (
    <div>
      {episode && (
        <>
          {episodeobj && <div>{episodeobj.title}</div>}
          <Player episode={episode} />
        </>
      )}

      
      <div className="bg-gray-100 py-8">
      {Object.entries(episodesBySeason).map(([season, episodes]) => (
        <div key={season} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Season {season}</h2>
          <ul className="divide-y divide-gray-300">
            {episodes.map((episode) => (
              <li key={episode.id} onClick={() => {
                setEpisodeobj(episode), setSelectedEpisode(episode.id);
              }} className="py-4  hover:bg-neutral-400 hover:text-white">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="bg-gray-400 rounded-full py-2 px-3 text-white text-sm font-semibold">{episode.number}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-lg font-semibold">{episode.title}</div>
                
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    </div>
  );
}

export default MyPage;
