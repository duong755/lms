import React from 'react';

import { NextPage } from 'next';
import { Cookies } from 'react-cookie';
import NextCookies from 'next-cookies';

import Header from '../header';
import Footer from '../footer';

const withLayout = (Page: NextPage): NextPage => {
  const FullPageComponent: NextPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }) => {
    return (
      <>
        <Header />
        <Page {...props} />
        <Footer />
      </>
    );
  };

  FullPageComponent.getInitialProps = async (context) => {
    const theme = NextCookies(context)['theme'] || String(new Cookies().get('theme')) || 'light';
    let componentProps = {};

    if (Page.getInitialProps) {
      componentProps = await Page.getInitialProps(context);
    }

    return {
      theme: theme,
      ...componentProps
    };
  };

  return FullPageComponent;
};

export default withLayout;
