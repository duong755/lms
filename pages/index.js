import Head from 'next/head';
import NextLink from 'next/link';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const courses = [
  {
    name: 'Database',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    tags: ['int2207', 'database', 'sql']
  },
  {
    name: 'Web',
    description: 'Fusce non condimentum risus, eu vehicula ante. Nunc pharetra semper tellus ac rhoncus.',
    tags: ['html', 'css', 'javascript', 'http']
  },
  {
    name: 'Discrete Mathematics',
    description:
      'Pellentesque id nisi lorem. Vivamus consequat arcu sollicitudin, lobortis nisi sit amet, finibus risus.',
    tags: ['combinatoric', 'logic', 'proposition', 'graph']
  }
];

import withLayout from '../components/lib/withLayout';

function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Grid container spacing={1}>
            <Grid item md={3} sm={12}>
              <Grid container>
                <Grid item md={12} sm={4} xs={3}>
                  <Box>
                    <img src="/static/favicon.ico" style={{ width: '100%' }} />
                  </Box>
                </Grid>
                <Grid item md={12} sm={8} xs={9}>
                  <Typography title="Ngo Quang Duong" noWrap variant="h5">
                    Ngo Quang Duong
                  </Typography>
                  <Typography title="QuangDuong120198" noWrap variant="h6">
                    QuangDuong120198
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <Box className="d-flex">
                    <Icon>edit_location</Icon>
                    <Typography noWrap className="pl-2">
                      Hai Ba Trung, Ha Noi, Viet Nam
                    </Typography>
                  </Box>
                  <Box className="d-flex">
                    <Icon>mail</Icon>
                    <Typography noWrap className="pl-2">
                      <NextLink href="/">
                        <Link href="/">ngo.quang.duong.1100@gmail.com</Link>
                      </NextLink>
                    </Typography>
                  </Box>
                  <Box className="d-flex">
                    <Icon>link</Icon>
                    <Typography noWrap className="pl-2">
                      <Link>blah blah</Link>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={9} sm={12}>
              <Box className="pt-3" component="h3">
                Courses
              </Box>
              <hr />
              <Box>
                <TextField
                  id="outlined-bare"
                  defaultValue="Bare"
                  margin="normal"
                  variant="outlined"
                  style={{ width: '100%' }}
                  InputProps={{
                    'aria-label': 'bare',
                    endAdornment: (
                      <InputAdornment
                        onClick={() => {
                          console.log('hello user');
                        }}
                      >
                        <Icon>search</Icon>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              {courses.map((currentCourse, currentCourseIndex) => {
                return (
                  <Paper className="p-2 mt-2" key={currentCourseIndex}>
                    <Box className="m-0" component="h3">
                      {currentCourse.name}
                    </Box>
                    <Typography className="pt-2 pb-2">{currentCourse.description}</Typography>
                    <Box>
                      {currentCourse.tags.map((currentTag, currentTagIndex) => {
                        return (
                          <Button
                            className="mr-2"
                            size="small"
                            color="primary"
                            variant="outlined"
                            key={currentTagIndex}
                          >
                            {currentTag}
                          </Button>
                        );
                      })}
                    </Box>
                  </Paper>
                );
              })}

              <Box className="p-3">
                <ul className="pagination d-flex justify-content-center">
                  <li className="page-item">
                    <Link className="page-link" href="#">
                      Previous
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="#">
                      1
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="#">
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="#">
                      3
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link className="page-link" href="#">
                      Next
                    </Link>
                  </li>
                </ul>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default withLayout(Home);
