import React, { useState } from 'react';
import Head from 'next/head';
import { Formik } from 'formik';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

import axios from 'axios';

const useStyles = makeStyles(theme => ({
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
  }
}));

function Signin() {
  const classes = useStyles();
  const [values, setValues] = useState({});

  function handleChange(event) {
    event.persist();
    setValues(values => ({
      ...values,
      [event.target.name]: event.target.value
    }));
  }

  function handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    console.log(values);
    axios
      .post('/signin', values)
      .then(res => console.log('Success ', res))
      .catch(err => console.error('Error ', err));
  }
  return (
    <>
      <Head>
        <title>Sign in to OpenLMS</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid className={classes.root} container component="main" alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box className={classes.form} display="flex" flexDirection="column" alignItems="stretch">
                <Typography gutterBottom align="center" variant="h4">
                  <strong>Sign in to OpenLMS</strong>
                </Typography>
                <Paper>
                  <form onSubmit={handleSubmit}>
                    <Box paddingTop={3} paddingX={3}>
                      <Box paddingBottom={1} fontWeight="bold">
                        Username
                      </Box>
                      <TextField
                        fullWidth
                        required
                        autoFocus
                        variant="outlined"
                        onChange={handleChange}
                        name="account"
                        type="email"
                      />
                    </Box>
                    <Box paddingLeft={3} paddingTop={3} paddingRight={3}>
                      <Box paddingBottom={1} fontWeight="bold">
                        Password
                      </Box>
                      <TextField
                        fullWidth
                        required
                        variant="outlined"
                        onChange={handleChange}
                        name="password"
                        type="password"
                      />
                    </Box>
                    <Box paddingLeft={3} paddingTop={1.5} paddingRight={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        type="submit"
                        style={{ backgroundColor: '#FF5722', color: '#FFFFFF' }}
                      >
                        Sign in
                      </Button>
                    </Box>
                    <Box paddingX={3} paddingY={1.5}>
                      <Button fullWidth variant="text">
                        <Link>forgot your password</Link>
                      </Button>
                    </Box>
                  </form>
                </Paper>
                <Box height={30} />
                <Button color="primary" variant="outlined" fullWidth>
                  <Link>CREATE AN ACCOUT</Link>
                </Button>
              </Box>
            </Grid>
            <Grid item xs={false} sm={6}>
              <img className={classes.image} src="https://loremflickr.com/320/240" />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Signin;
