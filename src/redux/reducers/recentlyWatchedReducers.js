import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const recentlyWatchedSlice = createSlice({
  name: "recentlyWatched",
  initialState,
  reducers: {
    addEpisode: (state, action) => {
      const episode = action.payload;
      const tvid = episode.tvid;

      // Find the index of the TV show by its tvid
      const showIndex = state.items.findIndex((item) => item.tvid === tvid);

      if (showIndex === -1) {
        // TV show not found, add it to the beginning of the array
        state.items.unshift({ tvid, episode });
      } else {
        // TV show already exists, update its episode if it's different
        if (state.items[showIndex].episode.id !== episode.id) {
          // Move the existing TV show to the beginning of the array
          const existingShow = state.items.splice(showIndex, 1)[0];
          state.items.unshift(existingShow);
          state.items[0].episode = episode;
        }
      }
      // Remove the oldest TV show if there are more than 10 TV shows in the state
      if (state.items.length > 10) {
        state.items.pop();
      }

      // Save the state to the local storage
      localStorage.setItem("tvShowsState", JSON.stringify(state));
    },

    deleteEpisode: (state, action) => {
      const tvid = action.payload;

      // Find the index of the TV show by its tvid
      const showIndex = state.items.findIndex((item) => item.tvid === tvid);

      if (showIndex !== -1) {
        // Remove the TV show from the array
        state.items.splice(showIndex, 1);

        // Save the state to the local storage
        localStorage.setItem("tvShowsState", JSON.stringify(state));
      }
    },

    updateRecentlyWatched: (state, action) => {
      return action.payload;
    },
  },
});

export const { addEpisode, deleteEpisode, updateRecentlyWatched } =
  recentlyWatchedSlice.actions;
export default recentlyWatchedSlice.reducer;
