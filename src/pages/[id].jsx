import ArtPlayer from "@/components/Artplayer";
import { Button } from "@/components/Button";
import Navbar from "@/components/Navbar";
import EnimePlayer from "@/components/Player";
import Player from "@/components/Player";
import TvShowDetails from "@/components/TVShowDetails";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

  try
  {
    const response = await axios.get(`https://spicyapi.vercel.app/meta/tmdb/info/${tvid}?type=TV%20Series`);
    const details = response.data;


    return {
      props: {
        deets: details,
        id: tvid,
      },
    };
  } catch (error)
  {
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
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
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
      {deets &&
        <TvShowDetails show={deets} />
      }<div className="w-full flex justify-center">

     
      {recentlyWatched?.map(
        (e) =>
          e.tvid === id && (

            <Button className='rounded-full' onClick={() => handleEpisodeClick(e.episode)} key={e.tvid}> Play S{e.episode.season} E{e.episode.episode} : {e.episode.title}</Button>
          )
      )} </div>
    
      {episode ? (
        <div className="flex  flex-col w-full mx-auto lg:w-10/12">
          <Player episode={episode} getNextEpisode={getNextEpisode} deets={deets} selectedEpisode={selectedEpisode} />


        </div>
      ) : (
        loader && (
          <div className="flex w-full justify-center text-center text-2xl my-10 text-white">
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
          {deets.seasons.map((season) => (
            <>


              <Accordion key={season.season} type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-xl'>Season {season.season}</AccordionTrigger>
                  <AccordionContent >
                    <div className="flex flex-col gap-2">
                      {season.episodes && season.episodes.filter(episode => episode.id).length > 0 ? (
                        season.episodes.map((episode) => (
                          episode.id && (
                            selectedEpisode?.id === episode.id ?
                              <><div onClick={() => handleEpisodeClick(episode)} key={episode.id} className=" bg-white/5 hidden md:flex flex-row w-full  h-44 rounded-lg ">
                                <img src={episode.img.hd} className=" w-1/3 aspect-video" />
                                <div className="flex justify-center flex-col gap-2 text-left p-2">

                                  <div className=" text-xs lg:text-lg">Episode {episode.episode} : {episode.title}</div>
                                  <div className="text-xs lg:text-sm opacity-50">{formatDate(episode.releaseDate) || ''}</div>
                                  <div className="text-xs lg:text-sm line-clamp-3">{episode.description}</div>
                                </div>
                              </div>
                                <div onClick={() => handleEpisodeClick(episode)} key={episode.id} className="episode-card md:hidden border-2 border-white/20 flex-none relative w-full h-44 rounded-lg   ">
                                  <div className="overlay absolute rounded-lg inset-0 bg-black opacity-50 "></div>
                                  <div className="episode-img-container rounded-lg w-full h-full overflow-hidden">
                                    <img className="w-full h-full object-cover rounded-lg" src={episode.img?.hd || deets.image} alt={`Episode ${episode.episode}`} />
                                  </div>




                                  <div className="episode-info absolute bottom-2 w-full px-4 text-white">
                                    <h3 className="text-xs text-white/40 line-clamp-1">{formatDate(episode.releaseDate) || ''}</h3>
                                    <h3 className=" text-md lg:text-lg  line-clamp-1">E{episode.episode} : {episode.title}</h3>
                                    <h3 className=" text-xs lg:text-lg text-white/60 line-clamp-2">{episode.description}</h3>
                                  </div>
                                </div>
                              </>

                              :
                              <><div onClick={() => handleEpisodeClick(episode)} key={episode.id} className=" hidden md:flex flex-row w-full  h-44 rounded-lg ">
                                <img src={episode.img.hd} className=" w-1/3 aspect-video" />
                                <div className="flex justify-center flex-col gap-2 text-left p-2">

                                  <div className=" text-xs lg:text-lg">Episode {episode.episode} : {episode.title}</div>
                                  <div className="text-xs lg:text-sm opacity-50">{formatDate(episode.releaseDate) || ''}</div>
                                  <div className="text-xs lg:text-sm line-clamp-3">{episode.description}</div>
                                </div>
                              </div>
                                <div onClick={() => handleEpisodeClick(episode)} key={episode.id} className="episode-card md:hidden flex-none relative w-full h-44 rounded-lg   ">
                                  <div className="overlay absolute rounded-lg inset-0 bg-black opacity-70 "></div>
                                  <div className="episode-img-container rounded-lg w-full h-full overflow-hidden">
                                    <img className="w-full h-full object-cover rounded-lg" src={episode.img?.hd || deets.image} alt={`Episode ${episode.episode}`} />
                                  </div>




                                  <div className="episode-info absolute bottom-2 w-full px-4 text-white">
                                    <h3 className="text-xs text-white/40 line-clamp-1">{formatDate(episode.releaseDate) || ''}</h3>
                                    <h3 className=" text-md lg:text-lg  line-clamp-1">E{episode.episode} : {episode.title}</h3>
                                    <h3 className=" text-xs lg:text-lg text-white/60 line-clamp-2">{episode.description}</h3>
                                  </div>
                                </div>
                              </>

                          )
                        ))
                      ) : (
                        <p className="text-white p-4">No episodes available</p>
                      )}</div>
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
