import { SWRConfig } from "swr";
import "moment/locale/ko";
import "../global.css";
import moment from "moment";

export default function App({ Component, pageProps }: any) {
  moment().locale("ko");
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
        refreshInterval: 1000,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
