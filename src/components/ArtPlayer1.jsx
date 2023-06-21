import React, { useEffect, useRef, useState, useCallback } from "react";
import Player from "@oplayer/core";
import OUI from '@oplayer/ui'
import OHls from '@oplayer/hls'
import { useMemo } from "react";
const plugins = [
  OUI(),

  OHls(),
]
const Enime1Player = ({ episode, getNextEpisode, deets, selectedEpisode }) => {
  const playerRef = useRef()
  const initialSource = episode.sources.find((source) => source.quality === "auto");
  const title = deets?.type === "Movie" ? deets.title : `S${selectedEpisode?.season}E${selectedEpisode?.episode}  ${selectedEpisode?.title}`;
  const poster = selectedEpisode?.img?.hd || selectedEpisode?.img?.mobile || deets.image;



  // #oplayer element has rendered, just create player
  useEffect(() => {
    playerRef.current =
      Player.make('#oplayer', { poster })
        .use(plugins)
        .create()

    return () => {
      playerRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    const oplayer = playerRef.current
    if (!oplayer) return
    const { menu } = oplayer.context.ui

    // Note: If sources has changed, we need to delete the old one before re-registering
    menu.unregister('Source')


    //play default id
    oplayer.changeSource(({ src: initialSource, poster, title })
    )
  }, [episode.sources, playerRef.current])

  return (
    // No loading is required, it is also the default
    <div id="oplayer" />
  )
}

export default Enime1Player;
