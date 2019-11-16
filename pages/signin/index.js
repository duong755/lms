import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Hidden from '@material-ui/core/Hidden';

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
  }
}));

function Signin() {
  const classes = useStyles();
  const [values, setValues] = useState({});

  function handleChange(event) {
    event.persist();
    setValues((values) => ({
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
      .then((res) => console.log('Success ', res))
      .catch((err) => console.error('Error ', err));
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
                      <Button fullWidth variant="contained" type="submit" color="primary">
                        Sign in
                      </Button>
                    </Box>
                    <Box paddingX={3} paddingY={1.5}>
                      <Button fullWidth variant="text">
                        <NextLink href="/">
                          <Link href="/">forgot your password</Link>
                        </NextLink>
                      </Button>
                    </Box>
                  </form>
                </Paper>
                <Box height={30} />
                <Button color="primary" variant="outlined" fullWidth>
                  <NextLink href="/signup">
                    <Link href="/signup">CREATE AN ACCOUNT</Link>
                  </NextLink>
                </Button>
              </Box>
            </Grid>
            <Grid item xs={false} sm={6}>
              <Hidden smDown>
                <img
                  className={classes.image}
                  src="https://lh3.googleusercontent.com/UGQxZMBLsql2ED-_Kx7GHy0c7l3O64uhqeubwu1A-53VIamRM_VsDth_EyKEXnrwIwxUetQmY_3c03gHCMqAG49UJi7Fom1kqwNVdR9Az13WIrgGBBbTKxIZlKy8xdOuXuKJcPeE-1nLQ2qsBzReTYupwLqXr7ie2sxjPa8jafUEK4L7zlyLfjdlAfoz6GzDgoYva2sqJALVYx4Uv_UUemEZRZWmEQGPImpJfVQxamw0xPSuak39lHflrVDQUhzZAkw5Mf1fMUuKMBkD3sb9T8UdnYMRhDp8XUM6ZLBhVfIWASw_pSuPSVHTSWvVrGobxf0pp4BmgjZ6l39lK14OtkHcQO3_R4a9DdO3D7uRk7ad85mWBpGO8EkouV0xCi5MsXFTOuF5vd89SnpZFmLvMW6_TEXYKHf4RpIECUS_8I_MrLEW2aPmY9ir2DkIlnzJUY59g754P9O6AtCyik3FHFWxRYJzfQKnCQUk7JaTMWK15BrW3CW_ka1Ah_rAgmTAjsMXYqMWqnDPjIJx3HQOZWBYSYCIRrHk9hRfOuPlY4M2umzZPKSGKOOKc4mhBFr0P9F5BvD_4xH4b2DlSwZCxDtwbAQtiYcSrloLdCU5caHVWM4IcZSss5jlYDI=w1366-h590"
                />
              </Hidden>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default withLayout(Signin);
