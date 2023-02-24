import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  episodes: [],
};

const recentlyWatchedSlice = createSlice({
  name: "recentlyWatched",
  initialState,
  reducers: {
    addRecentlyWatched: (state, action) => {
      const { item } = action.payload;
      const index = state.episodes.findIndex((ep) => ep.id === item.id);
      const newEpisodes = [
        item,
      ];
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          "recentlyWatchedEpisodes",
          JSON.stringify(newEpisodes),
          console.log('added'),
        );
      }
      return {
        episodes: newEpisodes,
      };
    },
    loadRecentlyWatchedEpisodes: (state) => {
      const storedEpisodes =
        JSON.parse(localStorage.getItem("recentlyWatchedEpisodes")) || [];
      return {
        episodes: storedEpisodes,
      };
    },
    removeRecentlyWatched: (state, action) => {
      const { id } = action.payload;
      const newEpisodes = state.episodes.filter((ep) => ep.id !== id);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          "recentlyWatchedEpisodes",
          JSON.stringify(newEpisodes)
        );
      }
      return {
        episodes: newEpisodes,
      };
    },
  },
});

export const {
  addRecentlyWatched,
  loadRecentlyWatchedEpisodes,
  removeRecentlyWatched,
} = recentlyWatchedSlice.actions;
export default recentlyWatchedSlice.reducer;
