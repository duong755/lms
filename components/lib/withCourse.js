import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles((theme) => ({
  tab: {
    marginRight: theme.spacing(2)
  }
}));

function CourseTab(props) {
  const { tabName, focusTab, onClick } = props;
  const classes = useStyles();

  if (tabName === focusTab) {
    return (
      <Button className={classes.tab} color="primary" variant="contained" onClick={onClick}>
        {tabName}
      </Button>
    );
  }
  return (
    <Button className={classes.tab} variant="text" onClick={onClick}>
      {tabName}
    </Button>
  );
}

/**
 *
 * @param {React.FC} CoursePage
 * @param {string} tab
 */
function withCourse(CoursePage, tab = 'lesson') {
  const tabs = ['lesson', 'exercise', 'exam', 'members', 'join requests'];

  const FullCoursePage = () => {
    return (
      <Box>
        <Container maxWidth="xl">
          <Box pt={3}>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink href="/">
                <Link color="inherit" href="/">
                  <Typography variant="h5">Username</Typography>
                </Link>
              </NextLink>
              <Typography variant="h5" color="textPrimary">
                <strong>Course Name</strong>
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box py={2} display="flex" alignItems="center">
            <Icon>calendar_today</Icon>
            <Box display="inline">Create on someday</Box>
          </Box>
          <Box>
            {tabs.map((currentTabName) => (
              <CourseTab key={currentTabName} tabName={currentTabName} focusTab={tab} />
            ))}
          </Box>
          <CoursePage tab={tab} />
        </Container>
      </Box>
    );
  };
  return FullCoursePage;
}

CourseTab.propTypes = {
  tabName: PropTypes.string.isRequired,
  focusTab: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default withCourse;
