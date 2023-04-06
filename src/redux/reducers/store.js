import { configureStore } from "@reduxjs/toolkit";
import recentlyWatchedReducers from "./recentlyWatchedReducers";
import searchHistory from "./searchHistory";
const store = configureStore({
  reducer: {
    recentlyWatched: recentlyWatchedReducers,
    searchHistory: searchHistory,
  },
});
export default store;
