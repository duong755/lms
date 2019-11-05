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
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import withLayout from '../../components/lib/withLayout';

function Signup() {
  return (
    <>
      <Head>
        <title>Sign up to LMS</title>
      </Head>
      <Container maxWidth="xl">
        <Grid container component="main" justify="center">
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Box display="flex" flexDirection="column" alignItems="stretch" marginY={2}>
              <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
                <Typography>Join OpenLMS</Typography>
                <Typography component="h3" variant="h4">
                  <strong>Create an account</strong>
                </Typography>
              </Box>
              <Box>
                <form>
                  <Box paddingBottom={2}>
                    <Box fontWeight="bold" paddingBottom={1}>
                      Username
                    </Box>
                    <TextField autoFocus required variant="outlined" fullWidth name="username" type="text" />
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
                    <Box fontWeight="bold">Account Type</Box>
                    <RadioGroup name="position" row>
                      <FormControlLabel
                        labelPlacement="end"
                        label="Student"
                        name="student"
                        value="student"
                        control={<Radio color="primary" />}
                      />
                      <Box width={30} />
                      <FormControlLabel
                        labelPlacement="end"
                        label="Teacher"
                        name="teacher"
                        value="teacher"
                        control={<Radio color="primary" />}
                      />
                    </RadioGroup>
                  </Box>
                  <Box marginBottom={2}>
                    <FormControlLabel
                      control={<Checkbox color="primary" value="accept" />}
                      label="Accept the term of service"
                    />
                  </Box>
                  <Button fullWidth color="primary" variant="contained">
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

export default withLayout(Signup);
