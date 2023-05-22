import { useEffect, useRef } from "react";
import Player from "@oplayer/core";
import hls from "@oplayer/hls";
import ui from "@oplayer/ui";
import { chromecast, vttThumbnails } from "@oplayer/plugins";

const EnimePlayer = ({
  episode,
  getNextEpisode,
  deets,
  selectedEpisode,
}) => {
  const playerContainerRef = useRef();
  const playerRef = useRef();
  const subtitles = episode?.subtitles
    .filter((subtitle) => subtitle.lang.toLowerCase().includes("eng"))
    .map((subtitle, index) => ({
      src: subtitle.url,
      default: index === 0 ? true : false,
      name: subtitle.lang,
    }));
    console.log(subtitles);
    useEffect(() => {
              fetch(`https://cdn.nade.me/generate?url=${encodeURIComponent("https://rouf.magnewscontent.org/_v10/81b16d8ff2956d3be046729121df2350c2fc12653e68857e2d5c18572afdca2b0ee07bcafb1eb90d55230f164691180ecf90e2e25e8af40e1b53438f22e06626742e1d806f5c283f8206515823e9e444ba9adeeff8961b670e99d950073a937e0cc77d859e8124581bb9fc369f43d629cfb514e251541deef0bc60f8cd33845b/playlist.m3u8")}`, {
                  headers: {
                      "x-origin": "none",
                      "x-referer": "none",
                      "user-agent": "Mozilla/5.0 (Linux; Android 10; SM-J810F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36"
                  }
              })
                  .then(r => r.text())
                  .then(r => {
                      console.log({
                        
                          url: r,
                      });
          });
  }, [episode]);
 
 
    useEffect(() => {
    if (!playerRef.current && episode) {
      const { sources } = episode;

      const newSource = sources.map((e) => ({
        name: e.quality !== "auto" ? e.quality + "p" : e.quality,
        value: e.url,
        default: e.quality === "auto",
      }));
console.log(newSource)
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
                deets?.type === "TV Series" ?
                  getNextEpisode(selectedEpisode, deets) : console.log('not a movie')
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
              children: newSource,
              onChange({ value }) {

                playerRef.current.changeSource({ src: value })
              }
            }
          ],
        }),
        hls({ forceHLS: true }),
        chromecast,
        vttThumbnails,
      ]).create();
    }
  }, [episode]);

  useEffect(() => {
    if (episode) {
      const { sources } = episode;

      playerRef.current.changeSource({
        title:
          deets?.type === "Movie"
            ? `${deets?.title}`
            : `S${selectedEpisode?.season}E${selectedEpisode?.episode}  ${selectedEpisode?.title}`,
        src: sources.find((video) => video.quality === "auto")?.url,
        poster: selectedEpisode?.img.hd || selectedEpisode?.img.mobile || deets.image,
      });


      
    
        playerRef.current.context.ui.subtitle.updateSource(subtitles);
    }
  }, [episode]);

  return (
    <div>
      <div className="w-11/12 mx-auto aspect-video p-0 m-0" ref={playerContainerRef} />
    </div>
  );
};

export default EnimePlayer;
