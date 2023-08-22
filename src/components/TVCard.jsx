import { addSearchHistory } from "@/redux/reducers/searchHistory";
import Link from "next/link";
import { useDispatch } from "react-redux";

function TVCard(props) {
  const { data } = props;
  return (
    <Link
      key={data.id}
      href={`/${data.id}`}
    >
      <div className="flex-none w-32 lg:w-40">
        <div className="relative">
          <img
            className="object-cover w-full h-48 lg:h-56 rounded shadow-md transform transition-all duration-500"
            src={`https://image.tmdb.org/t/p/w300${data.poster_path}`}
            alt={data.title}
          />
          <div className="absolute flex flex-col-reverse inset-0 p-2 bg-gradient-to-t from-black w-full ">
            <p className="text-xs text-white/40">
              {new Date(data.first_air_date).getFullYear() || "Upcoming"}
            </p>

            <p className="text-xs text-white/40">
              <span className="text-blue-500"> {props.type}</span> •{" "}
              {data.vote_average}⭐
            </p>
            <h3 className="text-white  text-sm lg:text-lg ">{data.name}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default TVCard;
