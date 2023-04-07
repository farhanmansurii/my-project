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

        <Component {...pageProps} />
      </Provider>
    </>
  );
}
