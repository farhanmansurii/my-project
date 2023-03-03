import useDebounce from "@/hooks/useDebounce";
import Link from "next/link";
import { useEffect, useState } from "react";
import Spinner from "react-spinner-material";
const SearchPage = () => {
  const [val, setval] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [filteredSearch, setfilteredSearch] = useState([]);
  const [isloading, setisloading] = useState(true);
  const debouncedSearch = useDebounce(val, 500);
  useEffect(() => {
    async function fetchData() {
      setisloading(true);
      const data = await fetch(
        `https://spicyapi.vercel.app/meta/tmdb/${debouncedSearch}?page=1`
      ).then((res) => res.json());
      setSearchList(data.results);
      console.log(data.results);
      setisloading(false);
    }

    if (debouncedSearch) fetchData();
  }, [debouncedSearch]);

  return (
    <>
      <div className="form-control  place-content-center  ">
        <div className="flex place-self-center mt-3  w-11/12 mx-auto   ">
          <input
            type="text"
            placeholder="
            
            Search for any  TV show / Movie"
            className=" placeholder:text-[#f5f3f4a5] bg-white/10 rounded-full px-4 py-4 h-fit w-full backdrop-blur-sm bg-secondary/20    outline-none border-secondary active:border-0"
            input={val}
            onChange={(e) => setval(e.target.value)}
          />
        </div>
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
