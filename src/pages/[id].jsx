import { Button } from "@/components/Button";
import Navbar from "@/components/Navbar";
import M3U8Player from "@/components/Player";
import TvShowDetails from "@/components/TVShowDetails";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { addEpisode } from "@/redux/reducers/recentlyWatchedReducers";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-spinner-material";

export async function getServerSideProps(context) {
  const tvid = context.query.id;

  try {
    const response = await axios.get(
      `https://spicyapi.vercel.app/meta/tmdb/info/${tvid}?type=TV%20Series`
    );
    const details = response.data;

    return {
      props: {
        deets: details,
        id: tvid,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        deets: null,
        id: tvid,
      },
    };
  }
}

function MyPage({ id, deets }) {
  console.log(deets);
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
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }
  function getNextEpisode(selectedEpisode, deets) {
    const seasonIndex = deets.seasons.findIndex(
      (season) => season.season === selectedEpisode.season
    );
    const episodeIndex = deets.seasons[seasonIndex].episodes.findIndex(
      (episode) => episode.id === selectedEpisode.id
    );
    const tvshowtitle = deets.title;

    if (episodeIndex === deets.seasons[seasonIndex].episodes.length - 1) {
      if (seasonIndex === deets.seasons.length - 1) {
        return null;
      } else {
        handleEpisodeClick(deets.seasons[seasonIndex + 1].episodes[0]);
      }
    } else {
      handleEpisodeClick(deets.seasons[seasonIndex].episodes[episodeIndex + 1]);
    }
  }
  const recentlyWatched = useSelector(
    (state) => state.recentlyWatched.recentlyWatched
  );
  const handleEpisodeClick = (episode) => {
    setSelectedEpisode(episode);

    setLoader(<Spinner />);
    setEpisode("");
    dispatch(addEpisode({ ...episode, tvshowtitle: deets.title, tvid: id }));
  };
  useEffect(() => {
    const fetchEpisode = async () => {
      const url = `https://spicyapi.vercel.app/movies/flixhq/watch?episodeId=/${selectedEpisode.id}&mediaId=${deets.id}`;
      try {
        const response = await axios.get(url);
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
  }, [selectedEpisode, deets.id]);

  return (
    <div className="">
      <Navbar />
      {deets && <TvShowDetails show={deets} />}
      <div className="w-full flex justify-center">
        {recentlyWatched?.map(
          (e) =>
            e.tvid === id && (
              <Button
                className="rounded-full"
                onClick={() => handleEpisodeClick(e.episode)}
                key={e.tvid}
              >
                {" "}
                Play S{e.episode.season} E{e.episode.episode} :{" "}
                {e.episode.title}
              </Button>
            )
        )}{" "}
      </div>

      {episode ? (
        <div className="flex  flex-col w-full mx-auto lg:w-10/12">
          <M3U8Player
            episode={episode}
            getNextEpisode={getNextEpisode}
            deets={deets}
            selectedEpisode={selectedEpisode}
          />
        </div>
      ) : (
        loader && (
          <div className="w-full h-full lg:w-[720px] aspect-video  flex items-center justify-center  mx-auto">
            {loader}
          </div>
        )
      )}

      {/* <div onClick={ () => {
         m3u8DLN(episode.sources[0].url, './')
      }} className="text-3xl bg-purple-300 text-white">

        {episode && episode.sources[0].quality}
      </div> */}
      <div className=" pb-[8rem] lg:w-10/12 mx-auto">
        <div className="container mx-auto px-4">
          {deets?.seasons &&
            deets.seasons.map((season) => (
              <>
                <Accordion key={season.season} type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl">
                      Season {season.season}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-2">
                        {season.episodes &&
                        season.episodes.filter((episode) => episode.id).length >
                          0 ? (
                          season.episodes.map(
                            (episode) =>
                              episode.id && (
                                <>
                                  <div
                                    onClick={() => handleEpisodeClick(episode)}
                                    key={episode.id}
                                    className={` hidden md:flex flex-row w-fit   rounded-lg 
                                    
                                    ${
                                      selectedEpisode?.id === episode.id
                                        ? "bg-neutral-400/30 rounded-xl"
                                        : ""
                                    }
                                    `}
                                  >
                                    <img
                                      src={episode.img.hd}
                                      className={` object-contain h-44 w-fit aspect-video `}
                                    />
                                    <div className="flex justify-center flex-col gap-2 text-left p-2">
                                      <div className=" text-xs lg:text-lg">
                                        Episode {episode.episode} :{" "}
                                        {episode.title}
                                      </div>
                                      <div className="text-xs lg:text-sm opacity-50">
                                        {formatDate(episode.releaseDate) || ""}
                                      </div>
                                      <div className="text-xs lg:text-sm line-clamp-3">
                                        {episode.description}
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    onClick={() => handleEpisodeClick(episode)}
                                    key={episode.id}
                                    className={`episode-card md:hidden flex-none relative w-full h-44 rounded-lg   
                                    ${
                                      selectedEpisode?.id === episode.id
                                        ? "border-4 border-neutral-500/40 rounded-2xl"
                                        : ""
                                    }
                                    `}
                                  >
                                    <div className="overlay absolute rounded-xl inset-0 bg-black opacity-70 "></div>
                                    <div className="episode-img-container rounded-lg w-full h-full overflow-hidden">
                                      <img
                                        className="w-full h-full object-cover rounded-xl"
                                        src={episode.img?.hd || deets.image}
                                        alt={`Episode ${episode.episode}`}
                                      />
                                    </div>

                                    <div className="episode-info absolute bottom-2 w-full px-4 text-white">
                                      <h3 className="text-xs text-white/40 line-clamp-1">
                                        {formatDate(episode.releaseDate) || ""}
                                      </h3>
                                      <h3 className=" text-md lg:text-lg  line-clamp-1">
                                        E{episode.episode} : {episode.title}
                                      </h3>
                                      <h3 className=" text-xs lg:text-lg text-white/60 line-clamp-2">
                                        {episode.description}
                                      </h3>
                                    </div>
                                  </div>
                                </>
                              )
                          )
                        ) : (
                          <p className="text-white p-4">
                            No episodes available
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            ))}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
