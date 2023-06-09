import Enime1Player from "./ArtPlayer1";
import EnimePlayer from "./Artplayer";

const Player = ({ episode, getNextEpisode, deets, selectedEpisode }) => {
  return (
    <div key={episode.id} className="w-full my-5">
      {episode ? (
        <div className="justify-center flex">
          <div className="w-full h-full lg:w-[720px] aspect-video border-white/30">
            <Enime1Player key={episode.id}
              episode={episode}
              getNextEpisode={getNextEpisode}
              deets={deets}
              selectedEpisode={selectedEpisode}
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
