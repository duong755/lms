import Head from 'next/head';
import NextLink from 'next/link';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import withLayout from '../../../../../components/lib/withLayout';
import QuillEditor from '../../../../../components/QuillEditor';

function CreateExercise() {
  return (
    <>
      <Head>
        <title>CreateExercise</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} sm={10} md={8}>
              <Box mt={4} mb={5}>
                <Breadcrumbs separator="/" aria-label="breadcrumb">
                  <NextLink href="/">
                    <Link color="textPrimary" href="/">
                      <Typography variant="h5">Username</Typography>
                    </Link>
                  </NextLink>
                  <NextLink href="/">
                    <Link color="textPrimary" href="/">
                      <Typography variant="h5">Course Name</Typography>
                    </Link>
                  </NextLink>
                  <Typography color="primary" variant="h5">
                    Create Exercise
                  </Typography>
                </Breadcrumbs>
              </Box>
              <Box mb={3}>
                <Typography>Exercise Title</Typography>
                <TextField id="outlined-multiline-static" fullWidth defaultValue="" margin="none" variant="outlined" />
              </Box>
              <Box mb={3}>
                <Typography>Due Time</Typography>
                <TextField id="outlined-multiline-static" fullWidth defaultValue="" margin="none" variant="outlined" />
              </Box>
              <Box mb={3}>
                <Typography title="excercise-detail" noWrap>
                  Excercise Detail
                </Typography>
                <QuillEditor />
              </Box>
              <Box mb={3}>
                <Button variant="contained" color="primary">
                  Post
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default withLayout(CreateExercise);
