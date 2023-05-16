import Player from "@oplayer/core";
import hls from "@oplayer/hls";
import ui from "@oplayer/ui";
import { useEffect, useRef } from "react";
import { chromecast, vttThumbnails } from '@oplayer/plugins'
export default function EnimePlayer(props) {
  const { source, subtitles, getNextEpisode, deets, selectedEpisode, sources } = props;

  const playerContainerRef = useRef();
  const playerRef = useRef();

  useEffect(() => {
    if (!playerRef.current)
    {
      playerRef.current = Player.make(playerContainerRef.current)
        .use([
          ui({
            theme: { primaryColor: "rgb(231 170 227)" },

            slideToSeek: "always", controlBar: { back: "always" }, // | { back:  'always' | 'fullscreen' } // appbar
            topSetting: true,
            forceLandscapeOnFullscreen: true,
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
              }, {
                name: 'Source',
                children: sources.map((source) => {
                  return {
                    name: source.quality,
                    default: source.quality.includes('auto'),
                    value: source.url
                  }
                }),

              }

            ],
          }),
          hls({ forceHLS: true }),
          chromecast, vttThumbnails
        ])
        .create();

    }



  }, []);

  useEffect(() => {

    if (source)
    {
      playerRef.current.changeSource({
        title:
          deets?.type === "Movie"
            ? `${deets?.title}`
            : `S${selectedEpisode?.season}E${selectedEpisode?.episode}  ${selectedEpisode?.title}`,
        src: source,
        poster: selectedEpisode?.img.hd || selectedEpisode?.img.mobile || deets.image,
      });



    }
    if (subtitles)
    {
      playerRef.current.context.ui.subtitle.updateSource(subtitles);
    }

  }, [source]);

  return (
    <div>
      <div className="w-11/12 mx-auto  aspect-video p-0 m-0" ref={playerContainerRef} />
    </div>
  );
}
