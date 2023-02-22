import useDebounce from "@/hooks/useDebounce";
import Link from "next/link";
import { useEffect, useState } from "react";
import Card from "./Card";
const SearchPage = () => {
  const [val, setval] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [isloading, setisloading] = useState(true);
  const debouncedSearch = useDebounce(val, 500);
  useEffect(() => {
    async function fetchData() {
      setisloading(true);
      const data = await fetch(
        `https://api.consumet.org/movies/flixhq/${debouncedSearch}?page=1`
      ).then((res) => res.json());
      setSearchList(data.results);
      setisloading(false);
    }

    if (debouncedSearch) fetchData();
  }, [debouncedSearch]);

  return (
    <>
      <div className="form-control  place-content-center">
        <div className="flex place-self-center mt-4  w-11/12 mx-auto   ">
          <input
            type="text"
            placeholder="
            
            Search for any Anime TV / Movie"
            className=" placeholder:text-[#f5f3f4a5] bg-red-500/20 rounded-lg px-4 py-2 w-full backdrop-blur-sm bg-secondary/20    outline-none border-secondary active:border-0"
            input={val}
            onChange={(e) => setval(e.target.value)}
          />
        </div>
        <div className=" flex l p-2 scrollbar-hide space-x-2 ">
          {val === "" ? (
            ""
          ) : !isloading ? (
            <div className="  flex flex-wrap relative z-10 p-2 overflow-hidden  space-x-1 ">
              {searchList.map((e) => (
                <Link key={e.id} as={e.id} href={`/${e.id}`}>
                  <Card title={e.title} type={e.type} image={e.image} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="w-fit h-[200px] my-auto ease-in-out duration-200 grid justify-center mx-auto place-content-center">
              <img
                className="w-12"
                src="https://media.tenor.com/5nON1L6KUqcAAAAM/sharingan-naruto.gif"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage;
