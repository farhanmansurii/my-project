import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

const Player = ({ episode }) => {
  const videoRef = useRef(null);
  const [selectedUrl, setSelectedUrl] = useState(
    episode.sources.find((video) => video.quality === "auto")?.url
  );
  const subtitles = episode.subtitles.filter(
    (subtitle) => subtitle.url.slice(-3) === "vtt"
  );

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableLowInitialPlaylist: true,
          smoothQualityChange: true,
          enableWebVTT: true,
          autoStartLoad: true,
          startPosition: -1,
          capLevelOnFPSDrop: false,
          capLevelToPlayerSize: false,
          initialLiveManifestSize: 1,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          backBufferLength: Infinity,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferHole: 0.5,
          highBufferWatchdogPeriod: 2,
          nudgeOffset: 0.1,
          nudgeMaxRetry: 3,
          maxFragLookUpTolerance: 0.25,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: Infinity,
          liveDurationInfinity: false,
          enableWorker: true,
          enableSoftwareAES: true,
          manifestLoadingTimeOut: 10000,
          manifestLoadingMaxRetry: 1,
          manifestLoadingRetryDelay: 1000,
          manifestLoadingMaxRetryTimeout: 64000,
          startLevel: undefined,
          levelLoadingTimeOut: 10000,
          levelLoadingMaxRetry: 4,
          levelLoadingRetryDelay: 1000,
          levelLoadingMaxRetryTimeout: 64000,
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 6,
          fragLoadingRetryDelay: 1000,
          fragLoadingMaxRetryTimeout: 64000,
          startFragPrefetch: false,
          testBandwidth: true,
          progressive: false,
          lowLatencyMode: true,
          fpsDroppedMonitoringPeriod: 5000,
          fpsDroppedMonitoringThreshold: 0.2,
          appendErrorMaxRetry: 3,

          enableDateRangeMetadataCues: true,
          enableEmsgMetadataCues: true,
          enableID3MetadataCues: true,
          enableWebVTT: true,
          enableIMSC1: true,
          enableCEA708Captions: true,
          stretchShortVideoTrack: false,
          maxAudioFramesDrift: 1,
          forceKeyFrameOnDiscontinuity: true,
          abrEwmaFastLive: 3.0,
          abrEwmaSlowLive: 9.0,
          abrEwmaFastVoD: 3.0,
          abrEwmaSlowVoD: 9.0,
          abrEwmaDefaultEstimate: 500000,
          abrBandWidthFactor: 0.95,
          abrBandWidthUpFactor: 0.7,
          abrMaxWithRealBitrate: false,
          maxStarvationDelay: 4,
          maxLoadingDelay: 4,
          minAutoBitrate: 0,
          emeEnabled: false,
          licenseXhrSetup: undefined,
          drmSystems: {},
          drmSystemOptions: {},
          cmcd: undefined,
        });
        Hls.DefaultConfig;
        hls.loadSource(selectedUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
        return () => {
          hls.destroy();
        };
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = selectedUrl;
        video.subtitles = subtitles;
        video.addEventListener("loadedmetadata", () => {
          video.play();
        });
      }
    }
  }, [episode, selectedUrl]);

  const handleQualityChange = (url) => {
    setSelectedUrl(url);
  };

  useEffect(() => {
    setSelectedUrl(
      episode.sources.find((video) => video.quality === "auto")?.url
    );
  }, [episode]);

  return (
    <div key={episode.id} className="w-full my-5">
      {selectedUrl && episode ? (
        <div className="justify-center flex ">
          <div className="w-full h-full lg:w-[720px] aspect-video border-white/30">
            <video
              ref={videoRef}
              controls
              className="video-js w-full h-full vjs-big-play-centered"
            >
              {episode.subtitles.map((subtitle) => (
                <track
                  key={subtitle.url}
                  src={subtitle.url}
                  kind="subtitles"
                  srcLang={subtitle.lang}
                  label={subtitle.lang}
                  default={subtitle.lang === "English"}
                />
              ))}
            </video>
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
