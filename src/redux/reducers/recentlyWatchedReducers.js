import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  movies: []
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

      if (showIndex === -1)
      {
        // TV show not found, add it to the beginning of the array
        const updatedItems = [{ tvid, episode }, ...state.items];
        state.items = updatedItems;
      } else
      {
        // TV show already exists, update its episode if it's different
        if (state.items[showIndex].episode.id !== episode.id)
        {
          const updatedItems = [
            { tvid, episode },
            ...state.items.slice(0, showIndex),
            ...state.items.slice(showIndex + 1),
          ];
          state.items = updatedItems;
        }
      }

      // Remove the oldest TV show if there are more than 10 TV shows in the state
      if (state.items.length > 10)
      {
        state.items = state.items.slice(0, 10);
      }

      // Save the state to the local storage
      localStorage.setItem("recentlyWatched", JSON.stringify(state));
    },
    deleteEpisode: (state, action) => {
      const tvid = action.payload;

      state.items = state.items.filter((item) => item.tvid !== tvid);

      // Save the state to the local storage
      localStorage.setItem("recentlyWatched", JSON.stringify(state));
    },

    addFavoriteMovie: (state, action) => {
      const isDuplicate = state.movies?.some(movie => movie.movieid === action.payload.movieid);

      if (isDuplicate)
      {
        return state;
      }

      const newState = {
        ...state,
        movies: [action.payload, ...state.movies]
      };

      // Save the state to the local storage
      localStorage.setItem("recentlyWatched", JSON.stringify(newState));

      return newState;
    },

    deleteFavoriteMovie: (state, action) => {
      const id = action.payload;
      const index = state.movies.findIndex(movie => movie.movieid === id);

      if (index !== -1)
      {
        state.movies.splice(index, 1);
      }

      // Save the state to the local storage
      localStorage.setItem("recentlyWatched", JSON.stringify(state));
    },

    updateRecentlyWatched: (state, action) => {
      const { items, movies } = action.payload;

      // Check if items or movies are defined before updating state
      if (items !== undefined && movies !== undefined)
      {
        return { items, movies };
      } else if (items !== undefined)
      {
        return { ...state, items };
      } else if (movies !== undefined)
      {
        return { ...state, movies };
      } else
      {
        return state;
      }
    },

    updateFavoriteMovies: (state, action) => {
      const movies = action.payload;

      // Check if movies are defined before updating state
      if (movies !== undefined)
      {
        return { ...state, movies };
      } else
      {
        return state;
      }
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
