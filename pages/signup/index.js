import { useContext, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { isObject } from 'lodash';
import clsx from 'clsx';
import fetch from 'isomorphic-unfetch';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import NoSsr from '@material-ui/core/NoSsr';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';

import { UncontrolledAlert } from 'reactstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import withLayout from '../../components/lib/withLayout';
import AppUser from '../../components/auth/AppUser';
import absURL from '../../components/helpers/URL';

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'none',
      color: theme.palette.primary.main
    }
  },
  formHelperText: {
    marginLeft: 0,
    color: theme.palette.error.main
  }
}));

const signUpValidationSchema = Yup.object().shape({
  username: Yup.string().required('"username" is required'),
  email: Yup.string()
    .email('"email" must be a valid email')
    .required('"email" is required'),
  password: Yup.string().required('"password" is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'password does not match'),
  type: Yup.string()
    .oneOf(['teacher', 'student'], '"type" must be one of [teacher, student]')
    .required(),
  accept: Yup.boolean()
    .oneOf([true], 'You must accept the Terms of Service')
    .required(),
  error: Yup.string().notRequired()
});

const initialSignUpFormValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  type: '',
  accept: false,
  error: ''
};

function SignUpForm() {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const classes = useStyles();
  const router = useRouter();
  const formik = useFormik({
    validationSchema: signUpValidationSchema,
    initialValues: initialSignUpFormValues,
    onSubmit: async (values, helpers) => {
      const submitData = {
        username: values.username,
        email: values.email,
        password: values.password,
        type: values.type
      };
      const signUpRes = await fetch(absURL('/api/signup'), {
        method: 'POST',
        credentials: 'include',
        mode: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      /**
       * we need clone because fetch API doesn't not allow
       * to call .json() and .text() simultaneously
       */
      const cloneRes = signUpRes.clone();

      const json = await signUpRes.json();
      const text = await cloneRes.text();
      if (signUpRes.ok) {
        if (signUpRes.status === 200) {
          router.replace('/');
        } else {
          setSnackbarOpen(true);
        }
      } else {
        switch (signUpRes.status) {
          case 400:
            if (isObject(json.error)) {
              helpers.setErrors(json.error);
            }
            break;
          case 403:
            router.replace('/');
            break;
          default:
            setFieldValue('error', text || json.error);
            break;
        }
        helpers.setSubmitting(false);
      }
    },
    onReset: (values, helpers) => {
      helpers.resetForm({
        values: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          type: ''
        },
        errors: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          type: ''
        },
        touched: {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          type: ''
        }
      });
    }
  });

  const { values, touched, errors, handleChange, handleSubmit, handleReset, setFieldValue, isSubmitting } = formik;

  return (
    <>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={5000}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        message="Create new account successfully"
        action={
          <NextLink href="/signin" prefetch={false}>
            <Link className={clsx(classes.link)} href="/signin">
              <strong>SIGN IN</strong>
            </Link>
          </NextLink>
        }
      />
      <form onSubmit={handleSubmit} onReset={handleReset}>
        {values.error && <UncontrolledAlert color="danger">{values.error}</UncontrolledAlert>}
        <Box pb={2}>
          <InputLabel htmlFor="username">Username</InputLabel>
          <TextField
            variant="outlined"
            type="text"
            fullWidth
            id="username"
            value={values.username}
            onChange={handleChange('username')}
            helperText={touched.username && errors.username}
            FormHelperTextProps={{
              className: clsx(classes.formHelperText)
            }}
          />
        </Box>
        <Box pb={2}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <TextField
            variant="outlined"
            type="email"
            fullWidth
            id="email"
            value={values.email}
            onChange={handleChange('email')}
            helperText={touched.email && errors.email}
            FormHelperTextProps={{
              className: clsx(classes.formHelperText)
            }}
          />
        </Box>
        <Box pb={2}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <TextField
            variant="outlined"
            type="password"
            fullWidth
            id="password"
            value={values.password}
            onChange={handleChange('password')}
            helperText={touched.password && errors.password}
            FormHelperTextProps={{
              className: clsx(classes.formHelperText)
            }}
          />
        </Box>
        <Box pb={2}>
          <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
          <TextField
            variant="outlined"
            type="password"
            fullWidth
            id="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange('confirmPassword')}
            helperText={touched.confirmPassword && errors.confirmPassword}
            FormHelperTextProps={{
              className: clsx(classes.formHelperText)
            }}
          />
        </Box>
        <Box marginY={2}>
          <Box fontWeight="bold">Account Type</Box>
          <RadioGroup name="position" row>
            <FormControlLabel
              labelPlacement="end"
              label="Student"
              name="student"
              value="student"
              onChange={(event, checked) => checked && setFieldValue('type', 'student')}
              control={<Radio color="primary" />}
            />
            <Box width={30} />
            <FormControlLabel
              labelPlacement="end"
              label="Teacher"
              name="teacher"
              value="teacher"
              onChange={(event, checked) => checked && setFieldValue('type', 'teacher')}
              control={<Radio color="primary" />}
            />
          </RadioGroup>
          <Box className={clsx(classes.formHelperText)}>{touched.type && errors.type}</Box>
        </Box>
        <Box marginBottom={2}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={values.accept}
                onChange={(event, checked) => setFieldValue('accept', checked)}
                value="accept"
              />
            }
            label="Accept the terms of service"
          />
          <Box className={clsx(classes.formHelperText)}>{touched.accept && errors.accept}</Box>
        </Box>
        <Button
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          onSubmit={handleSubmit}
          endIcon={isSubmitting && <CircularProgress color="primary" />}
        >
          Create account
        </Button>
      </form>
    </>
  );
}
function SignUp() {
  const userContext = useContext(AppUser);

  return (
    <>
      <Head>
        <title>Sign up to LMS</title>
      </Head>
      <Container maxWidth="xl">
        <Grid container component="main" justify="center">
          <Grid item xs={12} sm={10} md={8} lg={6}>
            {!isObject(userContext.user) && (
              <NoSsr>
                <Box display="flex" flexDirection="column" alignItems="stretch" marginY={2}>
                  <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
                    <Typography>Join OpenLMS</Typography>
                    <Typography component="h3" variant="h4">
                      <strong>Create an account</strong>
                    </Typography>
                  </Box>

                  <SignUpForm />
                </Box>
              </NoSsr>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default withLayout(SignUp);
