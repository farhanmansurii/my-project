import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'searchHistory';

const loadState = () => {
  try
  {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null)
    {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error)
  {
    console.error('Failed to load state from local storage:', error);
    return undefined;
  }
};

const saveState = (state) => {
  try
  {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error)
  {
    console.error('Failed to save state to local storage:', error);
  }
};

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
        saveState(state);
      }
    },
    deleteSearchHistory: (state, action) => {
      const searchTerm = action.payload.trim().toLowerCase();
      state.searchHistory = state.searchHistory.filter((term) => term !== searchTerm);
      saveState(state);
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { addSearchHistory, deleteSearchHistory, clearSearchHistory } = searchHistorySlice.actions;
export default searchHistorySlice.reducer;

export const initializeSearchHistoryState = (serverState) => {
  const clientState = loadState() || initialState;
  return { ...clientState, ...serverState };
};
