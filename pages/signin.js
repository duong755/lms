import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Typography, TextField, Button, Link } from '@material-ui/core';
import axios from 'axios';

function Signin() {
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
    <Grid container component="main" style={{ height: '100vh' }}>
      <Grid item xs={12} md={6}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyItems="center">
          <Box marginBottom={1}>
            <Typography variant="" component="h1">
              Sign in to OpenLMS
            </Typography>
          </Box>
          <Box border="2px solid #cdcdcd" borderRadius="6px" width="400px" height="350px">
            <form onSubmit={handleSubmit}>
              <Box paddingLeft={3} paddingTop={4} paddingRight={3}>
                <Typography variant="" component="h3">
                  Username or email
                </Typography>
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
                <Typography variant="" component="h3">
                  Password
                </Typography>
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
              <Box paddingLeft={3} paddingRight={3} paddingTop={1.5}>
                <Button fullWidth variant="text">
                  <Link>forgot your password</Link>
                </Button>
              </Box>
            </form>
          </Box>
          <hr />
          <Box width={400} border="2px solid #ff5722" borderRadius={6}>
            <Button fullWidth>
              <Link>CREATE AN ACCOUT</Link>
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={false}
        md={6}
        style={{
          backgroundImage: 'url(https://loremflickr.com/320/240)'
        }}
      ></Grid>
    </Grid>
  );
}

export default Signin;
