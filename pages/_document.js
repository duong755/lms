import Document, { Html, Head, Main, NextScript } from 'next/document';

class CustomDocument extends Document {
  constructor(props, context) {
    super(props, context);
  }

  static async getInitialProps(context) {
    const initialProps = await Document.getInitialProps(context);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="UTF-8" key="charSet" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" key="viewport" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" key="httpEquiv" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto&display=swap" />
          <link rel="stylesheet" type="text/css" href="/static/css/bootstrap-grid.min.css" />
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
