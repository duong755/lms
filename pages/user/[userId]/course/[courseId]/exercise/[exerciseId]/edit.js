import PropTypes from 'prop-types';
import Head from 'next/head';
import { useContext, useEffect } from 'react';
import NextLink from 'next/link';
import * as Yup from 'yup';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { isObject } from 'lodash';
import { stateToHTML } from 'draft-js-export-html';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import CircularProgress from '@material-ui/core/CircularProgress';
import NoSsr from '@material-ui/core/NoSsr';

import withLayout from '../../../../../../../components/lib/withLayout';
import MuiRte from '../../../../../../../components/MuiRte';
import AppUser from '../../../../../../../components/auth/AppUser';
import absURL from '../../../../../../../components/helpers/URL';

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

const initailValues = {
  title: '',
  deadline: '',
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
    .min(Date())
    .required('"Due time" is required')
});

function CreateExerciseForm() {
  const classes = useStyles();
  const router = useRouter();
  const formik = useFormik({
    initialValues: initailValues,
    validationSchema: exerciseSchemaValidation,
    onSubmit: async (values, helpers) => {
      try {
        const response = await fetch(
          absURL(
            `/api/user/${router.query.userId}/course/${router.query.courseId}/exercise/${router.query.exerciseId}`
          ),
          {
            method: 'PUT',
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
          router.replace(
            `/user/${router.query.userId}/course/${router.query.courseId}/exercise/${router.query.exerciseId}`
          );
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
        values: initailValues
      });
    }
  });

  const { errors, touched, values, handleChange, handleSubmit, handleReset, setFieldValue } = formik;
  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={10} md={8}>
          <Box mt={4} mb={5}>
            <Breadcrumbs separator="/" aria-label="breadcrumb">
              <NextLink href="/">
                <Link color="textPrimary" href="/">
                  <Typography variant="h5">Username</Typography>
                </Link>
              </NextLink>
              <NextLink href="/">
                <Link color="textPrimary" href="/">
                  <Typography variant="h5">Course Name</Typography>
                </Link>
              </NextLink>
              <Typography color="primary" variant="h5">
                Edit Exercise
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box mb={3}>
            <Typography>Exercise Title</Typography>
            <TextField
              id="outlined-multiline-static"
              fullWidth
              value={values.title}
              margin="none"
              variant="outlined"
              onChange={handleChange('title')}
              helperText={touched.title && errors.title}
              FormHelperTextProps={{ className: clsx(classes.formHelperText) }}
            />
          </Box>
          <Box mb={3}>
            <Typography>Due Time</Typography>
            <TextField
              id="outlined-multiline-static"
              fullWidth
              value={values.deadline}
              margin="none"
              variant="outlined"
              onChange={handleChange('deadline')}
              placeholder="YYYY-MM-DD"
              helperText={touched.deadline && errors.deadline}
              FormHelperTextProps={{ className: clsx(classes.formHelperText) }}
            />
          </Box>
          <Box mb={3}>
            <Typography title="excercise-detail" noWrap>
              Excercise Detail
            </Typography>
            <MuiRte
              label="Type something here"
              onChange={(data) => setFieldValue('content', stateToHTML(data.getCurrentContent()))}
              inlineToolbar={true}
              id="content"
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
        </Grid>
      </Grid>
    </form>
  );
}

function CreateExercise(props) {
  const userContext = useContext(AppUser);
  const router = useRouter();

  useEffect(() => {
    if (!isObject(props.user) && !isObject(userContext.user)) {
      router.replace('/');
    } else {
      if (userContext.user.type === 'student') {
        router.replace('/');
      }
    }
  }, []);
  return (
    <>
      <Head>
        <title>Edit Exercise</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          {isObject(userContext.user) && userContext.user.type === 'teacher' && (
            <NoSsr>
              <CreateExerciseForm />
            </NoSsr>
          )}
        </Container>
      </Box>
    </>
  );
}

CreateExercise.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    type: PropTypes.oneOf(['teacher', 'student']),
    info: PropTypes.shape({
      fullname: PropTypes.string,
      birthday: PropTypes.string,
      image: PropTypes.string
    })
  })
};

export default withLayout(CreateExercise);
