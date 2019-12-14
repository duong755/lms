import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import clsx from 'clsx';
import { isObject } from 'lodash';
import fetch from 'isomorphic-unfetch';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import NoSsr from '@material-ui/core/NoSsr';
import InputAdornment from '@material-ui/core/InputAdornment';

import { Alert } from 'reactstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import withLayout from '../../components/lib/withLayout';
import AppUser from '../../components/auth/AppUser';
import absURL from '../../components/helpers/URL';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(5)
  },
  form: {
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3)
    }
  },
  image: {
    width: '100%',
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  formHelperText: {
    marginLeft: 0,
    color: theme.palette.error.main
  }
}));

const signInValidationSchema = Yup.object().shape({
  emailOrUsername: Yup.string().required('Email/Username is required'),
  password: Yup.string().required('Password is required'),
  error: Yup.boolean().notRequired()
});

const initialSignInFormValues = {
  emailOrUsername: '',
  password: '',
  error: false
};

function SignInForm() {
  const [isDisplayError, setIsDisplayError] = useState(false);
  const userContext = useContext(AppUser);
  const router = useRouter();
  const classes = useStyles();
  const formik = useFormik({
    initialValues: initialSignInFormValues,
    validationSchema: signInValidationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const signInRes = await fetch(absURL('/api/signin'), {
          method: 'POST',
          credentials: 'include',
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emailOrUsername: values.emailOrUsername,
            password: values.password
          })
        });
        const json = await signInRes.json();
        if (json.successful) {
          userContext.setUser(json.user);
          router.replace('/');
        } else {
          helpers.setFieldValue('error', true);
          setIsDisplayError(true);
        }
      } catch (signInErr) {
        helpers.setFieldValue('error', true);
        setIsDisplayError(true);
      }
    },
    onReset: (values, helpers) => {
      helpers.resetForm({
        values: {
          error: false,
          emailOrUsername: '',
          password: ''
        },
        errors: {
          error: '',
          emailOrUsername: '',
          password: ''
        },
        touched: {
          error: '',
          emailOrUsername: '',
          password: ''
        }
      });
    }
  });

  const { values, handleChange, handleSubmit, touched, errors, handleReset, isSubmitting } = formik;

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      {values.error && (
        <Alert isOpen={isDisplayError} toggle={() => setIsDisplayError(false)} color="danger">
          Wrong username/email or password
        </Alert>
      )}
      <Paper>
        <Box pt={2} px={2}>
          <InputLabel htmlFor="emailOrUsername">Username or Email</InputLabel>
          <TextField
            variant="outlined"
            type="text"
            id="emailOrUsername"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>account_box</Icon>
                </InputAdornment>
              )
            }}
            value={values.emailOrUsername}
            onChange={handleChange('emailOrUsername')}
            helperText={touched.emailOrUsername && errors.emailOrUsername}
            FormHelperTextProps={{
              className: clsx(classes.formHelperText)
            }}
          />
        </Box>
        <Box pt={2} px={2}>
          <InputLabel htmlFor="password">Password</InputLabel>
          <TextField
            variant="outlined"
            type="password"
            id="password"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>lock</Icon>
                </InputAdornment>
              )
            }}
            value={values.password}
            onChange={handleChange('password')}
            helperText={touched.password && errors.password}
            FormHelperTextProps={{
              className: clsx(classes.formHelperText)
            }}
          />
        </Box>
        <Box p={2}>
          <Button
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            type="submit"
            color="primary"
            onClick={handleSubmit}
          >
            Sign in
          </Button>
        </Box>
        <Box pb={2} px={2}>
          <Button fullWidth variant="text">
            <NextLink href="/">
              <Link color="primary" href="/">
                Forgot your password
              </Link>
            </NextLink>
          </Button>
        </Box>
      </Paper>
    </form>
  );
}

function SignIn(props) {
  const router = useRouter();
  const classes = useStyles();
  const userContext = useContext(AppUser);
  useEffect(() => {
    if (isObject(props.user) || isObject(userContext.user)) {
      router.replace('/');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Sign in to OpenLMS</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          {!isObject(userContext.user) && (
            <NoSsr>
              <Grid className={classes.root} container component="main" justify="center" alignItems="center">
                <Grid item xs={12} sm={8} md={6}>
                  <Box className={classes.form} display="flex" flexDirection="column" alignItems="stretch">
                    <Typography gutterBottom align="center" variant="h4">
                      <strong>Sign in to OpenLMS</strong>
                    </Typography>

                    <SignInForm />

                    <Box height={30} />
                    <Button color="primary" variant="outlined" fullWidth>
                      <NextLink href="/signup">
                        <Link href="/signup">CREATE AN ACCOUNT</Link>
                      </NextLink>
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </NoSsr>
          )}
        </Container>
      </Box>
    </>
  );
}

SignIn.propTypes = {
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

export default withLayout(SignIn);
