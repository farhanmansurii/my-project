import Link from "next/link";
import { useRouter } from "next/router";
import { BiArrowBack, BiHomeAlt2 } from "react-icons/bi";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="flex fixed z-30 lg:w-10/12 mx-auto my-5 items-center pt-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="p-3 rounded-full  mx-5  my-3 hover:text-black bg-white/20 text-white hover:bg-gray-200 transition duration-150"
      >
        <BiArrowBack className="w-6 h-6 " /> 
      </button>

     

      <Link href="/">
        <button
          type="button"
          className="p-3 rounded-full  my-3 hover:text-black bg-white/20 text-white hover:bg-gray-200 transition duration-150"
        >
          <BiHomeAlt2 className="w-6 h-6" />
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;
