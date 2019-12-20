import Head from 'next/head';
// import NextLink from 'next/link';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import withLayout from '../../components/lib/withLayout';

/**
 * @type {React.FunctionComponent}
 */
const SearchPage = (props) => {
  return ((
    <>
      <Head>
        <title>Search Results</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Typography {...props}>Search results</Typography>
        </Container>
      </Box>
    </>
  ));
};

SearchPage.getInitialProps = async (context) => {
  console.log(context.query);
  return {};
};

export default withLayout(SearchPage);
