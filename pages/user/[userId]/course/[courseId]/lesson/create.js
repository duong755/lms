import React from 'react';
import Head from 'next/head';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import withLayout from '../../../../../../components/lib/withLayout';
import MuiRte from '../../../../../../components/MuiRte';

function CreateLesson() {
  return (
    <>
      <Head>
        <title> Create Lesson</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container component="main" justify="center">
            <Grid item xs={12} sm={10} md={8}>
              <Box border="1px solid black">
                <Box component="h1">
                  <Typography color="primary" variant="h4">
                    <strong>Create new lesson jhfjehjfejk</strong>
                  </Typography>
                </Box>

                <Box display="flex" flexDirection="column">
                  <Box marginBottom="20px">
                    <Box>Lesson Title</Box>
                    <Box bgcolor="#FFFFFF">
                      <TextField autoFocus variant="outlined" fullWidth></TextField>
                    </Box>
                  </Box>

                  <Box marginBottom="20px">
                    <Box>Lesson Detail</Box>
                    <Box>
                      <MuiRte />
                    </Box>
                  </Box>

                  <Box width="80px">
                    <Button variant="outlined" style={{ color: '#FF5722' }} fullWidth>
                      Post
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
export default withLayout(CreateLesson);
