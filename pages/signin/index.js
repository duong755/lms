import Head from 'next/head';
import NextLink from 'next/link';
import clsx from 'clsx';

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
import InputAdornment from '@material-ui/core/InputAdornment';

import { UncontrolledAlert } from 'reactstrap';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import withLayout from '../../components/lib/withLayout';

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
    color: theme.palette.error.main
  }
}));

const signInValidationSchema = Yup.object().shape({
  usernameOrEmail: Yup.string().required('Username or Email is required'),
  password: Yup.string().required('Password is required'),
  error: Yup.boolean().notRequired()
});

const initialSignInFormValue = {
  usernameOrEmail: '',
  password: '',
  error: false
};

function SignInForm() {
  const classes = useStyles();
  const formik = useFormik({
    initialValues: initialSignInFormValue,
    validationSchema: signInValidationSchema
  });

  const { values, handleChange, handleSubmit, touched, errors, handleReset } = formik;

  return (
    <form onSubmit={handleSubmit} onReset={handleReset}>
      {values.error && <UncontrolledAlert color="danger">Wrong username/email or password</UncontrolledAlert>}
      <Paper>
        <Box pt={2} px={2}>
          <TextField
            variant="outlined"
            type="text"
            label="Username or Email"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>account_box</Icon>
                </InputAdornment>
              )
            }}
            value={values.usernameOrEmail}
            onChange={handleChange('usernameOrEmail')}
            helperText={touched.usernameOrEmail && errors.usernameOrEmail}
            FormHelperTextProps={{
              className: clsx(classes.formHelperText)
            }}
          />
        </Box>
        <Box pt={2} px={2}>
          <TextField
            variant="outlined"
            type="password"
            label="Password"
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
          <Button fullWidth variant="contained" type="submit" color="primary" onClick={handleSubmit}>
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

function SignIn() {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Sign in to OpenLMS</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
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
        </Container>
      </Box>
    </>
  );
}

export default withLayout(SignIn);
