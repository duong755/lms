import Head from 'next/head';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useRef, useEffect, useState } from 'react';
import clsx from 'clsx';
import { isObject } from 'lodash';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import NoSsr from '@material-ui/core/NoSsr';
import ReactSelectAsyncCreatable from 'react-select/async-creatable';

import withLayout from '../../../../../components/lib/withLayout';
import absURL from '../../../../../components/helpers/URL';
import AppUser from '../../../../../components/auth/AppUser';

const useStyles = makeStyles((theme) => ({
  save: {
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    width: '15%',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  cancel: {
    boxSizing: 'border-box',
    borderWidth: '2px',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    width: '15%',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white
    }
  },
  item: {
    minWidth: '100%'
  },
  textField: {
    width: '100%',
    '&.Mui-focused fieldset': {
      width: '100%',
      borderWidth: '3px',
      borderColor: theme.palette.common.black
    }
  }
}));

const createCourseInitialValues = {
  courseName: '',
  description: '',
  topics: []
};

const createCourseValidationSchema = Yup.object().shape({
  courseName: Yup.string()
    .trim()
    .required('"Course name" is required'),
  description: Yup.string()
    .trim()
    .notRequired(),
  topics: Yup.array(Yup.string().trim()).notRequired()
});

const searchTopic = async (input) => {
  try {
    const res = await fetch(absURL(`/api/topic/${input}`));
    const json = await res.json();
    return json.topics.map((topic) => ({ value: topic, label: topic }));
  } catch {
    return [];
  }
};

function EditCourseForm(props) {
  const select = useRef(null);
  const classes = useStyles();
  const router = useRouter();
  const userContext = useContext(AppUser);

  const formik = useFormik({
    initialValues: props.createCourseInitialValues,
    validationSchema: createCourseValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, helpers) => {
      try {
        const response = await fetch(absURL(`/api/user/${userContext.user.id}/course/${router.query.courseId}`), {
          method: 'PUT',
          credentials: 'include',
          body: JSON.stringify(values),
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const json = await response.json();
        if (json.successful) {
          router.replace(`/api/user${router.query.userId}/course/${router.query.courseId}`);
          return;
        } else {
          console.log(json);
        }
      } catch (error) {
        console.error(error);
      } finally {
        helpers.setSubmitting(false);
      }
    },
    onReset: (values, helpers) => {
      helpers.resetForm({
        errors: {
          courseName: '',
          description: '',
          topics: ''
        },
        touched: {
          courseName: false,
          description: false,
          topics: false
        },
        values: createCourseInitialValues
      });
    }
  });

  const { values, touched, errors, handleSubmit, handleReset, setFieldValue, handleChange } = formik;

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <Grid container direction="column" spacing={1} alignItems="stretch">
        <Grid item>
          <Box py={2}>
            <Typography variant="h4">
              <strong>Edit course</strong>
            </Typography>
          </Box>
          <Divider />
        </Grid>
        <Grid item>
          <InputLabel htmlFor="courseName">Course Name</InputLabel>
          <TextField
            fullWidth
            id="courseName"
            variant="outlined"
            value={values.course_name}
            onChange={handleChange('courseName')}
            helperText={touched.course_name && errors.course_name}
            FormHelperTextProps={{
              className: clsx(classes.formHelperText)
            }}
          />
        </Grid>
        <Box py={1} />
        <Grid item>
          <InputLabel htmlFor="description">Description(Optional)</InputLabel>
          <TextField
            fullWidth
            multiline
            id="description"
            variant="outlined"
            rows={3}
            value={values.description}
            onChange={handleChange('description')}
            helperText={touched.description && errors.description}
            FormHelperTextProps={{
              className: clsx(classes.formHelperText)
            }}
          />
        </Grid>
        <Box py={1} />
        <Grid item>
          <InputLabel htmlFor="topics">Topics</InputLabel>
          <ReactSelectAsyncCreatable
            ref={select}
            isMulti
            placeholder="Search for topics..."
            id="topics"
            loadOptions={searchTopic}
            onChange={(value) => {
              setFieldValue('topics', value.map((currentSelectedOption) => currentSelectedOption.value));
            }}
          />
        </Grid>
        <Box py={1} />
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
            className={classes.button}
            onClick={handleSubmit}
            endIcon={formik.isSubmitting && <CircularProgress size={30} />}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

function EditCourse(props) {
  const userContext = useContext(AppUser);
  const router = useRouter();

  const [initialValues, setInitialValue] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(absURL(`/api/user/${router.query.userId}/course/${router.query.courseId}`));
      const json = await result.json();
      const newState = { ...initialValues, ...json.course };
      console.log(newState);
      setInitialValue(newState);
    };
    fetchData();
  }, []);

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
        <title>Edit course</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container justify="center">
            <Grid item xs={12} sm={8}>
              {isObject(userContext.user) && userContext.user.type === 'teacher' && (
                <NoSsr>
                  <EditCourseForm createCourseInitialValues={initialValues} />
                </NoSsr>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

EditCourseForm.propTypes = {
  createCourseInitialValues: PropTypes.any
};

EditCourse.propTypes = {
  user: PropTypes.object
};

export default withLayout(EditCourse);
