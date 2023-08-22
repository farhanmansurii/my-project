import useDebounce from "@/hooks/useDebounce";
import {
  addSearchHistory,
  clearSearchHistory,
  deleteSearchHistory,
  updateSearchHistory,
} from "@/redux/reducers/searchHistory";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-spinner-material";
import { Input } from "./ui/input";
import { Button } from "./Button";
import MovieCard from "./Card";
import TVCard from "./TVCard";
import axios from "axios";

const SearchPage = () => {
  const dispatch = useDispatch();
  const searchHistory = useSelector(
    (state) => state.searchHistory.searchHistory
  );
  const [val, setVal] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(val, 1000);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const url = `https://api.themoviedb.org/3/search/movie?api_key=6e075d0e14c850ba87d0eb8783ff1c59&query=${debouncedSearch}`;
      console.log(url);
      const data = await axios.get(url);
      setSearchList(data.data.results);
      console.log(
        "🚀 ~ file: Search.jsx:36 ~ fetchData ~ data.data.results:",
        data.data.results
      );
      setIsLoading(false);
    }

    if (debouncedSearch) {
      fetchData();
    }
  }, [debouncedSearch]);

  const handleRemoveChip = (term) => {
    dispatch(deleteSearchHistory(term));
  };

  useEffect(() => {
    dispatch(updateSearchHistory());
  }, [dispatch]);

  return (
    <>
      <div className="form-control mt-10 place-content-center">
        <div className="flex place-self-center mt-3 items-center w-11/12 mx-auto">
          <Input
            type="text"
            placeholder="Search for a movie or TV show"
            value={val}
            className="rounded-xl "
            onChange={(e) => setVal(e.target.value)}
          />
          {val.length > 0 && (
            <Button className="h-14 rounded-xl ml-3" onClick={() => setVal("")}>
              CLEAR
            </Button>
          )}
        </div>
        {searchHistory.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2 w-11/12 mx-auto">
            <Button variant="chip">
              <span className="cursor-pointer">Clear All</span>
              <button
                className="ml-2"
                onClick={() => dispatch(clearSearchHistory())}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  viewBox="0 0 20 20"
                  fill="white"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.293 3.293a1 1 0 011.414 1.414L5.414 18.414a1 1 0 01-1.414-1.414L16.293 3.293z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M3.707 3.293a1 1 0 011.414 0L18.707 16.586a1 1 0 01-1.414 1.414L3.707 4.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </Button>
            {searchHistory.map((term, index) => (
              <Button variant="chip" key={index}>
                <span className="cursor-pointer" onClick={() => setVal(term)}>
                  {term}
                </span>
                <button
                  className="ml-2 text-gray-500"
                  onClick={() => handleRemoveChip(term)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 20 20"
                    fill="white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.293 3.293a1 1 0 011.414 1.414L5.414 18.414a1 1 0 01-1.414-1.414L16.293 3.293z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M3.707 3.293a1 1 0 011.414 0L18.707 16.586a1 1 0 01-1.414 1.414L3.707 4.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="flex p-2 space-x-2">
        {val === "" ? (
          ""
        ) : !isLoading ? (
          <div className="flex overflow-x-scroll p-2 space-x-4 scrollbar-hide w-11/12 mx-auto ">
            {searchList.map((e, i) => (
              <MovieCard key={i} data={e} type={"Movie"} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-48 lg:h-56 w-11/12 mx-auto">
            <Spinner
              size={40}
              spinnerColor={"white"}
              spinnerWidth={2}
              visible={true}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
