import ArtPlayer from "@/components/Artplayer";
import Navbar from "@/components/Navbar";
import Player from "@/components/Player";
import TvShowDetails from "@/components/TVShowDetails";
import { addEpisode } from "@/redux/reducers/recentlyWatchedReducers";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-spinner-material";
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

  console.log(deets)
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
    const tvshowtitle = deets.title;

    if (episodeIndex === deets.seasons[seasonIndex].episodes.length - 1)
    {
      if (seasonIndex === deets.seasons.length - 1) {
        return null;
      } else {
        handleEpisodeClick(deets.seasons[seasonIndex + 1].episodes[0]);
      }
    } else {
      handleEpisodeClick(deets.seasons[seasonIndex].episodes[episodeIndex + 1]);
    }
  }
  const recentlyWatched = useSelector((state) => state.recentlyWatched.recentlyWatched);
  console.log(recentlyWatched)
  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);

    setLoader(<Spinner />);
    setEpisode("");
    dispatch(addEpisode({ ...episode, tvshowtitle: deets.title, tvid: id}));
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
      <Navbar />
      <TvShowDetails show={deets} />
      {recentlyWatched?.map(
        (e) =>
          e.tvid === id && (
            <div onClick={() => handleEpisodeClick(e.episode)} key={e.tvid} className="cursor-pointer mx-auto w-11/12 lg:w-10/12">
              <div className="flex border max-w-full w-fit  flex-row items-center bg-black bg-opacity-75 rounded-lg py-4 px-6 my-4">
                <div className="text-white text-center  line-clamp-1 whitespace-nowrap lg:text-left mr-6">
                  <span className="text-sm lg:text-lg font-semibold mr-2"> Play S{e.episode.season} E{e.episode.episode}</span>
                  <span className="text-xs lg:text-sm ">{e.episode.title}</span>
                </div>
                <div className="flex justify-center items-center bg-white text-black rounded-full w-7 h-7 shadow-lg">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                    <path d="M7 19V5L19 12L7 19Z" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
          )
      )}
    
      {episode ? (
        <div className="flex  flex-col w-full mx-auto lg:w-10/12">
          <Player episode={episode} getNextEpisode={getNextEpisode} deets={deets} selectedEpisode={selectedEpisode} />
          {/* <div className=" text-2xl lg:text-4xl text-start  ">
            Now Playing S{selectedEpisode.season} E{selectedEpisode.episode} :{" "}
            {selectedEpisode.title}
          </div>
          <button
            className="text-sm lg:text-lg bg-white text-black  py-2 px-5 rounded-lg my-4 w-fit"
            onClick={() => getNextEpisode(selectedEpisode, deets)}
          >
            Play Next Episode
          </button> */}
        </div>
      ) : (
        loader && (
          <div className="flex w-full justify-center text-center text-2xl my-10 text-white">
            {loader}
          </div>
        )
      )}
      <div className=" pb-[8rem] lg:w-10/12 mx-auto">
        <div className="container mx-auto px-4">
          {deets.seasons.map((season) => (
            <div key={season.season} className="">
              <h2
                className="text-white p-3 text-xl cursor-pointer flex items-center border m-2 rounded-md  justify-between hover:bg-neutral-700 duration-200 "
                onClick={() => toggleSeason(season)}
              >
                <span>Season {season.season}</span>



                  <svg
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  height="1em"
                  width="1em"
                  className={`h-6 w-6 transition-transform duration-300 transform ${expandedSeason === season ? "rotate-180" : "rotate-0"}`}

                >
                  <path
                    fillRule="evenodd"
                    d="M1.553 6.776a.5.5 0 01.67-.223L8 9.44l5.776-2.888a.5.5 0 11.448.894l-6 3a.5.5 0 01-.448 0l-6-3a.5.5 0 01-.223-.67z"
                  />
                </svg>
              </h2>
              {expandedSeason === season && (
                <div className="flex flex-col z-10 space-x-1">
                  {season.episodes && season.episodes.filter(episode => episode.id).length > 0 ? (
                    season.episodes.map((episode) => (
                      episode.id && (
                        selectedEpisode?.id === episode.id ?
                          <div
                            key={episode.id}
                            className="flex-shrink-0 bg-white/70 text-black rounded-md  p-4 flex-row items-center mx-1 w-full duration-100 cursor-pointer"
                            onClick={() => handleEpisodeClick(episode)}
                          >
                            <h3 className="text-black flex gap-5 text-sm font-bold">
                              E{episode.episode}: {episode.title}
                            </h3>
                            <div className="italic"><span className="font-bold ">Synopsis </span> : {episode.description || '-'}</div>
                          </div>
                          :
                        <div
                          key={episode.id}
                          className="flex-shrink-0 border-b p-4 flex-row items-center mx-1 w-full duration-100 cursor-pointer"
                          onClick={() => handleEpisodeClick(episode)}
                        >
                          <h3 className="text-white flex gap-5 text-sm font-semibold">
                            E{episode.episode}: {episode.title}
                          </h3>
                        </div>
                      )
                    ))
                  ) : (
                    <p className="text-white p-4">No episodes available</p>
                  )}
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
