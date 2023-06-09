import ArtPlayer from "@/components/Artplayer";
import Navbar from "@/components/Navbar";
import EnimePlayer from "@/components/Player";
import Player from "@/components/Player";
import TvShowDetails from "@/components/TVShowDetails";
import { addEpisode } from "@/redux/reducers/recentlyWatchedReducers";
import axios from "axios";
import Link from "next/link";
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
    <div className="">
      <Navbar />
      <TvShowDetails show={deets} />
      <div className="w-full flex justify-center">

     
      {recentlyWatched?.map(
        (e) =>
          e.tvid === id && (
            <div
              onClick={() => handleEpisodeClick(e.episode)}
              key={e.tvid}
              className="cursor-pointer rounded-full my-[4rem] bg-white/10 border border-white/5 mx-auto"
            >
              <div className="flex max-w-full w-fit flex-row items-center bg-black rounded-full pt-2 pb-3 px-5 ">
                <div className="text-white text-center line-clamp-1 whitespace-nowrap lg:text-left mr-2">
                  <span className="text-xs uppercase font-semibold mr-2">
                    Play S{e.episode.season} E{e.episode.episode}
                  </span>
                  <span className="text-xs">{e.episode.title}</span>
                </div>
              </div>
            </div>
          )
      )} </div>
    
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
                className={`text-white p-3 text-xl cursor-pointer flex items-center rounded m-2 justify-between hover:bg-neutral-700 duration-200 ${expandedSeason === season ? 'border' : ''}`}

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
                <div className="flex flex-row  overflow-x-scroll p-2 space-x-2 scrollbar-hide mx-auto ">
                  {season.episodes && season.episodes.filter(episode => episode.id).length > 0 ? (
                    season.episodes.map((episode) => (
                      episode.id && (
                        selectedEpisode?.id === episode.id ?
                          <div onClick={() => handleEpisodeClick(episode)} key={episode.id} className="episode-card border-2 border-spacing-1 flex-none relative w-60 h-32 mb-2 mx-2 rounded-lg max-w-xs">
                            <div className="overlay absolute inset-0 bg-black opacity-50 rounded-lg"></div>
                            <div className="episode-img-container w-full h-full rounded-lg overflow-hidden">
                              <img className="w-full h-full object-cover" src={episode.img?.hd || deets.image} alt={`Episode ${episode.episode}`} />
                            </div>




                            <div className="episode-info absolute bottom-2 w-full px-4 text-white">
                              <h3 className="text-xs text-white/60  line-clamp-1">{episode.releaseDate || ''}</h3>
                              <h3 className=" text-sm lg:text-lg  line-clamp-1">E{episode.episode} : {episode.title}</h3>
                            </div>
                          </div>

                          :

                          <div onClick={() => handleEpisodeClick(episode)} key={episode.id} className="episode-card flex-none relative w-60 h-32 mb-2 mx-2 rounded-lg max-w-xs">
                            <div className="overlay absolute inset-0 bg-black opacity-70 rounded-lg"></div>
                            <div className="episode-img-container w-full h-full rounded-lg overflow-hidden">
                              <img className="w-full h-full object-cover" src={episode.img?.hd || deets.image} alt={`Episode ${episode.episode}`} />
                            </div>




                            <div className="episode-info absolute bottom-2 w-full px-4 text-white">
                              <h3 className="text-xs text-white/60 line-clamp-1">{episode.releaseDate || ''}</h3>
                              <h3 className=" text-sm lg:text-lg  line-clamp-1">E{episode.episode} : {episode.title}</h3>
                            </div>
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
