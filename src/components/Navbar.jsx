import Link from "next/link";
import { useRouter } from "next/router";
import { BiArrowBack, BiHomeAlt2 } from "react-icons/bi";

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="flex justify-between items-center pt-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="p-3 rounded-full  mx-5  my-3 bg-white text-black hover:bg-gray-200 transition duration-150"
      >
        <BiArrowBack className="w-6 h-6 " />
      </button>

      <Link href="/" className="text-2xl font-semibold text-gray-700 hover:text-gray-900 transition duration-150">

      </Link>

      <Link href="/">
        <button
          type="button"
          className="p-3 rounded-full mx-5  my-3  bg-white text-black hover:bg-gray-200 transition duration-150"
        >
          <BiHomeAlt2 className="w-6 h-6" />
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;
