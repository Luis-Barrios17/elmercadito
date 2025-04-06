import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "../theme"; // Asegúrate de que esté exportado correctamente
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext"; // Asegúrate de que esté exportado correctamente
import { GlobalProvider } from "../context/GlobalContext"; // Asegúrate de que esté exportado correctamente
import createEmotionCache from "../utils/createEmotionCache"; // Asegúrate de que esté exportado correctamente

// Crea el cache de Emotion para el cliente
const clientSideEmotionCache = createEmotionCache();

function HikariTech({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
  return (
    <CacheProvider value={emotionCache}>
      <GlobalProvider>
        <AuthProvider>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>HikariTech</title>
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </AuthProvider>
      </GlobalProvider>
    </CacheProvider>
  );
}

HikariTech.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};

export default HikariTech;