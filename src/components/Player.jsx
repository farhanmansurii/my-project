import { useEffect, useState } from "react";
import EnimePlayer from "./Artplayer";

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
    .filter((subtitle) => subtitle.lang.toLowerCase().includes("english"))
    .map((subtitle, index) => ({
      src: subtitle.url,
      default: index === 0 ? true : false,
      name: subtitle.lang,
    }));
  console.log(subtitles);
  return (
    <div key={episode.id} className="w-full my-5">
      {selectedUrl && episode ? (
        <div className="justify-center flex">
          <div className="w-full h-full lg:w-[720px] aspect-video border-white/30">
            <EnimePlayer source={selectedUrl} subtitles={subtitles} />
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
