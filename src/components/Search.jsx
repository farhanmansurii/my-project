import useDebounce from "@/hooks/useDebounce";
import { addSearchHistory, clearSearchHistory, deleteSearchHistory, updateSearchHistory } from "@/redux/reducers/searchHistory";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiSearchAlt, BiSearchAlt2 } from "react-icons/bi";
import { MdClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-spinner-material";
const SearchPage = () => {
  const dispatch = useDispatch();
  const searchHistory = useSelector((state) => state.searchHistory.searchHistory);
  const [val, setval] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [isloading, setisloading] = useState(true);
  const debouncedSearch = useDebounce(val, 1000);
  useEffect(() => {
    async function fetchData() {
      if (debouncedSearch.split('').length > 3)
      {

        dispatch(addSearchHistory(debouncedSearch));
      }
      setisloading(true);
      const data = await fetch(
        `https://spicyapi.vercel.app/meta/tmdb/${debouncedSearch}?page=1`
      ).then((res) => res.json());
      setSearchList(data.results);

      setisloading(false);
    }

    if (debouncedSearch) fetchData();
  }, [debouncedSearch]);
  const handleRemoveChip = (term) => {
    dispatch(deleteSearchHistory(term));
  };


  useEffect(() => {
    dispatch(updateSearchHistory());
  }, [dispatch]);
  return (
    <>
      <div className="form-control  place-content-center  ">
        <div className="flex place-self-center mt-3 items-center  w-11/12 mx-auto">
          <div className="relative flex items-center w-full gap-1 pr-5 mt-4 border rounded-md group focus-within:border-neutral-400 bg-neutral-800 focus-within:outline-4 focus-within:outline-neutral-200 border-neutral-600">

            <input
              type="text"
              placeholder="Search for a movie or TV show"
              value={val}
              onChange={(e) => setval(e.target.value)}

              className="w-full px-4 py-3 bg-transparent rounded-md text-neutral-50 group focus:outline-none" />
            {val.length > 0 && (
              <button
                onClick={() => setval('')}
                className="inline-block px-2 py-1 text-xs rounded-md bg-neutral-700 text-neutral-50"   >
                CLEAR
              </button>
            )}

          </div>
        </div>

        {searchHistory.length > 0 && <div className="flex gap-4  flex-wrap mt-2 w-11/12 mx-auto">
          <div className="px-3 py-1 text-neutral-50 bg-neutral-900 rounded-md"> <span className="cursor-pointer" onClick={() => setval(term)}>
            Recently Searched
          </span>
            <button className="ml-2 text-gray-500" onClick={() => dispatch(clearSearchHistory())}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="white">
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
            </button></div>
          {searchHistory.map((term, index) => (
            <div key={index} className="px-3 py-1 text-neutral-50 border-neutral-400 border bg-neutral-800 rounded-md">
              <span className="cursor-pointer" onClick={() => setval(term)}>
                {term}
              </span>
              <button className="ml-2 text-gray-500" onClick={() => handleRemoveChip(term)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="white">
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
            </div>
          ))}
        </div>}
        <div className=" flex l p-2 scrollbar-hide space-x-2 ">
          {val === "" ? (
            ""
          ) : !isloading ? (
            <div className="flex overflow-x-scroll p-2 space-x-4 scrollbar-hide w-11/12 mx-auto ">
              {searchList
                .filter((e) => e.rating > 3)
                .map((e) =>
                  e.type === "Movie"
                    ? e.releaseDate > 1970 && (
                        <Link key={e.id} href={`/movie/${e.id}`}>
                          <div className="flex-none w-32 lg:w-40">
                            <div className="relative">
                              <img
                                className="object-cover w-full h-48 lg:h-56 rounded-lg shadow-md transform transition-all duration-500"
                                src={e.image}
                                alt={e.title}
                              />
                              <div className="absolute flex flex-col-reverse inset-0 p-2 bg-gradient-to-t from-black w-full ">
                                <p className="text-xs text-white/40">
                                  {e.releaseDate}
                                </p>
                                <p className="text-xs text-white/40">
                                  <span className="text-red-500">
                                    {" "}
                                    {e.type}
                                  </span>{" "}
                                  • {e.rating.toFixed(1)}⭐
                                </p>
                                <h3 className="text-white  text-sm lg:text-lg  ">
                                  {e.title}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    : e.releaseDate > 1970 && (
                        <Link key={e.id} href={`/${e.id}`}>
                          <div className="flex-none w-32 lg:w-40">
                            <div className="relative">
                              <img
                                className="object-cover w-full h-48 lg:h-56 rounded-lg shadow-md transform transition-all duration-500"
                                src={e.image}
                                alt={e.title}
                              />
                              <div className="absolute flex flex-col-reverse inset-0 p-2 bg-gradient-to-t from-black w-full ">
                                <p className="text-xs text-white/40">
                                  {e.releaseDate}
                                </p>
                                <p className="text-xs text-white/40">
                                  <span className="text-blue-500">
                                    {" "}
                                    {e.type}
                                  </span>{" "}
                                  • {e.rating.toFixed(1)}⭐
                                </p>
                                <h3 className="text-white  text-sm lg:text-lg  ">
                                  {e.title}
                                </h3>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                )}
            </div>
          ) : (
            <div className="w-fit h-[200px] my-auto ease-in-out duration-200 grid justify-center mx-auto place-content-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
