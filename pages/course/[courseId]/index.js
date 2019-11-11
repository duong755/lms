import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import withLayout from '../../../components/lib/withLayout';
import withCourse from '../../../components/lib/withCourse';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`
//   };
// }

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
  }
}));

function CourseDetail() {
  const classes = useStyle();

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  return (
    <>
      <Head>
        <title>Course detail</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
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
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </Typography>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.lesson}>
                <Typography className={classes.title}>Lesson title</Typography>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </Typography>
              </Paper>
            </Grid>
            <Grid item>
              <Paper className={classes.lesson}>
                <Typography className={classes.title}>Lesson title</Typography>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
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
        </Container>
      </Box>
    </>
  );
}

export default withLayout(withCourse(CourseDetail, 'lesson'));
