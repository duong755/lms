import { NextPage } from 'next';
import Head from 'next/head';

import NextCookies from 'next-cookies';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Open LMS</title>
      </Head>
      <div>Home page</div>
    </>
  );
};

HomePage.getInitialProps = async (ctx) => {
  const cookies = NextCookies(ctx);
  console.group('page Home');
  console.log();
  console.log(ctx.req ? 'server' : 'browser');
  console.log('asPath', ctx.asPath);
  console.log('pathname', ctx.pathname);
  console.log('query', ctx.query);
  console.log('cookies', cookies);
  console.groupEnd();
  return {};
};

export default HomePage;
