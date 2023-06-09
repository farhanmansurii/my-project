import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'searchHistory';

const MAX_SEARCH_HISTORY_LENGTH = 5;
const initialState = {
  searchHistory: [],
};

const searchHistorySlice = createSlice({
  name: 'searchHistory',
  initialState,
  reducers: {
    addSearchHistory: (state, action) => {
      const searchTerm = action.payload.trim().toLowerCase();
      if (!state.searchHistory.includes(searchTerm))
      {
        state.searchHistory.unshift(searchTerm);
        if (state.searchHistory.length > MAX_SEARCH_HISTORY_LENGTH)
        {
          state.searchHistory.pop();
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.searchHistory));
      }
    },
    deleteSearchHistory: (state, action) => {
      const searchTerm = action.payload.trim().toLowerCase();
      state.searchHistory = state.searchHistory.filter((term) => term !== searchTerm);

    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
      localStorage.removeItem(STORAGE_KEY);
    },
    updateSearchHistory: (state) => {
      const searchHistoryFromStorage = localStorage.getItem(STORAGE_KEY);
      if (searchHistoryFromStorage)
      {
        state.searchHistory = JSON.parse(searchHistoryFromStorage);
      }
    },
  },
});

export const { addSearchHistory, deleteSearchHistory, updateSearchHistory, clearSearchHistory } = searchHistorySlice.actions;
export default searchHistorySlice.reducer;


