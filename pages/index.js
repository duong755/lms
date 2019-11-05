import Head from 'next/head';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const exercise = {
  name: 'Exercise1',
  description:
    'Proin euismod orci eu lacus cursus, sed tincidunt risus auctor. Nam convallis tempor urna ac vestibulum. Integer porta, dolor vestibulum mattis posuere, risus sapien fermentum velit, vel ultricies nibh erat at erat. Mauris eros velit, rutrum in tristique eget, sollicitudin nec ipsum. Pellentesque non tincidunt magna. Aliquam nec turpis mauris. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis mattis tellus ut eros pharetra faucibus.'
};

import withLayout from '../components/lib/withLayout';

function Home() {
  return (
    <>
      <Head>
        <title>Exercise</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container spacing={1}>
            <Grid item md={3} sm={12}>
              <Grid container>
                <Grid item md={12} sm={4} xs={3}>
                  <Box>
                    <img src="/favicon.ico" style={{ width: '100%' }} />
                  </Box>
                </Grid>
                <Grid item md={12} sm={8} xs={9}>
                  <Typography title="Ngo Quang Duong" noWrap variant="h5">
                    Ngo Quang Duong
                  </Typography>
                  <Typography title="QuangDuong120198" noWrap variant="h6">
                    QuangDuong120198
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <Box className="d-flex">
                    <Icon>edit_location</Icon>
                    <Typography noWrap className="pl-2">
                      Hai Ba Trung, Ha Noi, Viet Nam
                    </Typography>
                  </Box>
                  <Box p={2}>
                    <Typography title="exercise-description">{exercise.description}</Typography>
                  </Box>
                </Grid>
              </Grid>
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
                  <Box pl={1.5} pb={1.5} width={150}>
                    <Button fullWidth variant="contained" color="primary">
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

export default withLayout(Home);
