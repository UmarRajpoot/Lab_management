import React, { useEffect } from "react";
import Head from "next/head";

import "antd/dist/antd.css";
import "../styles/global.css";
import Wrapper from "../Components/Wrapper";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import RootReducer from "../Store/RootReducer";
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }) {
  const store = createStore(RootReducer, applyMiddleware(thunk));
  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Provider store={store}>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </Provider>
    </React.Fragment>
  );
}

export default MyApp;
