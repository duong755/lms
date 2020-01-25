import React from 'react';

import { NextPage } from 'next';
import Head from 'next/head';

import withLayout from '../../components/hoc/withLayout';

const SignUpPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <div>Sign up</div>
    </>
  );
};

export default withLayout(SignUpPage);
