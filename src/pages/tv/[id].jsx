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
  const [expandedSeasons, setExpandedSeasons] = useState([]);

  const handleEpisodeClick = (epid) => {
    setSelectedEpisode(epid);
  };

  const handleSeasonClick = (season) => {
    setExpandedSeasons((prevState) => {
      if (prevState.includes(season)) {
        return prevState.filter((prevSeason) => prevSeason !== season);
      } else {
        return [...prevState, season];
      }
    });
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
          <Player episode={episode} />
          {episodeobj && <div className="text-white w-10/12 my-5 text-3xl">{episodeobj.title}</div>}
        </>
      )}

      <div className="bg-gray-100 py-8">
        {Object.entries(episodesBySeason).map(([season, episodes]) => (
          <div key={season} className="mb-8">
            <div
              onClick={() => handleSeasonClick(season)}
              className="flex lg:w-10/12 mx-auto items-center gap-10 cursor-pointer"
            >
              <h2 className="text-2xl font-bold mb-4">Season {season}</h2>
              <span className="border-black p-2 rounded-full border-2 h-full mb-3">
                {expandedSeasons.includes(season) ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
                  : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                }
              </span>
            </div>
            {expandedSeasons.includes(season) && (
              <ul className="divide-y divide-gray-300">
                {episodes.map((episode) => (
                  <li
                    key={episode.id}
                    onClick={() => {
                      setEpisode(''), setEpisodeobj(episode), setSelectedEpisode(episode.id);
                    }}
                    className="py-4 hover:bg-neutral-400 lg:w-10/12 mx-auto hover:text-white cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="border-2 rounded-full border-black py-2 px-3 text-black text-sm font-semibold">
                          {episode.number}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-lg font-semibold">
                          {episode.title}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPage;
