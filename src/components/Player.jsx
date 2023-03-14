import { useEffect, useState } from "react";
import artplayerPluginHlsQuality from "artplayer-plugin-hls-quality";
import dynamic from "next/dynamic";
import ArtPlayer from "./Artplayer";
import { html } from "artplayer";
import { BiSave } from "react-icons/bi";

const Player = ({ episode, getNextEpisode, deets, selectedEpisode }) => {

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


  const subtitles = episode.subtitles
    .filter((subtitle) => subtitle.lang.toLowerCase().includes('english'))
    .map((subtitle, index) => ({
      default: index === 0 ? true : false,
      url: subtitle.url,
      type: 'vtt',
      html: subtitle.lang
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

                ],
                setting: true,
                fullscreen: true,
                fastForward: true,
                controls: [
                  {
                    name: 'your-button',
                    index: 10,
                    position: 'right',
                    html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.288 4.819A1.5 1.5 0 001 6.095v7.81a1.5 1.5 0 002.288 1.277l6.323-3.905c.155-.096.285-.213.389-.344v2.973a1.5 1.5 0 002.288 1.276l6.323-3.905a1.5 1.5 0 000-2.553L12.288 4.82A1.5 1.5 0 0010 6.095v2.973a1.506 1.506 0 00-.389-.344L3.288 4.82z" /></svg>'
                    ,
                    tooltip: ' Next Episode',
                    click: () => {
                      deets.type !== "Movie" &&
                        getNextEpisode(selectedEpisode, deets)
                    }
                    ,
                    mounted: function (...args) {
                      console.info('mounted', args);
                    },
                  }],
                autoSize: true,
                icons: {
                  play: '<svg xmlns="http://www.w3.org/2000/svg" style={{color :"red"}} viewBox="0 0 20 20" fill="red" className="w-5 stroke-red-500 h-5"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>',
                  loading: '<img  class="animate-spin  w-12 h-12" src="https://png.pngtree.com/png-vector/20220818/ourmid/pngtree-mangekyou-sharingan-shisui-uchiha-png-image_6115662.png" class="h-12 w-12" />',
                  state: '<img src="https://icons-for-free.com/iconfiles/png/512/go+pikachu+play+pokemon+icon-1320186973527720987.png" class="h-12 w-12" />',

                },
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
