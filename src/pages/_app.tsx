// import App from "next/app";
import { AppProps /*, AppContext */ } from 'next/app'
import { WebMidiProvider } from '../components/WebMidi'
import Layout from '../components/Layout'
import NoSSR from '../components/NoSSR'
import Head from 'next/head'
import '../styles/blueprint.scss'
import { WakeLockProvider } from '../components/Wakelock'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MIDI Tools</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NoSSR>
        <WebMidiProvider>
          <WakeLockProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WakeLockProvider>
        </WebMidiProvider>
      </NoSSR>
    </>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default MyApp
