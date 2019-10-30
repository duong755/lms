import React from 'react';
import Head from 'next/head';

import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

function Signup() {
  return (
    <>
      <Head>
        <title>Sign up to LMS</title>
      </Head>
      <Container maxWidth="xl">
        <Grid component="main">
          <Grid item>
            <Box display="flex" flexDirection="column" alignItems="center" marginY={2}>
              <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
                <Typography>Join OpenLMS</Typography>
                <Typography component="h3" variant="h4">
                  <strong>Create an account</strong>
                </Typography>
              </Box>
              <Box width={500}>
                <form>
                  <Box paddingBottom={2}>
                    <Box fontWeight="bold" paddingBottom={1}>
                      Username
                    </Box>
                    <TextField
                      autoFocus
                      required
                      variant="outlined"
                      fullWidth
                      name="username"
                      type="text"
                      placeholder="Username"
                    />
                  </Box>
                  <Box paddingBottom={2}>
                    <Box fontWeight="bold" paddingBottom={1}>
                      Email
                    </Box>
                    <TextField autoFocus required variant="outlined" fullWidth name="email" type="email" />
                  </Box>
                  <Box paddingBottom={2}>
                    <Box fontWeight="bold" paddingBottom={1}>
                      Password
                    </Box>
                    <TextField autoFocus required variant="outlined" fullWidth name="password" type="password" />
                  </Box>
                  <Box paddingBottom={2}>
                    <Box fontWeight="bold" paddingBottom={1}>
                      Confirm Password
                    </Box>
                    <TextField autoFocus required variant="outlined" fullWidth name="cfPassword" type="password" />
                  </Box>
                  <Box marginY={2}>
                    <Box fontWeight="bold">Accout Type</Box>
                    <RadioGroup name="position" row>
                      <FormControlLabel
                        labelPlacement="end"
                        label="Student"
                        name="student"
                        value="student"
                        control={<Radio />}
                      />
                      <FormControlLabel
                        style={{ marginLeft: '130px' }}
                        labelPlacement="end"
                        label="Teacher"
                        name="teacher"
                        value="teacher"
                        control={<Radio />}
                      />
                    </RadioGroup>
                  </Box>
                  <Box marginBottom={2}>
                    <FormControlLabel
                      control={<Checkbox color="primary" value="accept" />}
                      label="Accept the tern of service"
                    />
                  </Box>
                  <Button fullWidth style={{ backgroundColor: '#FF5722', color: '#FFFFFF' }}>
                    Create account
                  </Button>
                </form>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Signup;
