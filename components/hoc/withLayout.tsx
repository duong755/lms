import React from 'react';

import { NextPage } from 'next';
import { Cookies } from 'react-cookie';
import NextCookies from 'next-cookies';
import { makeStyles } from '@material-ui/core/styles';

import Header from '../header';
import Footer from '../footer';

const useLayoutStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  main: {
    flex: '1 1 auto'
  },
  footer: {
    flexShrink: 0
  }
}));

const withLayout = (Page: NextPage): NextPage => {
  const FullPageComponent: NextPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }) => {
    const layoutClasses = useLayoutStyles();

    return (
      <div className={layoutClasses.container}>
        <Header />
        <div className={layoutClasses.main}>
          <Page {...props} />
        </div>
        <div className={layoutClasses.footer}>
          <Footer />
        </div>
      </div>
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
