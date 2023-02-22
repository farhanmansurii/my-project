import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const Player = ({ episode }) => {
  console.log(episode, "sources");
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
    default: index === 0, // set the first subtitle track as the default
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
          className=" px-4 py-1 bg-transparent focus:outline-none focus:ring focus:ring-rose-500"
        >
          {episode.sources.map((video) => (
            <option key={video.url} value={video.url} bg-black>
              {video.quality}
            </option>
          ))}
        </select>
      </div>

      {selectedUrl && episode ? (
        <div className="justify-center flex ">
          <div className="aspect-w-16 aspect-h-9 w-full">
            <ReactPlayer
              url={selectedUrl}
              controls
              width="100%"
              height={`${100 / aspectRatio}vw`}
              config={{
                file: {
                  tracks: subtitleTracks,
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
