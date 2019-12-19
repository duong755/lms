/**
 * @typedef {{ id: string, email: string, username: string, type: 'teacher' | 'student', info: Object<string, string> }} User
 * @typedef {{ id: string, teacher_id: string, course_name: string, created_at: string, archive?: boolean, description?: string, topics?: string | string[], members?: string | string[] }} Course
 */
import Head from 'next/head';
import { useContext, useEffect } from 'react';
import NextLink from 'next/link';
import * as Yup from 'yup';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { isObject } from 'lodash';
import { stateToHTML } from 'draft-js-export-html';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import CircularProgress from '@material-ui/core/CircularProgress';
import NoSsr from '@material-ui/core/NoSsr';
import { DateTimePicker } from '@material-ui/pickers';

import withLayout from '../../../../../../components/lib/withLayout';
import withCourse from '../../../../../../components/lib/withCourse';
import { UserType, CourseType } from '../../../../../../components/propTypes';
import MuiRte from '../../../../../../components/MuiRte';
import AppUser from '../../../../../../components/auth/AppUser';
import absURL from '../../../../../../components/helpers/URL';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  formHelperText: {
    marginLeft: 0,
    color: theme.palette.error.main
  }
}));

const initialExerciseValues = {
  title: '',
  deadline: dayjs()
    .add(1, 'week')
    .toDate(),
  content: ''
};

const exerciseSchemaValidation = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required(),
  content: Yup.string()
    .trim()
    .required(),
  deadline: Yup.date()
    .min(
      dayjs()
        .add(1, 'day')
        .toDate()
    )
    .required('"Due time" is required')
});

const CreateExerciseForm = () => {
  const classes = useStyles();
  const router = useRouter();
  const formik = useFormik({
    initialValues: initialExerciseValues,
    validationSchema: exerciseSchemaValidation,
    onSubmit: async (values, helpers) => {
      try {
        const response = await fetch(
          absURL(`/api/user/${router.query.userId}/course/${router.query.courseId}/exercise`),
          {
            method: 'POST',
            body: JSON.stringify(values),
            credentials: 'include',
            mode: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        const json = await response.json();
        if (json.successful) {
          router.replace(`/user/${router.query.userId}/course/${router.query.courseId}/exercise/${json.exerciseId}`);
          return;
        } else {
          console.log(json);
        }
      } catch (error) {
        console.log(error);
      } finally {
        helpers.setSubmitting(false);
      }
    },
    onReset: (values, helper) => {
      helper.resetForm({
        errors: {
          title: '',
          content: '',
          deadline: ''
        },
        touched: {
          title: false,
          content: false,
          deadline: false
        },
        values: initialExerciseValues
      });
    }
  });

  const { errors, touched, values, handleChange, handleSubmit, handleReset, setFieldValue } = formik;
  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <Box mb={3}>
        <InputLabel htmlFor="exerciseTitle">Exercise Title</InputLabel>
        <TextField
          fullWidth
          value={values.title}
          id="exerciseTitle"
          margin="none"
          variant="outlined"
          onChange={handleChange('title')}
          helperText={touched.title && errors.title}
          FormHelperTextProps={{ className: clsx(classes.formHelperText) }}
        />
      </Box>
      <Box mb={3}>
        <InputLabel htmlFor="exerciseDeadline">Due Time</InputLabel>
        <DateTimePicker
          fullWidth
          id="exerciseDeadline"
          inputVariant="outlined"
          variant="inline"
          ampm={false}
          value={values.deadline}
          minDate={dayjs()
            .add(1, 'date')
            .toDate()}
          format="YYYY MMMM D, hh:mm"
          onChange={(date) => setFieldValue('deadline', date)}
          FormHelperTextProps={{ className: clsx(classes.formHelperText) }}
        />
      </Box>
      <Box mb={3}>
        <InputLabel htmlFor="excerciseContent">Excercise Detail</InputLabel>
        <MuiRte
          id="exerciseContent"
          label="Type something here"
          onChange={(data) => setFieldValue('content', stateToHTML(data.getCurrentContent()))}
          inlineToolbar
        />
      </Box>
      <Box mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={formik.isSubmitting}
          className={classes.button}
          endIcon={formik.isSubmitting && <CircularProgress size={30} />}
        >
          Post
        </Button>
      </Box>
    </form>
  );
};

/**
 * @type {React.FunctionComponent<{ user?: User, course?: Course }>}
 */
const CreateExercise = (props) => {
  const { user, course } = props;
  const userContext = useContext(AppUser);
  const router = useRouter();

  useEffect(() => {
    if (!isObject(user) || !isObject(userContext.user)) {
      router.replace('/');
    } else {
      if (userContext.user.id !== user.id) {
        router.replace('/');
      }
    }
  }, []);
  return ((
    <>
      <Head>
        <title>Create Exercise</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container spacing={2} justify="center">
            <Grid item xs={12} sm={10} md={8}>
              <Box mt={4} mb={5}>
                <Breadcrumbs separator="/" aria-label="breadcrumb">
                  <NextLink href="/user/[userId]" as={`/user/${course.teacher_id}`} prefetch={false}>
                    <Link color="textPrimary" href={`/user/${course.teacher_id}`}>
                      <Typography variant="h5">{user.username}</Typography>
                    </Link>
                  </NextLink>
                  <NextLink
                    href="/user/[userId]/course/[courseId]"
                    as={`/user/${course.teacher_id}/course/${course.id}`}
                    prefetch={false}
                  >
                    <Link color="textPrimary" href={`/user/${course.teacher_id}/course/${course.id}`}>
                      <Typography variant="h5">{course.course_name}</Typography>
                    </Link>
                  </NextLink>
                  <Typography color="primary" variant="h5">
                    Create Exercise
                  </Typography>
                </Breadcrumbs>
              </Box>
              {isObject(userContext.user) && userContext.user.type === 'teacher' && (
                <NoSsr>
                  <CreateExerciseForm />
                </NoSsr>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  ));
};

CreateExercise.propTypes = {
  user: UserType,
  course: CourseType
};

export default withLayout(withCourse(CreateExercise));
