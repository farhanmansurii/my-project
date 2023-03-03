import store from "@/redux/reducers/store";
import "@/styles/globals.css";
import Link from "next/link";
import NextNProgress from "nextjs-progressbar";
import { BiHomeAlt2 } from "react-icons/bi";
import { Provider } from "react-redux";
export default function App({ Component, pageProps }) {
  return (
    <>
      {" "}
      <Provider store={store}>
        <NextNProgress
          color="#808080"
          startPosition={0.3}
          stopDelayMs={200}
          height={5}
          showOnShallow={true}
          options={{
            easing: "ease",
            speed: 500,
            trickle: false,
            showSpinner: false,
          }}
        />
        <div className="fixed z-50 bottom-10 left-0 right-0 flex justify-center">
          <div className="mx-auto">
            <Link href="/">
              <BiHomeAlt2 className=" p-3 h-14 w-14 rounded-full border-4  text-white border-gray-200/40" />
            </Link>
          </div>
        </div>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
