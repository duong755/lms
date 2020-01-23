import debug from 'debug';

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
  debug('NextPage')('%s', 'begin');
  debug('NextPage')('%s', 'HomePage');
  debug('NextPage:server')('%s', ctx.req ? 'true' : 'false');
  debug('NextPage:browser')('%s', ctx.req ? 'false' : 'true');
  debug('NextPage:req')('%O', ctx.req);
  debug('NextPage:res')('%O', ctx.res);
  debug('NextPage:pathname')('%O', ctx.pathname);
  debug('NextPage:asPath')('%O', ctx.asPath);
  debug('NextPage:query')('%O', ctx.query);
  debug('NextPage:err')('%O', ctx.err);
  debug('NextPage:cookies')('%O', cookies);
  debug('NextPage')('%s', 'end');
  return {};
};

export default HomePage;
