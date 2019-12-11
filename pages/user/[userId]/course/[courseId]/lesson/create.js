import React, { useContext, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import clsx from 'clsx';
import { isObject } from 'lodash';
import PropTypes from 'prop-types';
import { stateToHTML } from 'draft-js-export-html';

import NoSsr from '@material-ui/core/NoSsr';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import withLayout from '../../../../../../components/lib/withLayout';
import MuiRte from '../../../../../../components/MuiRte';
import AppUser from '../../../../../../components/auth/AppUser';
import absURL from '../../../../../../components/helpers/URL';

const CreateLessonSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required('"Title" is required'),
  content: Yup.string()
});

const initailValue = {
  title: '',
  content: ''
};

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

function CreateLessonForm() {
  const router = useRouter();
  const classes = useStyles();

  const formik = useFormik({
    validationSchema: CreateLessonSchema,
    initialValues: initailValue,
    onSubmit: async (values, helpers) => {
      try {
        const respone = await fetch(absURL(`/api/user/${router.query.userId}/course/${router.query.courseId}/lesson`), {
          method: 'POST',
          credentials: 'include',
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        const json = await respone.json();
        if (json.successful) {
          router.replace(`/user/${router.query.userId}/course/${router.query.courseId}/lesson/${json.lessonId}`);
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
    onReset: (values, helpers) => {
      helpers.resetForm({
        errors: {
          title: '',
          content: ''
        },
        values: {
          title: '',
          content: ''
        },
        touched: {
          title: false,
          content: false
        }
      });
    }
  });
  const { values, errors, touched, handleChange, handleSubmit, handleReset, setFieldValue } = formik;
  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <Grid container direction="column" spacing={1} alignItems="stretch">
        <Grid item>
          <Box py={2}>
            <Typography variant="h4">
              <strong>Create new lesson</strong>
            </Typography>
          </Box>
          <Divider />
        </Grid>
        <Box py={1} />
        <Grid item>
          <InputLabel htmlFor="title">Title</InputLabel>
          <TextField
            autoFocus
            title={values.title}
            variant="outlined"
            fullWidth
            id="title"
            values={values.title}
            onChange={handleChange('title')}
            helperText={touched.title && errors.title}
            FormHelperTextProps={{ className: clsx(classes.formHelperText) }}
          ></TextField>
        </Grid>
        <Box py={1} />
        <Grid item>
          <InputLabel htmlFor="content">Lesson details</InputLabel>
          <MuiRte
            label="Type something here...."
            inlineToolbar={true}
            id="content"
            onChange={(data) => setFieldValue('content', stateToHTML(data.getCurrentContent()))}
          />
        </Grid>
        <Box py={1} />
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className={classes.button}
            disabled={formik.isSubmitting}
            endIcon={formik.isSubmitting && <CircularProgress size={30} />}
          >
            Post
          </Button>
        </Box>
      </Grid>
    </form>
  );
}

function CreateLesson(props) {
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
        <title> Create Lesson</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container justify="center">
            <Grid item xs={12} sm={8}>
              {isObject(userContext.user) && userContext.user.type === 'teacher' && (
                <NoSsr>
                  <CreateLessonForm />
                </NoSsr>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

CreateLesson.propTypes = {
  user: PropTypes.object
};
export default withLayout(CreateLesson);
