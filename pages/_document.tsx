import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Font: Montserrat */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased font-montserrat">
        <Main />
        <NextScript />
        <div className="absolute bottom-0 ">
          <img
            src="/Groups.png"
            alt="Descriptive text"
            className="w-screen h-[100px] "
          />
        </div>
      </body>
    </Html>
  );
}
