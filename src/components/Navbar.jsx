import Link from "next/link";
import { useRouter } from "next/router";
import { BiArrowBack, BiHomeAlt2 } from "react-icons/bi";
import { Button } from "./Button";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="flex fixed mx-auto   flex-row justify-between z-30 w-full  items-center p-4">
      <div></div>
      <div>
        <Button size="" className=" w-10 h-10 rounded-full p-3  ">
          <Link href="/">
            <svg
              viewBox="0 0 512 512"
              fill="currentColor"
              height="1em"
              width="1em">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={48}
                d="M244 400L100 256l144-144M120 256h292"
              />
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
