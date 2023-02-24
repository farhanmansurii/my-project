import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const Player = ({ episode }) => {
  const [selectedUrl, setSelectedUrl] = useState(
    episode.sources.find((video) => video.quality === "auto")?.url
  );
  const handleQualityChange = (url) => {
    setSelectedUrl(url);
  };
  const searchQuery = "english";

  const results = episode.subtitles.filter(language => {
    return language.lang.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const englishLangs = ["English", "English 1", "English 2", "English - English"];
  const englishSubtitles = episode.subtitles.filter((subtitle) =>
    englishLangs.includes(subtitle.lang)
  );
  
  const defaultSubtitle = englishSubtitles.find((subtitle) => subtitle.lang === "English");
  

  const [selectedSubtitleUrl, setSelectedSubtitleUrl] = useState(
    defaultSubtitle?.url
  );
 
  const subtitleTracks = results.map((subtitle, index) => ({
    kind: "subtitles",
    src: subtitle.url,
    srcLang: subtitle.lang,
   
  }));

  useEffect(() => {
    setSelectedUrl(
      episode.sources.find((video) => video.quality === "auto")?.url
    );
  }, [episode]);

  return (
    <div key={episode.id} className="w-full my-5">
      {selectedUrl && episode ? (
        <div className="justify-center flex  ">
          <div className="w-full h-full   lg:w-[720px] aspect-video  border-white/30">
            <ReactPlayer
              url={selectedUrl}
              controls
              width={"100%"}
              height={"100%"}
              defaultSubtitle={selectedSubtitleUrl}
              style={{ top: 0, left: 0, width: "100%", height: "100%" }}
              config={{
                file: {
                  tracks: subtitleTracks,
                },
                attributes: {
                  crossOrigin: "anonymous",
                },
              }}
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
          className=" px-4 py-1 bg-black border-2  w-fit focus:outline-none "
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
