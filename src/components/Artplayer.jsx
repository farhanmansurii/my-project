import Artplayer from "artplayer";
import Hls from "hls.js";
import { useEffect, useRef } from "react";

export default function ArtPlayer({ option, getInstance, source, subtitles,...rest }) {
  const artRef = useRef();
  useEffect(() => {
    const art = new Artplayer({
      url:source,
      customType: {
        m3u8: function playM3u8(video, url, art) {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            art.hls = hls;
            art.once("url", () => hls.destroy());
            art.once("destroy", () => hls.destroy());
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            art.notice.show = "Unsupported playback format: m3u8";
          }
        },
      },settings: [
        {
          width: 200,
          html: 'Subtitles',
          tooltip: 'select subtitle',
          selector: subtitles,
          onSelect: function (item) {
            console.log(item)
            art.subtitle.switch(item.url, {
              name: item.html,
            });
            return item.html;
          },
        }],
      ...option,

      container: artRef.current,
    });

    if (getInstance && typeof getInstance === "function") {
      getInstance(art);
    }

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, [source]);

  return <div ref={artRef} {...rest}></div>;
}
