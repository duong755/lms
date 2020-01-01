/**
 * @typedef {{ id: string, teacher_id: string, course_name: string, created_at: string, archive?: boolean, description?: string, topics?: string | string[], members?: string | string[] }} Course
 */
import { useCallback } from 'react';
import NextLink from 'next/link';
import clsx from 'clsx';
import dayjs from 'dayjs';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import { CourseType } from './propTypes';

const useStyles = makeStyles((theme) => ({
  courseContainer: {
    padding: theme.spacing(2),
    margin: theme.spacing(1, 0)
  },
  courseDescription: {
    padding: theme.spacing(1, 0)
  },
  courseTopic: {
    marginRight: theme.spacing(2)
  }
}));

/**
 * @type {React.FunctionComponent<{ course: Course }>}
 */
const CourseItem = (props) => {
  const { course } = props;
  const { id, teacher_id, course_name, created_at, description, archive, topics, members } = course;
  const classes = useStyles();

  const allTopics = topics ? ((topics instanceof Array ? topics : [topics])) : [];

  const courseMembers = useCallback((members) => {
    if (members) {
      if (members instanceof Array) {
        return members.length;
      }
      return 1;
    }
    return 0;
  }, []);

  return ((
    <Paper className={clsx(classes.courseContainer)}>
      <Typography variant="h5">
        <NextLink href="/user/[userId]/course/[courseId]" as={`/user/${teacher_id}/course/${id}`} prefetch={false}>
          <Link href={`/user/${teacher_id}/course/${id}`} color="primary">
            <strong>{course_name}</strong>
          </Link>
        </NextLink>
        {archive && (
          <Button size="small" variant="outlined">
            Archived
          </Button>
        )}
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center">
            <Icon>access_time</Icon>&nbsp;
            <Typography variant="caption">{dayjs(created_at).format('YYYY MMM d, hh:mm A')}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box display="flex" alignItems="center">
            <Icon>group</Icon>&nbsp;
            <Typography variant="caption">{courseMembers(members)} members</Typography>
          </Box>
        </Grid>
      </Grid>
      <Box py={2}>
        <Typography>{description}</Typography>
      </Box>
      <Box>
        {allTopics.map((currentTopic) => (
          <Box component="span" key={currentTopic} mr={1}>
            <Button variant="contained" color="primary" size="small">
              {currentTopic}
            </Button>
          </Box>
        ))}
      </Box>
    </Paper>
  ));
};

CourseItem.propTypes = {
  course: CourseType
};

export default CourseItem;
