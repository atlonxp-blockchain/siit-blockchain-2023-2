import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { ChakraProvider } from "@chakra-ui/react";
import "../styles/globals.css";
import Layout from '../pages/Layout';

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "mumbai";

interface CustomPageProps {

}

function MyApp({ Component, pageProps }: AppProps<CustomPageProps>) {
  return (
    <ThirdwebProvider 
      activeChain={activeChain}
    >
      <ChakraProvider>
        <Layout>
        <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;