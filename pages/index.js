import Head from 'next/head';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import withLayout from '../components/lib/withLayout';

function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Box textAlign="center">
            <Typography component="h1">Welcome to OpenLMS</Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default withLayout(Home);
