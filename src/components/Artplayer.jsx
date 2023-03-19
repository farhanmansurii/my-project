import Player from "@oplayer/core";
import hls from "@oplayer/hls";
import ui from "@oplayer/ui";
import { useEffect, useRef } from "react";

export default function EnimePlayer(props) {
  const { source, subtitles } = props;

  console.log(subtitles);
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
        }),
        hls(),
      ])
      .create();
  }, []);

  useEffect(() => {
    if (source) {
      playerRef.current.changeSource({
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
