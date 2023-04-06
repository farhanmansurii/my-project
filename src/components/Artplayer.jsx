import Player from "@oplayer/core";
import hls from "@oplayer/hls";
import ui from "@oplayer/ui";
import { useEffect, useRef } from "react";

export default function EnimePlayer(props) {
  const { source, subtitles, getNextEpisode, deets, selectedEpisode } = props;

  console.log(deets);
  const playerContainerRef = useRef();
  const playerRef = useRef();

  useEffect(() => {
    if (playerRef.current) return;
    playerRef.current = Player.make(playerContainerRef.current)
      .use([
        ui({
          theme: { primaryColor: "#e1e1e1e1" },
          pictureInPicture: true,
          slideToSeek: "always",controlBar: { back: "always" }, // | { back:  'always' | 'fullscreen' } // appbar
          topSetting: true,
          forceLandscapeOnFullscreen: true,
          menu: [
            {
              name: "Next",
              icon: `  <svg fill="none" viewBox="0 0 15 15" height="1em" width="1em" className="hover:scale-110">
      <path
        fill="currentColor"
        d="M1.79 2.093A.5.5 0 001 2.5v10a.5.5 0 00.79.407l7-5a.5.5 0 000-.814l-7-5zM13 13h1V2h-1v11z"
      />
    </svg>
`,
              onClick: () => {
                deets?.type === "TV Series" ?
                  getNextEpisode(selectedEpisode, deets) : console.log('not a movie')
              },
            },

          ],
        }),
        hls(),

      ])
      .create();
  }, []);

  useEffect(() => {
    if (source) {
      playerRef.current.changeSource({
        title:
          deets?.type === "Movie" ?
            (`${deets?.title}`) :
            (` S${selectedEpisode?.season}E${selectedEpisode?.season}  ${selectedEpisode?.title}`),
        src: source,
      });
    }
    if (subtitles) {
      playerRef.current.plugins.ui.subtitle.updateSource(subtitles);
    }
  }, [source]);

  return (
    <div>
      <div className="w-full h-full p-0 m-0" ref={playerContainerRef} />
    </div>
  );
}
