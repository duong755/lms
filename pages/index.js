import Head from 'next/head';
import NextLink from 'next/link';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import withLayout from '../components/lib/withLayout';

function Home() {
  return (
    <>
      <Head>
        <title>OpenLMS</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Box pt={3} display="flex" flexDirection="row" justifyContent="center" alignItems="center">
            <Typography variant="h4">Welcome to OpenLMS</Typography>
            <NextLink href="/signup">
              <a href="/signup">Sign up</a>
            </NextLink>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default withLayout(Home);
