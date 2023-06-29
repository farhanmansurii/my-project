import Link from "next/link";
import { useRouter } from "next/router";
import { BiArrowBack, BiHomeAlt2 } from "react-icons/bi";
import { Button } from "./Button";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="flex fixed mx-auto justify-center  z-30 w-full  items-center pt-2">
      <div>




     

      <Link href="/">
          <Button size='lg ' className=' py-3 px-4 '
        >
            Go to home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
