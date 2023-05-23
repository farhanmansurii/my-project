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
        menu: [
          {
            name: "Next",
            icon: ` <svg fill="white" className='w-6 h-6 '  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" xml:space="preserve">
<path d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M280.875,269.313l-96,64
	C182.199,335.094,179.102,336,176,336c-2.59,0-5.184-0.625-7.551-1.891C163.246,331.32,160,325.898,160,320V192
	c0-5.898,3.246-11.32,8.449-14.109c5.203-2.773,11.516-2.484,16.426,0.797l96,64C285.328,245.656,288,250.648,288,256
	S285.328,266.344,280.875,269.313z M368,320c0,8.836-7.164,16-16,16h-16c-8.836,0-16-7.164-16-16V192c0-8.836,7.164-16,16-16h16
	c8.836,0,16,7.164,16,16V320z"/>
</svg>
`,
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
