import Head from 'next/head';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Paper } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const exercise = {
  name: 'Exercise1',
  description:
    'Proin euismod orci eu lacus cursus, sed tincidunt risus auctor. Nam convallis tempor urna ac vestibulum. Integer porta, dolor vestibulum mattis posuere, risus sapien fermentum velit, vel ultricies nibh erat at erat. Mauris eros velit, rutrum in tristique eget, sollicitudin nec ipsum. Pellentesque non tincidunt magna. Aliquam nec turpis mauris. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis mattis tellus ut eros pharetra faucibus.'
};

<<<<<<< Updated upstream
import withLayout from '../components/lib/withLayout';

function Home() {
=======
function Exercise() {
>>>>>>> Stashed changes
  return (
    <>
      <Head>
        <title>Exercise</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item md={12} sm={12}>
              <Box pt={4} pb={1} pl={1}>
                <Typography title="Due-time" noWrap variant="h5" color="primary">
                  Due: October 31st 2019, 20:00
                </Typography>
              </Box>
              <Box m={1}>
                <Paper>
                  <Box p={2} pb={0}>
                    <Typography title="exercise-title" noWrap variant="h5">
                      {exercise.name}
                    </Typography>
                  </Box>
                  <Box p={2}>
                    <Typography title="exercise-description">{exercise.description}</Typography>
                  </Box>
                </Paper>
              </Box>
              <Box m={1}>
                <Paper>
                  <Box p={1.5}>
                    <Typography title="your-work" noWrap variant="h5">
                      Your work
                    </Typography>
                  </Box>
                  <Box p={1.5}>
                    <TextField
                      id="outlined-multiline-static"
                      multiline
                      rows="8"
                      fullWidth
                      defaultValue=""
                      margin="normal"
                      variant="outlined"
                    />
                  </Box>
                  <Box pl={1.5} pb={1.5}>
                    <Button variant="contained" color="primary">
                      Submit
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

<<<<<<< Updated upstream
export default withLayout(Home);
=======
export default Exercise;
>>>>>>> Stashed changes
