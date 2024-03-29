import { addSearchHistory } from "@/redux/reducers/searchHistory";
import Link from "next/link";
import { useDispatch } from "react-redux";

function MovieCard(props) {
  const { data } = props;
  const dispatch = useDispatch();
  return (
    <Link
      onClick={() => dispatch(addSearchHistory(data.title))}
      key={data.id}
      href={`/movie/${data.id}`}
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
              {new Date(data.release_date).getFullYear()}
            </p>

            <p className="text-xs text-white/40">
              <span className="text-red-500"> {props.type}</span> •{" "}
              {data.vote_average}⭐
            </p>
            <h3 className="text-white  text-sm lg:text-lg  ">{data.title}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default MovieCard;
