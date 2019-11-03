import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';

import Radio from '@material-ui/core/Radio';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

const OrangeRadio = withStyles({
  root: {
    color: '#FF5500',
    '&$checked': {
      color: '#FF5500'
    }
  },
  checked: {}
})(props => <Radio color="default" {...props} />);

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    backgroundColor: '#FF5500',
    color: 'white',
    fontWeight: 'bold',
    width: '15%',
    '&:hover': {
      backgroundColor: deepOrange[900]
    }
  },
  item: {
    minWidth: '50%'
  },
  textField: {
    width: '100%',
    '&.Mui-focused fieldset': {
      borderWidth: '3px',
      borderColor: 'black'
    }
  }
}));

import withLayout from '../../components/lib/withLayout';

function CreateCourse() {
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Create course</title>
      </Head>
      <Box>
        <Container maxWidth="lg">
          <Grid container direction="column" spacing={1} alignItems="center" justify="center">
            <Grid item xs={8} className={classes.item}>
              <Box className="pt-3" component="h1">
                Create new course
              </Box>
              <Divider />
            </Grid>
            <Grid item xs={8} className={classes.item}>
              <Box component="h3">Course Name</Box>
              <TextField
                className={classes.textField}
                required
                id="course-name"
                variant="outlined"
                label="Course name"
                margin="normal"
              />
            </Grid>
            <Grid item xs={8} className={classes.item}>
              <Box component="h3">Description(Optional)</Box>
              <TextField
                className={classes.textField}
                multiline
                id="description"
                variant="outlined"
                label="Course description"
                margin="normal"
              />
            </Grid>
            <Grid item xs={8} className={classes.item}>
              <RadioGroup defaultValue="Public" aria-label="privacy" name="customized-radios" row>
                <FormControlLabel value="public" control={<OrangeRadio />} label="Public" />
                <FormControlLabel value="private" control={<OrangeRadio />} label="Private" />
              </RadioGroup>
            </Grid>
            <Grid item xs={8} className={classes.item}>
              <Button variant="contained" className={classes.button}>
                Create
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default withLayout(CreateCourse);
