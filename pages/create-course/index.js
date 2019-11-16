import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import NoSsr from '@material-ui/core/NoSsr';

import ReactSelect from 'react-select';

import withLayout from '../../components/lib/withLayout';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    width: '15%',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  item: {
    minWidth: '100%'
  },
  textField: {
    width: '100%',
    '&.Mui-focused fieldset': {
      width: '100%',
      borderWidth: '3px',
      borderColor: theme.palette.common.black
    }
  }
}));

function CreateCourse() {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Create course</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container justify="center">
            <Grid item xs={12} sm={8}>
              <Grid container direction="column" spacing={1} alignItems="stretch">
                <Grid item className={classes.item}>
                  <Box paddingTop={3} component="h1">
                    Create new course
                  </Box>
                  <Divider />
                </Grid>
                <Grid item className={classes.item}>
                  <Box component="h3">Course Name</Box>
                  <TextField className={classes.textField} required id="course-name" variant="outlined" />
                </Grid>
                <Grid item className={classes.item}>
                  <Box component="h3">Description(Optional)</Box>
                  <TextField className={classes.textField} multiline id="description" variant="outlined" />
                </Grid>
                {/* <Grid item xs={12} sm={8} className={classes.item}>
                    <RadioGroup defaultValue="Public" aria-label="privacy" name="customized-radios" row>
                      <FormControlLabel value="public" control={<Radio color="primary" />} label="Public" />
                      <FormControlLabel value="private" control={<Radio color="primary" />} label="Private" />
                    </RadioGroup>
                  </Grid> */}
                <Grid item className={classes.item}>
                  <Box component="h3">Topics</Box>
                  <NoSsr>
                    <ReactSelect isMulti options={[{ label: 'A', value: 0 }, { label: 'B', value: 1 }]} />
                  </NoSsr>
                </Grid>
                <Grid item xs={12} sm={8} className={classes.item}>
                  <Divider />
                </Grid>
                <Grid item xs={12} sm={8} className={classes.item}>
                  <Button variant="contained" className={classes.button}>
                    Create
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default withLayout(CreateCourse);
