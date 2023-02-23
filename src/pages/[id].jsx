import Player from "@/components/Player";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "react-spinner-material";

export async function getServerSideProps(context) {
  const tvid = context.query.id;
  const detailsResponse = await fetch(
    `https://spicyapi.vercel.app/meta/tmdb/info/${tvid}?type=TV%20Series`
  );
  const details = await detailsResponse.json();
  return {
    props: {
      deets: details,
      id: tvid,
    },
  };
}

function MyPage({ id, deets }) {
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loader, setLoader] = useState();
  const [episode, setEpisode] = useState();
  console.log(deets);
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get(
          `https://spicyapi.vercel.app/meta/tmdb/watch/${selectedEpisode.id}?id=${deets.id}`
        );
        setEpisode(response.data);
        console.log(response.data);
      } catch (error) {
        setEpisode("");
        setLoader(error.message);
      }
    };

    if (selectedEpisode) {
      fetchEpisode();
    }
  }, [selectedEpisode]);

  return (
    <div className="w-[97%] mx-auto">
      <div className="text-white text-6xl mt-10  lg:w-10/12 mx-auto">
        {deets.title}
      </div>
      {episode ? (
        <>
          <Player episode={episode} />
          <div className=" text-2xl lg:text-4xl lg:w-10/12 mx-auto">
            Now Playing Episode {selectedEpisode.episode} :{" "}
            {selectedEpisode.title}
          </div>
        </>
      ) : (
        <div className="flex w-full justify-center text-center text-2xl my-10 text-white">
          {loader}
        </div>
      )}
      <div className="py-4 lg:w-10/12 mx-auto">
        <div className="container mx-auto px-4">
          {deets.seasons.map((season) => (
            <div key={season.season} className="my-4">
              <h2 className="text-white text-2xl my-2 font-semibold">
                Season {season.season}
              </h2>
              <div className="  flex flex-col   z-10   space-x-1 ">
                {season.episodes?.map((episode) => (
                  <div
                    key={episode.id}
                    className="flex-shrink-0 bg-white/10 p-4 m-1 flex-row items-center mx-1 w-full duration-100"
                    onClick={() => {
                      setLoader(<Spinner />);
                      setEpisode(""), setSelectedEpisode(episode);
                    }}
                  >
                    <h3 className="text-white flex gap-5  text-sm font-semibold ">
                      Episode {episode.episode}: {episode.title}
                      <span>
                        {episode.id ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="green"
                            className="w-6 h-6 "
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="red"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </span>
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
