import React, { useEffect, useRef, useMemo, useCallback } from "react";
import Player from "@oplayer/core";
import hls from "@oplayer/hls";
import ui from "@oplayer/ui";

const Enime1Player = ({ episode, getNextEpisode, deets, selectedEpisode }) => {
  const sources = episode.sources;
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
        return "Start S" + deets.seasons[seasonIndex + 1].episodes[0].season
      }
    } else
    {
      return "Play E" + deets.seasons[seasonIndex].episodes[episodeIndex + 1].episode;
    }

  }
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
  const title = deets?.type.toLowerCase() === "movie" ? deets.title : `S${selectedEpisode?.season}E${selectedEpisode?.episode}  ${selectedEpisode?.title}`;
  const poster = selectedEpisode?.img?.hd || selectedEpisode?.img?.mobile || deets.image;

  useEffect(() => {
    // Create the player only once using the initial values
    if (!playerRef.current)
    {
      playerRef.current = Player.make('#oplayer', { poster, title }).use([ui({
        theme: {
          primaryColor: "red"
        },
        subtitle: {
          fontSize: 14,
          background: true,
          source: subtitlesList
        },

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
              position: 'top',

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
        ], icons: {
          fullscreen: [`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize-2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>`, `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minimize-2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>`]
        }
      }), hls({ forceHLS: true }),]).create();

    }



  }, []); // Empty dependency array ensures this effect runs only once on initial render

  useEffect(() => {
    // Update the player source and subtitles when sources change
    if (!playerRef.current) return;



    const updatedTitle = deets?.type === "Movie" ? deets.title : `S${selectedEpisode?.season}E${selectedEpisode?.episode}  ${selectedEpisode?.title}`;

    playerRef.current.changeSource({ src: sources[sources.length - 1].url, poster, title });

    playerRef.current.context.ui.subtitle.updateSource(subtitlesList);
  }, [sources, selectedEpisode, subtitlesList]);

  return (<div
    className="w-full h-full lg:w-[720px] aspect-video border-white/30"
    id="oplayer" />);
};

export default Enime1Player;
