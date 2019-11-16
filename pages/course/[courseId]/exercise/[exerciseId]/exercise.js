/* eslint-disable prettier/prettier */
import Head from 'next/head';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import withLayout from '../../../../../components/lib/withLayout';
import MuiRte from '../../../../../components/MuiRte';

const exercise = {
  name: 'Exercise1',
  description:
    'Proin euismod orci eu lacus cursus, sed tincidunt risus auctor. Nam convallis tempor urna ac vestibulum. Integer porta, dolor vestibulum mattis posuere, risus sapien fermentum velit, vel ultricies nibh erat at erat. Mauris eros velit, rutrum in tristique eget, sollicitudin nec ipsum. Pellentesque non tincidunt magna. Aliquam nec turpis mauris. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis mattis tellus ut eros pharetra faucibus.'
};

function Exercise() {
  return (
    <>
      <Head>
        <title>Exercise</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item md={12} sm={12}>
              <Box pt={4} pb={1}>
                <Typography title="Due-time" noWrap color="primary">
                  Due: October 31st 2019, 20:00
                </Typography>
              </Box>
              <Box mb={3}>
                <Paper>
                  <Box p={2} pb={0}>
                    <Typography title="exercise-title" noWrap variant="h5">
                      <strong>{exercise.name}</strong>
                    </Typography>
                  </Box>
                  <Box p={2}>
                    <Typography title="exercise-description">{exercise.description}</Typography>
                  </Box>
                </Paper>
              </Box>
              <Divider />
              <Box mt={3}>
                <Paper>
                  <Box p={2}>
                    <Box pb={2}>
                      <Typography title="your-work" noWrap variant="h5">
                        <strong>Your work</strong>
                      </Typography>
                    </Box>
                    <MuiRte />
                    <Box pt={2}>
                      <Button variant="contained" color="primary">
                        Submit
                      </Button>
                    </Box>
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

export default withLayout(Exercise);
