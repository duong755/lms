import React from 'react';

import { NextPage } from 'next';
import Head from 'next/head';

import withLayout from '../../components/hoc/withLayout';

const SignInPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign in to OpenLMS</title>
      </Head>
      <div>Sign in</div>
    </>
  );
};

export default withLayout(SignInPage);
