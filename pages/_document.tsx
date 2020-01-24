import debug from 'debug';

import NextDocument, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import { ServerStyleSheets } from '@material-ui/styles';

class CustomDocument extends NextDocument {
  static async getInitialProps(context: DocumentContext): Promise<DocumentInitialProps> {
    const stylesheets = new ServerStyleSheets();
    const originalRenderPage = context.renderPage;

    context.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => stylesheets.collect(<App {...props} />)
      });
    const initialProps = await NextDocument.getInitialProps(context);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {stylesheets.getStyleElement()}
        </>
      )
    };
  }

  render() {
    debug('NextDocument')('%s', 'begin');
    debug('NextDocument:__NEXT_DATA__')('%O', this.props.__NEXT_DATA__);
    debug('NextDocument')('%s', 'end');

    return (
      <Html>
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="shortcut icon" href="/images/favicon.ico" />
          <link rel="stylesheet" type="text/css" href="/css/nprogress.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/material-icons.css" />
          <link rel="stylesheet" type="text/css" href="/css/roboto.css" />
          <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/override.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
