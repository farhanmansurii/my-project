import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const Player = ({ episode }) => {
  console.log(episode.subtitles, "sources");
  const [selectedUrl, setSelectedUrl] = useState(
    episode.sources.find((video) => video.quality === "auto")?.url
  );
  const handleQualityChange = (url) => {
    setSelectedUrl(url);
  };
  const subtitleTracks = episode.subtitles.map((subtitle, index) => ({
    kind: "subtitles",
    src: subtitle.url,
    srcLang: subtitle.lang,
    default: subtitle.default,
  }));
  useEffect(() => {
    setSelectedUrl(
      episode.sources.find((video) => video.quality === "auto")?.url
    );
  }, [episode]);

  return (
    <div key={episode.id} className="w-full ">
      <div className="gap-1 flex py-1 flex-wrap place-content-center items-center">
        <select
          value={selectedUrl}
          onChange={(event) => handleQualityChange(event.target.value)}
          className=" px-4 py-1 bg-white  focus:outline-none "
        >
          {episode.sources.map((video) => (
            <option key={video.url} value={video.url} bg-black>
              {video.quality}
            </option>
          ))}
        </select>
      </div>

      {selectedUrl && episode ? (
        <div className="justify-center flex  my-10">
            <div className="w-full h-full  lg:w-[720px] aspect-video border-2" >
              <ReactPlayer
                url={selectedUrl}
                controls
                width={'100%'}
                height={'100%'}
                style={{ top: 0, left: 0, width: '100%', height: '100%' }}
                config={{
                  file: {
                    tracks: subtitleTracks,
                  },
                  attributes: {
                    crossOrigin: 'anonymous',
                  },
                }}
              />
            </div>
          </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};

export default Player;
