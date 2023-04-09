import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recentlyWatched: [],
  favoriteMovies: []
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
        state.recentlyWatched.unshift({ tvid: episode.tvid, episode });
      } else
      {
        if (state.recentlyWatched[existingShowIndex].episode.id !== episode.id)
        {
          state.recentlyWatched.splice(existingShowIndex, 1);
          state.recentlyWatched.unshift({ tvid: episode.tvid, episode });
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
      const { recentlyWatched } = action.payload ?? {};
      if (recentlyWatched !== undefined)
      {
        return { ...state, recentlyWatched };
      }
      return state;
    },
    updateFavoriteMovies: (state, action) => {
      const { favoriteMovies } = action.payload ?? {};
      if (favoriteMovies !== undefined)
      {
        return { ...state, favoriteMovies };
      }
      return state;
    }
  }
});

export const {
  addEpisode,
  deleteEpisode,
  addFavoriteMovie,
  deleteFavoriteMovie,
  updateRecentlyWatched,
  updateFavoriteMovies
} = recentlyWatchedSlice.actions;

export default recentlyWatchedSlice.reducer;
