import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

const CustomHead = props => {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <link rel="shortcut icon" href="/static/favicon.ico" />
      {props.children}
    </Head>
  );
};

CustomHead.propTypes = {
  children: PropTypes.node
};

export default CustomHead;
