import PropTypes from 'prop-types';
import Head from 'next/head';
import dayjs from 'dayjs';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import withLayout from '../../../../../../../components/lib/withLayout';
import MuiRte from '../../../../../../../components/MuiRte';
import absURL from '../../../../../../../components/helpers/URL';

function Exercise(props) {
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
                  Due: {String(dayjs(new Date(props.exercise.deadline)).format('DD-MM-YYYY hh:mm A'))}
                </Typography>
              </Box>
              <Box mb={3}>
                <Paper>
                  <Box p={2} pb={0}>
                    <Typography title="exercise-title" noWrap variant="h5">
                      <strong>{props.exercise.title}</strong>
                    </Typography>
                  </Box>
                  <Box p={2}>
                    <div dangerouslySetInnerHTML={{ __html: props.exercise.content }}></div>
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

Exercise.getInitialProps = async (context) => {
  const { userId, courseId, exerciseId } = context.query;

  try {
    const response = await fetch(absURL(`/api/user/${userId}/course/${courseId}/exercise/${exerciseId}`));
    const data = await response.json();
    if (data.successful) {
      return data;
    } else {
      return;
    }
  } catch (error) {
    console.error(error);
  }
};

Exercise.propTypes = {
  exercise: PropTypes.shape({
    title: PropTypes.string.isRequired,
    deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    content: PropTypes.string
  }).isRequired
};

export default withLayout(Exercise);
