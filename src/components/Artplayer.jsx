import React, { useEffect, useRef, useState, useCallback } from "react";
import Player from "@oplayer/core";
import hls from "@oplayer/hls";
import ui from "@oplayer/ui";
import { chromecast, vttThumbnails } from "@oplayer/plugins";

const EnimePlayer = ({ episode, getNextEpisode, deets, selectedEpisode }) => {
  const playerContainerRef = useRef();
  const playerRef = useRef();
  const [currIndex, setCurrIndex] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState(null);

  const handleQualityChange = useCallback(
    ({ value }) => {
      const selectedIndex = episode?.sources?.findIndex((e) => e.url === value);
      setCurrIndex(selectedIndex);
    },
    [episode?.sources]
  );

  useEffect(() => {
    if (currIndex !== null && currIndex !== -1 && currIndex !== generatedUrl) {
      fetch(
        `https://cdn.nade.me/generate?url=${encodeURIComponent(
          episode.sources[currIndex].url
        )}`,
        {
          headers: {
            "x-origin": "none",
            "x-referer": "none",
            "user-agent":
              "Mozilla/5.0 (Linux; Android 10; SM-J810F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36",
          },
        }
      )
        .then((response) => response.text())
        .then((generatedUrl) => {
          setGeneratedUrl(generatedUrl);
          console.log(generatedUrl, "changed");
        });
    }
  }, [currIndex, generatedUrl, episode?.sources]);

  useEffect(() => {
    if (!episode) return;

    // Create or recreate the player instance
   if(deets.type==='Movie' ||  playerRef?.current){
     playerRef.current?.destroy();
console.log(deets.type==='Movie')
   }
    playerRef.current = Player.make(playerContainerRef.current).use([
      ui({
        theme: { primaryColor: "#808080" },
        slideToSeek: "always",
        controlBar: { back: "always" },
        topSetting: true,
        subtitle: { fontSize: 30 },
        menu: [
          {
            name: "Next",
            onClick: () => {
              if (deets?.type === "TV Series") {
                getNextEpisode(selectedEpisode, deets);
              } else {
                console.log("Not a TV series");
              }
            },
          },
          {
            name: "Quality",
            children: episode.sources.map((source) => ({
              name: source.quality !== "auto" ? source.quality + "p" : source.quality,
              value: source.url,
              default: source.quality === "auto",
            })),
            onChange: handleQualityChange,
          },
        ],
      }),
      hls({ forceHLS: true }),
      chromecast,
      vttThumbnails,
    ]).create();

    // Set the initial source
    const initialSource = episode.sources.find((source) => source.quality === "auto");
    const title = deets?.type === "Movie" ? deets.title : `S${selectedEpisode?.season}E${selectedEpisode?.episode}  ${selectedEpisode?.title}`;
    const poster = selectedEpisode?.img.hd || selectedEpisode?.img.mobile || deets.image;
    playerRef.current.changeSource({
      src: initialSource?.url,
      title,
      poster,
    });

    // Update subtitles if necessary
    const subtitles = episode.subtitles
      .filter((subtitle) => subtitle.lang.toLowerCase().includes("eng"))
      .map((subtitle, index) => ({
        src: subtitle.url,
        default: index === 0,
        name: subtitle.lang,
      }));
    playerRef.current.context.ui.subtitle.updateSource(subtitles);

    return () => {
      // Destroy the player instance
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [episode, getNextEpisode, deets, selectedEpisode, handleQualityChange]);

  useEffect(() => {
    if (currIndex !== null && episode?.sources[currIndex]) {
      const source = episode.sources[currIndex];
      const title = deets?.type === "Movie" ? deets.title : `S${selectedEpisode?.season}E${selectedEpisode?.episode}  ${selectedEpisode?.title}`;
      const poster = selectedEpisode?.img.hd || selectedEpisode?.img.mobile || deets.image;
      playerRef.current.changeSource({
        src: source.url,
        title,
        poster,
      });

      const subtitles = episode.subtitles
        .filter((subtitle) => subtitle.lang.toLowerCase().includes("eng"))
        .map((subtitle, index) => ({
          src: subtitle.url,
          default: index === 0,
          name: subtitle.lang,
        }));
      playerRef.current.context.ui.subtitle.updateSource(subtitles);
    }
  }, [currIndex, episode, deets, selectedEpisode]);

  return (
    <div>
      {episode ? (
        <div className="justify-center flex" key={episode.id}>
          <div className="w-full h-full lg:w-[720px] aspect-video border-white/30">
            <div
              className="w-11/12 mx-auto aspect-video p-0 m-0"
              ref={playerContainerRef}
            />
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default EnimePlayer;
