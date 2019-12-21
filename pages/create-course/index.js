import { useRef, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import fetch from 'isomorphic-unfetch';
import { isObject } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import NoSsr from '@material-ui/core/NoSsr';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactSelectAsyncCreatable from 'react-select/async-creatable';

import withLayout from '../../components/hoc/withLayout';
import AppUser from '../../components/auth/AppUser';
import absURL from '../../components/helpers/URL';
import { searchTopic } from '../../components/helpers/searchTopic';
import { useSelectStyles } from '../../components/styles/select';

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

const createCourseValidationSchema = Yup.object().shape({
  courseName: Yup.string()
    .trim()
    .required('"Course name" is required'),
  description: Yup.string()
    .trim()
    .notRequired(),
  topics: Yup.array(Yup.string().trim()).notRequired()
});

const createCourseInitialValues = {
  courseName: '',
  description: '',
  topics: []
};

function CreateCourseForm() {
  /**
   * @type {React.MutableRefObject<import('react-select/async-creatable').AsyncCreatable>}
   */
  const select = useRef(null);
  const userContext = useContext(AppUser);
  const router = useRouter();
  const classes = useStyles();
  const selectClasses = useSelectStyles();
  const formik = useFormik({
    validationSchema: createCourseValidationSchema,
    initialValues: createCourseInitialValues,
    onSubmit: async (values, helpers) => {
      try {
        const createCourseRes = await fetch(absURL('/api/create-course'), {
          method: 'POST',
          credentials: 'include',
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        const json = await createCourseRes.json();
        if (json.successful) {
          router.replace(`/user/${userContext.user.id}/course/${json.courseId}`);
          return;
        } else {
          console.log(json);
        }
      } catch (createCourseErr) {
        console.log('error', createCourseErr);
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
        values: {
          courseName: '',
          description: '',
          topics: []
        }
      });
    }
  });

  const { values, errors, touched, setFieldValue, handleChange, handleSubmit, handleReset } = formik;

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      <Grid container direction="column" spacing={1} alignItems="stretch">
        <Grid item>
          <Box py={2}>
            <Typography variant="h4">
              <strong>Create new course</strong>
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
            value={values.courseName}
            onChange={handleChange('courseName')}
            helperText={touched.courseName && errors.courseName}
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
            styles={selectClasses}
            loadOptions={searchTopic}
            onChange={(value) => {
              if (value) {
                setFieldValue('topics', value.map((currentSelectedOption) => currentSelectedOption.value));
              } else {
                setFieldValue('topics', []);
              }
            }}
          />
        </Grid>
        <Box py={1} />
        <Grid item>
          <Button
            variant="contained"
            disabled={formik.isSubmitting}
            className={classes.button}
            onClick={handleSubmit}
            endIcon={formik.isSubmitting && <CircularProgress size={30} />}
          >
            Create
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

function CreateCourse(props) {
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
        <title>Create course</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container justify="center">
            <Grid item xs={12} sm={8}>
              {isObject(userContext.user) && userContext.user.type === 'teacher' && (
                <NoSsr>
                  <CreateCourseForm />
                </NoSsr>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

CreateCourse.propTypes = {
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

export default withLayout(CreateCourse);
