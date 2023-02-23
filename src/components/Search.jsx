import useDebounce from "@/hooks/useDebounce";
import Link from "next/link";
import { useEffect, useState } from "react";
import Spinner from "react-spinner-material";
const SearchPage = () => {
  const [val, setval] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [isloading, setisloading] = useState(true);
  const debouncedSearch = useDebounce(val, 500);
  useEffect(() => {
    async function fetchData() {
      setisloading(true);
      const data = await fetch(
        `https://spicyapi.vercel.app/meta/tmdb/${debouncedSearch}?page=1`
      ).then((res) => res.json());
      setSearchList(data.results);
      setisloading(false);
    }

    if (debouncedSearch) fetchData();
  }, [debouncedSearch]);

  return (
    <>
      <div className="form-control  place-content-center  ">
        <div className="flex place-self-center mt-20  w-11/12 mx-auto   ">
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
            <div className="  flex flex-wrap relative z-10 p-2 overflow-hidden  space-x-1 ">
              {searchList.map((e) =>
                e.type === "Movie" ? (
                  <Link key={e.id} href={`/movie/${e.id}`}>
                    <div class="relative w-32 h-52 lg:min-w-36 lg:min-h-60  overflow-hidden  rounded-lg">
                      <img class="object-cover w-full h-full" src={e.image} />
                      <div class="absolute inset-0 -bottom-1 bg-gradient-to-t flex flex-col-reverse from-[#0b090a] to-transparent p-3 lg:p-4">
                        <p class="text-[#f5f3f4]/50 text-xs lg:text-sm lowercase ">
                          <span className="capitalize"> {e.type}</span>
                        </p>
                        <p class=" text-md bottom-0 text-white lg:text-lg font-medium line-clamp-3">
                          {e.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <Link key={e.id} href={`/${e.id}`}>
                    <div class="relative w-32 h-52 lg:min-w-36 lg:min-h-60  overflow-hidden  rounded-lg">
                      <img class="object-cover w-full h-full" src={e.image} />
                      <div class="absolute inset-0 -bottom-1 bg-gradient-to-t flex flex-col-reverse from-[#0b090a] to-transparent p-3 lg:p-4">
                        <p class="text-[#f5f3f4]/50 text-xs lg:text-sm lowercase ">
                          <span className="capitalize"> {e.type}</span>
                        </p>
                        <p class=" text-md bottom-0 text-white lg:text-lg font-medium line-clamp-3">
                          {e.title}
                        </p>
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
