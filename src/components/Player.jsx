import React, { useEffect, useRef, useMemo, useCallback, useState } from "react";
import Player from "@oplayer/core";
import hls from "@oplayer/hls";
import ui from "@oplayer/ui";
import { updateWatchTime } from "@/redux/reducers/recentlyWatchedReducers";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
const M3U8Player = ({ episode, getNextEpisode, deets, selectedEpisode }) => {
  
  
  const sources = episode.sources;
  console.log(sources);
  const playerRef = useRef(null);
  function getNextEp(selectedEpisode, deets) {
    const seasonIndex = deets.seasons.findIndex(
      (season) => season.season === selectedEpisode.season
    );
    const episodeIndex = deets.seasons[seasonIndex].episodes.findIndex(
      (episode) => episode.id === selectedEpisode.id
    );
    if (episodeIndex === deets.seasons[seasonIndex].episodes.length - 1)
    {
      if (seasonIndex === deets.seasons.length - 1)
      {
        return "";
      } else
      {
        console.log(deets.seasons[seasonIndex + 1].episodes[0])
        return "Start Season " + deets.seasons[seasonIndex + 1].episodes[0].season
      }
    } else
    {
      return "Play Episode " + deets.seasons[seasonIndex].episodes[episodeIndex + 1].episode;
    }

  }

  const dispatch = useDispatch();
  const debouncedUpdateWatchTime = useRef(debounce((tvid, watchTime) => {
    dispatch(updateWatchTime({ tvid, watchTime }));
  }, 1000)).current;
  const handleWatchTimeUpdate = (tvid, watchTime) => {
    debouncedUpdateWatchTime(tvid, watchTime);
  };

  // Memoize the subtitles list to prevent unnecessary re-rendering
  const subtitlesList = useMemo(
    () =>
      episode.subtitles.filter((source) => source.lang.toLowerCase().includes('eng')).map((subtitle, index) => ({
        src: subtitle.url,
        default: index === 0,
        name: subtitle.lang,
      })),
    [episode.subtitles]
  );
  const updateSubtitle = useCallback(() => {
    playerRef.current.context.ui.subtitle.updateSource(subtitlesList);
  }, [subtitlesList]);
  const title = deets?.type.toLowerCase() === "movie" ? deets.title : `S${selectedEpisode?.season}E${selectedEpisode?.episode}  ${selectedEpisode?.title}`;
  const poster = selectedEpisode?.img?.hd || selectedEpisode?.img?.mobile || deets.image;

  useEffect(() => {
    // Create the player only once using the initial values
    if (!playerRef.current)
    {
      playerRef.current = Player.make('#oplayer', { poster, title }).use([ui({
        theme: {
          primaryColor: "gray",
        }, preload: 'auto',
        pictureInPicture: true,



        settings: ['loop',
          {
            name: 'Quality',
            key: 'KEY',
            type: 'selector', // or 'switcher'

            icon: ` <svg
            viewBox="0 0 24 24"
            fill="currentColor"
         className='w-7 h-7 '
          >
            <path d="M14.5 13.5h2v-3h-2M18 14a1 1 0 01-1 1h-.75v1.5h-1.5V15H14a1 1 0 01-1-1v-4a1 1 0 011-1h3a1 1 0 011 1m-7 5H9.5v-2h-2v2H6V9h1.5v2.5h2V9H11m8-5H5c-1.11 0-2 .89-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
          </svg>`,
            children: episode.sources.map((source) => ({
              name: source.quality !== "auto" ? source.quality + "p" : source.quality,
              value: source.url,
              default: source.quality === "auto",
            })),
            onChange({ value }) {
              playerRef.current.changeQuality({ src: value, poster, title })
            }
          }]
        , topSetting: true,
        controlBar: true
        , menu: [
          deets?.type === "TV Series" ?
            {
              name: getNextEp(selectedEpisode, deets),

              onClick: () => {
                if (deets?.type === "TV Series")
                {
                  getNextEpisode(selectedEpisode, deets);
                } else
                {
                  console.log("Not a TV series");
                }
              },
            } : {
              name: '',
              position: 'top',

            },
        ],
      }), hls({ forceHLS: true }),]).create();

    }



  }, []); // Empty dependency array ensures this effect runs only once on initial render



  useEffect(() => {
    // Update the player source and subtitles when sources change
    if (!playerRef.current) return;




    playerRef.current.changeSource({ src: sources[sources.length - 1]?.url, poster, title });
    playerRef.current.once('loadedmetadata', updateSubtitle)


    // Clean up the event listener on unmount

  }, [sources, selectedEpisode
  ]);
  const watchTimeTimeoutRef = useRef(null);

  useEffect(() => {
    const handleTimeUpdate = () => {
      clearTimeout(watchTimeTimeoutRef.current); // Clear previous timeout (if any)

      watchTimeTimeoutRef.current = setTimeout(() => {
        const currentTime = playerRef.current.currentTime;
        const totalTime = playerRef.current.duration;
        const watchTimePercent = Math.floor((currentTime / totalTime) * 100);

        // Dispatch the updateWatchTime action with the calculated watch time percentage
        dispatch(updateWatchTime({ tvid: deets.id, watchTime: watchTimePercent }));
      }, 500); // Delay execution for 3 seconds
    };

    if (deets.type !== 'Movie')
      playerRef.current.on("timeupdate", handleTimeUpdate);

    // Clean up the event listener and timeout on component unmount
    return () => {
      playerRef.current.off("timeupdate", handleTimeUpdate);
      clearTimeout(watchTimeTimeoutRef.current);
    };
  }, [playerRef, deets.id, dispatch]);

  return (
    <>
      <div key={episode.id} className="w-full my-5">
        {episode ? (
          <div className="justify-center flex">

            <div
              className="w-full h-full lg:w-[720px] aspect-video border-white/30"
              id="oplayer" />


          </div>
        ) : (
          <div className="w-full h-full lg:w-[720px] aspect-video border-white/30 flex items-center justify-center border mx-auto">Loading</div>
        )}


      </div>


    </>
  );
};

export default M3U8Player;
