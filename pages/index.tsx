import { NextPage } from 'next';
import Head from 'next/head';
import NextCookies from 'next-cookies';

import withLayout from '../components/hoc/withLayout';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Open LMS</title>
      </Head>
      <div>Home Page</div>
    </>
  );
};

HomePage.getInitialProps = async (ctx) => {
  const cookies = NextCookies(ctx);
  console.log(cookies);
  return {};
};

export default withLayout(HomePage);
