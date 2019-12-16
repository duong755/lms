import PropTypes from 'prop-types';
import NextLink from 'next/link';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

import AbsURL from '../../../../../../components/helpers/URL';
import withLayout from '../../../../../../components/lib/withLayout';
import withCourse from '../../../../../../components/lib/withCourse';

const useStyles = makeStyles((theme) => ({
  examContainer: {
    padding: theme.spacing(2)
  },
  examLink: {
    color: theme.palette.primary.main,
    textDecoration: 'none'
  }
}));

function getTimeInt(uuid_str) {
  const uuid_arr = uuid_str.split('-'),
    time_str = [uuid_arr[2].substring(1), uuid_arr[1], uuid_arr[0]].join('');
  return parseInt(time_str, 16);
}

function getDateObj(uuid_str) {
  const int_time = getTimeInt(uuid_str) - 122192928000000000,
    int_millisec = Math.floor(int_time / 10000);
  return new Date(int_millisec);
}

// const mockExams = [
//   {
//     title: 'Exam 1',
//     createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
//   },
//   {
//     title: 'Exam 2',
//     createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
//   },
//   {
//     title: 'Exam 3',
//     createdAt: dayjs().format('YYYY-MM-DD hh:mm A')
//   }
// ];

function ExamItem(props) {
  const classes = useStyles();
  const objDate = getDateObj(props.id);
  const createAt = dayjs(objDate).format('YYYY-MM-DD hh:mm A');

  return (
    <Grid item xs={12}>
      <Paper className={clsx(classes.examContainer)}>
        <NextLink href="/" prefetch={false}>
          <Link href="/" className={clsx(classes.examLink)}>
            <Typography title={props.title} color="primary" variant="h5">
              {props.title}
            </Typography>
          </Link>
        </NextLink>
        <Typography>{createAt}</Typography>
      </Paper>
    </Grid>
  );
}

function CourseExam(props) {
  const { userId, courseId } = props;
  return (
    <>
      <Grid container justify="flex-end">
        <NextLink
          href="/user/[userId]/course/[courseId]/exam/create"
          as={`/user/${userId}/course/${courseId}/exam/create`}
        >
          <Button variant="contained" color="primary">
            <Icon>add</Icon>Create Exam
          </Button>
        </NextLink>
      </Grid>
      <Box py={2} />
      <Grid container spacing={2}>
        {props.examData.exams.map((currentExam) => (
          <ExamItem key={currentExam.id} {...currentExam} />
        ))}
      </Grid>
    </>
  );
}

ExamItem.propTypes = {
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  id: PropTypes.string
};

CourseExam.propTypes = {
  exams: PropTypes.array
};

CourseExam.getInitialProps = async (context) => {
  const { userId, courseId } = context.query; // this contain userId, courseId, page
  const page = context.query.page === undefined ? '' : `?page=${Number(context.query.page)}`;
  let data = { exams: [], total: 0 };
  /**
   * TODO:
   * - get lessons by pagination API
   */
  try {
    const response = await fetch(AbsURL(`/api/user/${userId}/course/${courseId}/exam/${page}`), {
      method: 'GET'
    });
    data = await response.json();
  } catch (error) {
    console.log(error);
  }
  return {
    userId: userId,
    courseId: courseId,
    page: Number(page) || 1,
    examData: data
  };
};

CourseExam.propTypes = {
  userId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  examData: PropTypes.array.isRequired
};
export default withLayout(withCourse(CourseExam, 'exam'));
