import React, { useContext } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';

import withLayout from '../../../../../../components/lib/withLayout';
import MuiRte from '../../../../../../components/MuiRte';
import AppUser from '../../../../../../components/auth/AppUser';

function CreateLessonForm() {
  const userContext = useContext(AppUser);
  const router = useRouter();
}

function CreateLesson() {
  return (
    <>
      <Head>
        <title> Create Lesson</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container justify="center">
            <Grid item xs={12} sm={8}>
              <Grid container direction="column" spacing={1} alignItems="stretch">
                <Grid item>
                  <Box py={2}>
                    <Typography variant="h4">
                      <strong>Create new lesson</strong>
                    </Typography>
                  </Box>
                  <Divider />
                </Grid>
                <Box py={1} />
                <Grid item>
                  <InputLabel htmlFor="title">Title</InputLabel>
                  <TextField autoFocus variant="outlined" fullWidth id="title"></TextField>
                </Grid>
                <Box py={1} />
                <Grid item>
                  <InputLabel htmlFor="content">Lesson details</InputLabel>
                  <MuiRte label="Type something here...." inlineToolbar={true} />
                </Grid>
                <Box py={1} />
                <Box>
                  <Button variant="contained" color="primary">
                    Post
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
export default withLayout(CreateLesson);
