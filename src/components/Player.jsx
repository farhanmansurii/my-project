import { useEffect, useState } from "react";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";
import dynamic from "next/dynamic";
import ArtPlayer from "./Artplayer";
import { html } from "artplayer";

const Player = ({ episode }) => {
  const [selectedUrl, setSelectedUrl] = useState(
    episode.sources.find((video) => video.quality === "auto")?.url
  );
  const handleQualityChange = (url) => {
    setSelectedUrl(url);
  };




  useEffect(() => {
    setSelectedUrl(
      episode.sources.find((video) => video.quality === "auto")?.url
    );
  }, [episode]);


  const subtitleTracks = episode.subtitles.map((subtitle) => ({
    default: subtitle.default,
    src: subtitle.url,
    kind: 'subtitles',
    srclang: 'en',
    type: 'vtt',
    html: subtitle.lang
  }));
  const subtitles = subtitleTracks.map(track => ({
    url: track.src,
    type: 'vtt',
    html: track.html,

  }));
  console.log(subtitles)
  return (
    <div key={episode.id} className="w-full my-5">
      {selectedUrl && episode ? (
        <div className="justify-center flex">
          <div className="w-full h-full lg:w-[720px] aspect-video border-white/30">
            <ArtPlayer
              source={selectedUrl}
              subtitles={subtitles}
              option={{

                backdrop: true,

                playsInline: true,
                autoPlayback: true,
                theme: "#e63946",
                miniProgressBar: true,
                volume: 0.5,
                isLive: false,
                muted: false,
                autoplay: false,
                autoSize: true,
                screenshot: true,
                setting: true,
                playbackRate: true,
                aspectRatio: true,
                fullscreen: true,
                miniProgressBar: true,
                mutex: true,
                backdrop: true,
                playsInline: true,
                autoPlayback: true,
                lock: true,
                autoOrientation: true,

                plugins: [
                  artplayerPluginHlsQuality({
                    // Show quality in control
                    control: true,

                    // Show quality in setting
                    setting: true,

                    // Get the resolution text from level
                    getResolution: (level) => level.height + "P",

                    // I18n
                    title: "Quality",
                    auto: "auto",
                  }),
                  artplayerPluginControl(),

                ],
                setting: true,
                screenshot: true,
                fullscreen: true,
                fastForward: true,

                autoSize: true,
              }} className="aspect-video"
            />
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
      <div className="gap-1 flex py-1 flex-row flex-wrap place-content-end lg:place-content-center items-center">
        <select
          value={selectedUrl}
          onChange={(event) => handleQualityChange(event.target.value)}
          className="px-4 py-1 bg-black border-2 w-fit focus:outline-none"
        >
          {episode.sources.map((video) => (
            <option key={video.url} value={video.url}>
              {video.quality}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Player;
