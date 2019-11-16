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
import MuiRte from '../../../../../components/MuiRte';

function EditExercise() {
  return (
    <>
      <Head>
        <title>EditExercise</title>
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
                    Edit Exercise
                  </Typography>
                </Breadcrumbs>
              </Box>
              <Box mb={3}>
                <Typography>
                  <strong>Exercise Title</strong>
                </Typography>
                <TextField id="outlined-multiline-static" fullWidth defaultValue="" margin="none" variant="outlined" />
              </Box>
              <Box mb={3}>
                <Typography>
                  <strong>Due Time</strong>
                </Typography>
                <TextField id="outlined-multiline-static" fullWidth defaultValue="" margin="none" variant="outlined" />
              </Box>
              <Box mb={3}>
                <Typography title="exercise-detail" noWrap>
                  <strong>Exercise Detail</strong>
                </Typography>
                <MuiRte />
              </Box>
              <Box display="flex" mb={3}>
                <Box pb={1.5}>
                  <Button variant="contained" color="primary">
                    Save
                  </Button>
                </Box>
                <Box pl={1.5}>
                  <Button variant="outlined" color="primary">
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default withLayout(EditExercise);
