import Player from "@/components/Player";
import axios from "axios";
import { useEffect, useState } from "react";

export async function getServerSideProps(context) {
  const tvid = context.query.id;
  const detailsResponse = await fetch(
    `https://api.consumet.org/movies/flixhq/info?id=movie/${tvid}`
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
  const data = [
    {
      headers: {
        Referer: "https://dokicloud.one/embed-4/5WZI7J4tI9iF?z=",
      },
      sources: [
        {
          url: "https://t-eu-2.magnewscontent.org/_v10/e8b38480bb296d04ae076eecd2b7a6d7ec72c95d91485008698c31964aaf1b5f8a1d13e315360407bc2e1fe931abb6ebcc12bde0efae09cc2ed6ad144e62f40374386c7f616998183e97f47368a184cb45a699e967bc290e65abed966a791e8b7c6438e176b647a685f6c4584fd84c442a5695414405781f7325e9ea0cc6463c/1080/index.m3u8",
          quality: "1080",
          isM3U8: true,
        },
        {
          url: "https://t-eu-2.magnewscontent.org/_v10/e8b38480bb296d04ae076eecd2b7a6d7ec72c95d91485008698c31964aaf1b5f8a1d13e315360407bc2e1fe931abb6ebcc12bde0efae09cc2ed6ad144e62f40374386c7f616998183e97f47368a184cb45a699e967bc290e65abed966a791e8b7c6438e176b647a685f6c4584fd84c442a5695414405781f7325e9ea0cc6463c/720/index.m3u8",
          quality: "720",
          isM3U8: true,
        },
        {
          url: "https://t-eu-2.magnewscontent.org/_v10/e8b38480bb296d04ae076eecd2b7a6d7ec72c95d91485008698c31964aaf1b5f8a1d13e315360407bc2e1fe931abb6ebcc12bde0efae09cc2ed6ad144e62f40374386c7f616998183e97f47368a184cb45a699e967bc290e65abed966a791e8b7c6438e176b647a685f6c4584fd84c442a5695414405781f7325e9ea0cc6463c/360/index.m3u8",
          quality: "360",
          isM3U8: true,
        },
        {
          url: "https://t-eu-2.magnewscontent.org/_v10/e8b38480bb296d04ae076eecd2b7a6d7ec72c95d91485008698c31964aaf1b5f8a1d13e315360407bc2e1fe931abb6ebcc12bde0efae09cc2ed6ad144e62f40374386c7f616998183e97f47368a184cb45a699e967bc290e65abed966a791e8b7c6438e176b647a685f6c4584fd84c442a5695414405781f7325e9ea0cc6463c/playlist.m3u8",
          isM3U8: true,
          quality: "auto",
        },
      ],
      subtitles: [
        {
          url: "https://prev.2cdns.com/_m_preview/3a/3ada81b0a47bb23e44be48c44743dba5/thumbnails/sprite.vtt",
          lang: "Default (maybe)",
        },
      ],
    },
  ];
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episode, setEpisode] = useState();
  const handleEpisodeClick = (epid) => {
    setSelectedEpisode(epid);
  };

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get(
          `https://api.consumet.org/movies/flixhq/watch?mediaId=movie/${id}&episodeId=${selectedEpisode}`
        );
        setEpisode(response.data);
        console.log(response.data);
      } catch (error) {
        setEpisode(null);
      }
    };

    if (selectedEpisode) {
      fetchEpisode();
    }
  }, [selectedEpisode]);
  return (
    <div>
      {episode && <Player episode={episode} />}
      {deets.episodes.map((episode, index) => (
        <div key={index} onClick={() => setSelectedEpisode(episode.id)}>
          {episode.title}
        </div>
      ))}
    </div>
  );
}

export default MyPage;
