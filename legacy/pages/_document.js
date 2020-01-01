import Document, { Html, Head, Main, NextScript } from 'next/document';

import { ServerStyleSheets } from '@material-ui/styles';

class CustomDocument extends Document {
  constructor(props, context) {
    super(props, context);
  }

  static async getInitialProps(context) {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = context.renderPage;

    context.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />)
      });

    const initialProps = await Document.getInitialProps(context);

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: (
        <>
          {initialProps.styles}
          {sheets.getStyleElement()}
        </>
      )
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="UTF-8" key="charSet" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" key="viewport" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" key="httpEquiv" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="stylesheet" href="/css/roboto.css" />
          <link rel="stylesheet" href="/css/material-icons.css" />
          <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css" />
          <link rel="stylesheet" type="text/css" href="/css/nprogress.min.css" />
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
