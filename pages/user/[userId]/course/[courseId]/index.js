import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import withLayout from '../../../../../components/lib/withLayout';
import withCourse from '../../../../../components/lib/withCourse';

const useStyle = makeStyles((theme) => ({
  breadCrumbs: {
    fontSize: 'x-large',
    fontWeight: 'lighter'
  },
  breadCrumbsCur: {
    fontSize: 'x-large',
    fontWeight: theme.typography.fontWeightBold
  },
  button: {
    color: theme.palette.primary.main,
    opacity: '0.5'
  },
  currentButton: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightBold
  },
  container: {
    margin: theme.spacing(2, 0)
  },
  item: {
    marginRight: theme.spacing(2)
  },
  lesson: {
    margin: theme.spacing(1, 0),
    padding: theme.spacing(2)
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.primary.main,
    fontSize: theme.typography.h6.fontSize
  },
  navButton: {
    padding: theme.spacing(1)
  },
  timeSub: {
    fontWeight: theme.typography.fontWeightLight,
    color: theme.palette.primary.light
  },
  left: {
    position: 'relative'
  },
  right: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    display: 'inline-flex'
  },
  accept: {
    margin: theme.spacing(0, 1),
    color: 'green'
  },
  deny: {
    margin: theme.spacing(0, 1),
    color: 'red'
  }
}));

function LessonPage() {
  const classes = useStyle();
  return (
    <>
      <Head>
        <title>Course detail</title>
      </Head>
      <Grid container justify="flex-end" className={classes.container}>
        <Button variant="contained" color="primary">
          <Icon>add</Icon>Create Lesson
        </Button>
      </Grid>
      <Grid container direction="column" className={classes.container}>
        <Grid item>
          <Paper className={classes.lesson}>
            <Typography className={classes.title}>Lesson title</Typography>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </Typography>
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.lesson}>
            <Typography className={classes.title}>Lesson title</Typography>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </Typography>
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.lesson}>
            <Typography className={classes.title}>Lesson title</Typography>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item>
          <ButtonGroup variant="outlined" color="primary" size="large">
            <Button className={classes.navButton}>
              <Icon>keyboard_arrow_left</Icon>
            </Button>
            <Button variant="contained" className={classes.navButton}>
              1
            </Button>
            <Button className={classes.navButton}>2</Button>
            <Button className={classes.navButton}>3</Button>
            <Button className={classes.navButton}>...</Button>
            <Button className={classes.navButton}>10</Button>
            <Button className={classes.navButton}>
              <Icon>keyboard_arrow_right</Icon>
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  );
}

function ExercisePage() {
  const classes = useStyle();
  return (
    <>
      <Head>
        <title>Course detail</title>
      </Head>
      <Grid container justify="flex-end" className={classes.container}>
        <Button variant="contained" color="primary">
          <Icon>add</Icon>Create Exercise
        </Button>
      </Grid>
      <Grid container direction="column" className={classes.container}>
        <Grid item>
          <Paper className={classes.lesson}>
            <Typography className={classes.title}>Exercise title</Typography>
            <Box py={1} display="flex" alignItems="center">
              <Icon>timer</Icon>
              <Box display="inline">Deadline: 2019-10-30 21:00</Box>
            </Box>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </Typography>
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.lesson}>
            <Typography className={classes.title}>Exercise title</Typography>
            <Box py={1} display="flex" alignItems="center">
              <Icon>timer</Icon>
              <Box display="inline">Deadline: 2019-10-30 21:00</Box>
            </Box>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </Typography>
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.lesson}>
            <Typography className={classes.title}>Exercise title</Typography>
            <Box py={1} display="flex" alignItems="center">
              <Icon>timer</Icon>
              <Box display="inline">Deadline: 2019-10-30 21:00</Box>
            </Box>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item>
          <ButtonGroup variant="outlined" color="primary" size="large">
            <Button className={classes.navButton}>
              <Icon>keyboard_arrow_left</Icon>
            </Button>
            <Button variant="contained" className={classes.navButton}>
              1
            </Button>
            <Button className={classes.navButton}>2</Button>
            <Button className={classes.navButton}>3</Button>
            <Button className={classes.navButton}>...</Button>
            <Button className={classes.navButton}>10</Button>
            <Button className={classes.navButton}>
              <Icon>keyboard_arrow_right</Icon>
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  );
}

function ExamPage() {
  const classes = useStyle();
  return (
    <>
      <Head>
        <title>Course detail</title>
      </Head>
      <Grid container justify="flex-end" className={classes.container}>
        <Button variant="contained" color="primary">
          <Icon>add</Icon>Create Exam
        </Button>
      </Grid>
      <Grid container direction="column" className={classes.container}>
        <Grid item>
          <Paper className={classes.lesson}>
            <Typography className={classes.title}>Exam title</Typography>
            <Box py={1} display="flex" alignItems="center">
              <Icon>schedule</Icon>
              <Box display="inline" pr={16}>
                Start at: 2019-10-30 21:00
              </Box>
              <Icon>timelapse</Icon>
              <Box display="inline">Duration: 15 min</Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.lesson}>
            <Typography className={classes.title}>Exam title</Typography>
            <Box py={1} display="flex" alignItems="center">
              <Icon>schedule</Icon>
              <Box display="inline" pr={16}>
                Start at: 2019-10-30 21:00
              </Box>
              <Icon>timelapse</Icon>
              <Box display="inline">Duration: 15 min</Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.lesson}>
            <Typography className={classes.title}>Exam title</Typography>
            <Box py={1} display="flex" alignItems="center">
              <Icon>schedule</Icon>
              <Box display="inline" pr={16}>
                Start at: 2019-10-30 21:00
              </Box>
              <Icon>timelapse</Icon>
              <Box display="inline">Duration: 15 min</Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item>
          <ButtonGroup variant="outlined" color="primary" size="large">
            <Button className={classes.navButton}>
              <Icon>keyboard_arrow_left</Icon>
            </Button>
            <Button variant="contained" className={classes.navButton}>
              1
            </Button>
            <Button className={classes.navButton}>2</Button>
            <Button className={classes.navButton}>3</Button>
            <Button className={classes.navButton}>...</Button>
            <Button className={classes.navButton}>10</Button>
            <Button className={classes.navButton}>
              <Icon>keyboard_arrow_right</Icon>
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  );
}

function MembersPage() {
  const classes = useStyle();
  return (
    <>
      <Head>
        <title>Course detail</title>
      </Head>
      <Grid container direction="column" className={classes.container}>
        <Grid item>
          <Paper className={classes.lesson}>
            <Box py={1} display="flex" alignItems="center" className={classes.left}>
              <Icon>person</Icon>
              <Box pl={2} display="inline">
                Student(will be replaced by props later)
              </Box>
              <Box className={classes.right}>
                <Box display="inline">2019 Sep 01</Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item>
          <ButtonGroup variant="outlined" color="primary" size="large">
            <Button className={classes.navButton}>
              <Icon>keyboard_arrow_left</Icon>
            </Button>
            <Button variant="contained" className={classes.navButton}>
              1
            </Button>
            <Button className={classes.navButton}>2</Button>
            <Button className={classes.navButton}>3</Button>
            <Button className={classes.navButton}>...</Button>
            <Button className={classes.navButton}>10</Button>
            <Button className={classes.navButton}>
              <Icon>keyboard_arrow_right</Icon>
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  );
}

function JoinRequest() {
  const classes = useStyle();
  return (
    <>
      <Head>
        <title>Course detail</title>
      </Head>
      <Grid container direction="column" className={classes.container}>
        <Grid item>
          <Paper className={classes.lesson}>
            <Box py={1} display="flex" alignItems="center" className={classes.left}>
              <Icon>person</Icon>
              <Box pl={2} display="inline">
                Student(will be replaced by props later)
              </Box>
              <Box className={classes.right}>
                <Box display="inline">2019 Sep 01</Box>
                <IconButton className={classes.accept} aria-label="delete" size="small">
                  <Icon>check_circle_outlined</Icon>
                </IconButton>
                <IconButton className={classes.deny} aria-label="delete" size="small">
                  <Icon>remove_circle_outlined</Icon>
                </IconButton>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item>
          <ButtonGroup variant="outlined" color="primary" size="large">
            <Button className={classes.navButton}>
              <Icon>keyboard_arrow_left</Icon>
            </Button>
            <Button variant="contained" className={classes.navButton}>
              1
            </Button>
            <Button className={classes.navButton}>2</Button>
            <Button className={classes.navButton}>3</Button>
            <Button className={classes.navButton}>...</Button>
            <Button className={classes.navButton}>10</Button>
            <Button className={classes.navButton}>
              <Icon>keyboard_arrow_right</Icon>
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </>
  );
}

function CourseDetail(props) {
  const { tab } = props;
  //Lesson Page
  if (tab === 'lesson') {
    return <LessonPage />;
  }
  //ExercisePage
  if (tab === 'exercise') {
    return <ExercisePage />;
  }
  //Exam Page
  if (tab === 'exam') {
    return <ExamPage />;
  }
  //Members Page
  if (tab === 'members') {
    return <MembersPage />;
  }
  //Course Page
  if (tab === 'join requests') {
    return <JoinRequest />;
  }
}

CourseDetail.propTypes = {
  tab: PropTypes.string
};

export default withLayout(withCourse(CourseDetail));
