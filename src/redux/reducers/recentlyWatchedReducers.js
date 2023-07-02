import { createSlice } from "@reduxjs/toolkit";
import produce from "immer";

const initialState = {
  recentlyWatched: [],
  favoriteMovies: [],
};

const recentlyWatchedSlice = createSlice({
  name: "recentlyWatched",
  initialState,
  reducers: {
    addEpisode: (state, action) => {
      const episode = action.payload;
      const existingShowIndex = state.recentlyWatched.findIndex((item) => item.tvid === episode.tvid);

      if (existingShowIndex === -1)
      {
        state.recentlyWatched.unshift({ tvid: episode.tvid, episode, watchTime: 0 });
      } else
      {
        if (state.recentlyWatched[existingShowIndex].episode.id !== episode.id)
        {
          state.recentlyWatched.splice(existingShowIndex, 1);
          state.recentlyWatched.unshift({ tvid: episode.tvid, episode, watchTime: 0 });
        } else
        {
          state.recentlyWatched[existingShowIndex].watchTime = 0; // Update watch time for existing episode
        }
      }

      if (state.recentlyWatched.length > 10)
      {
        state.recentlyWatched.pop();
      }

      localStorage.setItem("recentlyWatchedTvShow", JSON.stringify(state.recentlyWatched));
    },


    deleteEpisode: (state, action) => {
      const tvid = action.payload;
      state.recentlyWatched = state.recentlyWatched.filter((item) => item.tvid !== tvid);
      localStorage.setItem("recentlyWatchedTvShow", JSON.stringify(state.recentlyWatched));
    },
    addFavoriteMovie: (state, action) => {
      const movie = action.payload;
      const existingMovieIndex = state.favoriteMovies.findIndex((item) => item.movieid === movie.movieid);
      if (existingMovieIndex === -1)
      {
        state.favoriteMovies.unshift(movie);
      }
      localStorage.setItem("favoriteMovies", JSON.stringify(state.favoriteMovies));
    },
    deleteFavoriteMovie: (state, action) => {
      const movieId = action.payload;
      state.favoriteMovies = state.favoriteMovies.filter((item) => item.movieid !== movieId);
      localStorage.setItem("favoriteMovies", JSON.stringify(state.favoriteMovies));
    },
    updateRecentlyWatched: (state, action) => {
      const recentlyWatched = action.payload;
      if (recentlyWatched)
      {
        return { ...state, recentlyWatched: recentlyWatched };
      }
      return state;
    },
    updateFavoriteMovies: (state, action) => {
      const favoriteMovies = action.payload;
      if (favoriteMovies)
      {
        return { ...state, favoriteMovies: favoriteMovies };
      }
      return state;
    }
    ,
    updateWatchTime: (state, action) => {
      const { tvid, watchTime } = action.payload;

      const updatedRecentlyWatched = state.recentlyWatched.map((item) => {


        return {
          ...item,
          watchTime: watchTime,
        };

      });

      state.recentlyWatched = updatedRecentlyWatched; // Update state with the updated recently watched array

      localStorage.setItem("recentlyWatchedTvShow", JSON.stringify(state.recentlyWatched));
    },



  },
});

export const {
  addEpisode,
  deleteEpisode,
  addFavoriteMovie,
  deleteFavoriteMovie,
  updateRecentlyWatched,
  updateFavoriteMovies,
  updateWatchTime
} = recentlyWatchedSlice.actions;

export default recentlyWatchedSlice.reducer;
