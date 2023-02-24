import Player from "@/components/Player";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "react-spinner-material";
import { useDispatch } from 'react-redux';
 import recentlyWatchedReducer, { addRecentlyWatched } from "@/redux/reducers/recentlyWatchedReducers";
export async function getServerSideProps(context) {
  const tvid = context.query.id;
  const detailsResponse = await fetch(
    `https://spicyapi.vercel.app/meta/tmdb/info/${tvid}?type=TV%20Series`
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

  const dispatch = useDispatch();
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loader, setLoader] = useState();
  const [expandedSeason, setExpandedSeason] = useState(null);
  const [episode, setEpisode] = useState();
  const toggleSeason = (season) => {
    if (expandedSeason === season) {
      setExpandedSeason(null);
    } else {
      setExpandedSeason(season);
    }
  };
 

  function getNextEpisode(selectedEpisode, deets) {
    const seasonIndex = deets.seasons.findIndex(
      (season) => season.season === selectedEpisode.season
    );
    const episodeIndex = deets.seasons[seasonIndex].episodes.findIndex(
      (episode) => episode.id === selectedEpisode.id
    );
  
    if (episodeIndex === deets.seasons[seasonIndex].episodes.length - 1) {
      // Last episode of the season
      if (seasonIndex === deets.seasons.length - 1) {
        // Last episode of the last season
        return null;
      } else {
        // First episode of the next season
      handleEpisodeClick(deets.seasons[seasonIndex + 1].episodes[0]);
      }
    } else {
      // Next episode in the same season
      handleEpisodeClick(deets.seasons[seasonIndex].episodes[episodeIndex + 1]);
    }
  }
  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);
    setLoader(<Spinner />);
    setEpisode("");
   
  };
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get(
          `https://spicyapi.vercel.app/meta/tmdb/watch/${selectedEpisode.id}?id=${deets.id}`
        );
        setEpisode(response.data);
        console.log(response.data);
      } catch (error) {
        setEpisode("");
        setLoader(error.message);
      }
    };

    if (selectedEpisode) {
      fetchEpisode();
    }
  }, [selectedEpisode]);

  return (
    <div className="w-[97%] mx-auto">
      <div className="text-white text-6xl mt-10  lg:w-10/12 mx-auto">
        {deets.title}
      </div>
      {episode ? (
        <>
          <Player episode={episode} />
          <div className=" text-2xl lg:text-4xl lg:w-10/12 mx-auto">
            Now Playing S{selectedEpisode.season} E{selectedEpisode.episode} :{" "}
            {selectedEpisode.title} 
          <button className=" text-xl bg-white text-black  p-3 rounded-xl w-full lg:w-10/12 my-4 mx-auto" onClick={()=>getNextEpisode(selectedEpisode,deets)}>Play Next Episode</button>
          </div>
        </>
      ) : (
        <div className="flex w-full justify-center text-center text-2xl my-10 text-white">
          {loader}
        </div>
      )}
      <div className="py-4 lg:w-10/12 mx-auto">
        <div className="container mx-auto px-4">
          {deets.seasons.map((season) => (
            <div key={season.season} className="my-4">
              <h2
                className="text-white text-2xl my-2 font-semibold cursor-pointer flex"
                onClick={() => toggleSeason(season)}
              >
                Season {season.season}   <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 mt-1 mx-5 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                </span>
              </h2>
              {expandedSeason === season && (
                <div className="flex flex-col z-10 space-x-1">
                  {season.episodes?.map((episode) => (
                    <div
                      key={episode.id}
                      className="flex-shrink-0 bg-white/10 p-4 m-1 flex-row items-center mx-1 w-full duration-100 cursor-pointer"
                      onClick={() => handleEpisodeClick(episode)}
                    >

                      <h3 className="text-white flex gap-5 text-sm font-semibold">
                        Episode {episode.episode}: {episode.title}
                        {episode.id ? (
                          <span> <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="green"
                            className="w-6 h-6 "
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg></span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="red"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </h3>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
