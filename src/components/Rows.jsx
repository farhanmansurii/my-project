import React from "react";
import Card from "./Card";
import MovieCard from "./Card";
import TVCard from "./TVCard";

export default function Rows(props) {
  return (
    <div className="flex my-5 gap-3 flex-col w-11/12 mx-auto">
      <div className=" text-3xl mx-2">{props.title}</div>
      <div className="flex overflow-x-scroll p-2 space-x-4 scrollbar-hide  ">
        {props.data.map((e) =>
          props.type === "movie" ? (
            <MovieCard key={e.id} data={e} type={props.type} />
          ) : (
            <TVCard key={e.id} data={e} type={props.type} />
          )
        )}
      </div>
    </div>
  );
}
