import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import React, { useState } from 'react';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import withLayout from '../../../components/lib/withLayout';
import withCourse from '../../../components/lib/withCourse';

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
  },
  students: {
    margin: theme.spacing(1, 0),
    padding: theme.spacing(0,1)
  }
}));

function LessonPage(props) {
  const classes = useStyle();
  // const { lessons } = props;
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
        {props.lessons.map((lesson, idx) => (
          <Grid item key={idx}>
            <Paper className={classes.lesson}>
              <Typography className={classes.title}>{lesson.title}</Typography>
              <Typography>{lesson.des}</Typography>
            </Paper>
          </Grid>
        ))}
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

function ExercisePage(props) {
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
        {props.exercises.map((ex, idx) => (
          <Grid item key={idx}>
            <Paper className={classes.lesson}>
              <Typography className={classes.title}>{ex.title}</Typography>
              <Box py={1} display="flex" alignItems="center">
                <Icon>timer</Icon>
                <Box display="inline"> Deadline: {ex.deadline}</Box>
              </Box>
              <Typography>{ex.des}</Typography>
            </Paper>
          </Grid>
        ))}
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

function ExamPage(props) {
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
        {props.exams.map((exam, idx) => (
          <Grid item key={idx}>
            <Paper className={classes.lesson}>
              <Typography className={classes.title}>{exam.title}</Typography>
              <Box py={1} display="flex" alignItems="center">
                <Icon>schedule</Icon>
                <Box display="inline" pr={16}>
                  Start at: {exam.start}
                </Box>
                <Icon>timelapse</Icon>
                <Box display="inline"> Duration: {exam.duration}</Box>
              </Box>
            </Paper>
          </Grid>
        ))}
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

function MembersPage(props) {
  const classes = useStyle();
  return (
    <>
      <Head>
        <title>Course detail</title>
      </Head>
      <Grid container direction="column" className={classes.container}>
        {props.members.map((mem, idx) => (
          <Grid item key={idx}>
            <Paper className={classes.students}>
              <Box py={1} display="flex" alignItems="center" className={classes.left}>
                <Icon>person</Icon>
                <Box pl={2} display="inline" component="strong">
                  {mem.name}
                </Box>
                <Box className={classes.right}>
                  <Box display="inline">{mem.joinDate}</Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
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

function JoinRequest(props) {
  const classes = useStyle();
  return (
    <>
      <Head>
        <title>Course detail</title>
      </Head>
      <Grid container direction="column" className={classes.container}>
        {props.requests.map((rq, idx) => (
          <Grid item key={idx}>
            <Paper className={classes.students}>
              <Box py={1} display="flex" alignItems="center" className={classes.left}>
                <Icon>person</Icon>
                <Box pl={2} display="inline" component="strong">
                  {rq.owner}
                </Box>
                <Box className={classes.right}>
                  <Box display="inline">{rq.rqDate}</Box>
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
        ))}
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
  const [lessons, setLessons] = useState([
    { title: 'Lesson 1', des: 'lesson 1 description' },
    { title: 'Lesson 2', des: 'lesson 2 description' }
  ]);
  const [exercises, setExercises] = useState([
    { title: 'Exercise Title1 ', deadline: '2019-10-30 21:00', des: 'Exercise 1 Description' },
    { title: 'Exercise Title2 ', deadline: '2019-10-30 23:00', des: 'Exercise 2 Description' },
    { title: 'Exercise Title3 ', deadline: '2019-10-30 20:00', des: 'Exercise 3 Description' },
    { title: 'Exercise Title4 ', deadline: '2019-10-30 12:00', des: 'Exercise 4 Description' }
  ]);
  const [exams, setExams] = useState([
    { title: 'Exam 1', start: '2019-10-30 21:00', duration: '15 min' },
    { title: 'Exam 2', start: '2019-10-30 21:00', duration: '20 min' },
    { title: 'Exam 3', start: '2019-10-30 21:00', duration: '30 min' },
    { title: 'Exam 4', start: '2019-10-30 21:00', duration: '1 hr' }
  ]);
  const [members, setMembers] = useState([
    { name: 'Le Doi Ban Chan Buoc Di Tren Con Pho Dai', joinDate: '2019 Sep 01' },
    { name: 'Le Van Luyen', joinDate: '2019 Sep 01' },
    { name: 'Le O Nac Do Di Ca Po Ri O', joinDate: '2019 Sep 01' },
    { name: 'Le O Nac Do Da Vin Si', joinDate: '2019 Sep 01' },
    { name: 'Le Ki Ma', joinDate: '2019 Sep 01' },
    { name: 'Le Sin', joinDate: '2019 Sep 01' }
  ]);
  const [requests, setRequests] = useState([
    { owner: 'Le Quan Dop Ki', rqDate: '2019 Sep 01'},
    { owner: 'Doan Van Hau', rqDate: '2019 Sep 01'},
    { owner: 'Doan Tau Ti Xiu Ay La Chung Em', rqDate: '2019 Sep 01'},
    { owner: 'Doan Quan Viet Nam Di', rqDate: '2019 Sep 01'},
    { owner: 'Doan Van Hold', rqDate: '2019 Sep 01'}
  ]);
  //Lesson Page
  if (tab === 'lesson') {
    return <LessonPage lessons={lessons} />;
  }
  //ExercisePage
  if (tab === 'exercise') {
    return <ExercisePage exercises={exercises} />;
  }
  //Exam Page
  if (tab === 'exam') {
    return <ExamPage exams={exams} />;
  }
  //Members Page
  if (tab === 'members') {
    return <MembersPage members={members} />;
  }
  //Course Page
  if (tab === 'join requests') {
    return <JoinRequest requests={requests} />;
  }
}

CourseDetail.propTypes = {
  tab: PropTypes.string
};

export default withLayout(withCourse(CourseDetail));
