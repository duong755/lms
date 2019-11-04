import Head from 'next/head';
import NextLink from 'next/link';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import withLayout from '../../../../../components/lib/withLayout';
import QuillEditor from '../../../../../components/QuillEditor';

function EditExercise() {
  return (
    <>
      <Head>
        <title>EditExercise</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item md={12} sm={12}>
              <Box pl={1} mt={4} mb={5}>
                <Typography style={{ fontSize: '20px' }}>
                  <NextLink href="/">
                    <Link href="/">Username/</Link>
                  </NextLink>
                  <NextLink href="/">
                    <Link href="/">Course Name/</Link>
                  </NextLink>
                  <NextLink href="/">
                    <Link href="/">Edit Exercise</Link>
                  </NextLink>
                </Typography>
              </Box>
              <Box>
                <Box pl={1} pr={1}>
                  <Typography>Exercise Title</Typography>
                </Box>
                <Box pl={1} pr={1}>
                  <TextField
                    id="outlined-multiline-static"
                    fullWidth
                    defaultValue=""
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
                <Box pl={1} pr={1}>
                  <Typography>Due Time</Typography>
                </Box>
                <Box pl={1} pr={1}>
                  <TextField
                    id="outlined-multiline-static"
                    fullWidth
                    defaultValue=""
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
                <Box m={1}>
                  <Paper>
                    <Box p={1.5} pb={0}>
                      <Typography title="excercise-detail" noWrap variant="h5">
                        Excercise Detail
                      </Typography>
                    </Box>
                    <Box p={1.5}>
                      <QuillEditor></QuillEditor>
                    </Box>
                    <Box display="flex">
                      <Box pl={1.5} pb={1.5} width={150}>
                        <Button fullWidth variant="contained" color="primary">
                          Save
                        </Button>
                      </Box>
                      <Box pl={1.5} pb={1.5} width={150}>
                        <Button fullWidth variant="outlined" color="primary">
                          Cancel
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
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
