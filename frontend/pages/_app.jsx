import Head from 'next/head';
import Script from 'next/script';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>AuraWood | Handcrafted Eco Timber Decor</title>
      </Head>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload" 
      />
      <Component {...pageProps} />
    </>
  );
}