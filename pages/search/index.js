/**
 * @typedef {{ id: string, teacher_id: string, course_name: string, created_at: string, archive?: boolean, description?: string, topics?: string | string[], members?: string | string[] }} Course
 * @typedef {{ searchResults: { courses: Course[], total: number }, query?: string, topics?: string[] }} SearchProps
 */
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';
import clsx from 'clsx';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import ReactSelectAsync from 'react-select/async';

import withLayout from '../../components/lib/withLayout';
import absURL from '../../components/helpers/URL';
import { CourseType } from '../../components/propTypes';
import CourseItem from '../../components/CourseItem';
import { searchTopic } from '../../components/helpers/searchTopic';

const useStyles = makeStyles((theme) => ({
  cell: {
    padding: theme.spacing(2, 0)
  }
}));

/**
 * @type {React.FunctionComponent<SearchProps>}
 */
const SearchPage = (props) => {
  const { searchResults, query, topics, page } = props;
  const [currentPage, setCurrentPage] = useState(page);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(query);
  const [searchTopics, setSearchTopics] = useState(topics);

  useEffect(() => {
    router.push({
      pathname: '/search',
      query: { query: query, topics: encodeURIComponent(JSON.stringify(topics)), page: page }
    });
  }, [currentPage]);

  const totalPages = Math.ceil(searchResults.total / 10);
  const classes = useStyles();

  return ((
    <>
      <Head>
        <title>Search Results</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          <Box py={2}>
            <Typography variant="h5">
              Found <strong>{searchResults.total}</strong> results
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <TextField
              fullWidth
              variant="outlined"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <ReactSelectAsync
              isMulti
              placeholder="Select topics..."
              value={searchTopics}
              loadOptions={searchTopic}
              onChange={(value) => {
                if (value) {
                  setSearchTopics(value.map((currentSelectedOption) => currentSelectedOption.value));
                } else {
                  setSearchTopics([]);
                }
              }}
            />
            <Box pt={2}>
              <Button variant="contained" color="primary">
                <Icon>search</Icon>
              </Button>
            </Box>
          </Box>
          <Table>
            <TableBody>
              {searchResults.courses.map((currentCourse) => {
                return (
                  <TableRow key={currentCourse.id}>
                    <TableCell className={clsx(classes.cell)}>
                      <CourseItem course={currentCourse} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            {totalPages > 1 && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    count={searchResults.total}
                    page={currentPage - 1}
                    onChangePage={(event, page) => {
                      setCurrentPage(page + 1);
                    }}
                    rowsPerPage={10}
                    rowsPerPageOptions={[10]}
                  />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </Container>
      </Box>
    </>
  ));
};

SearchPage.getInitialProps = async (context) => {
  const { query, topics, page = 1 } = context.query;
  let parsedTopics = [];
  try {
    parsedTopics = JSON.parse(topics);
    if (parsedTopics instanceof Array) {
      parsedTopics = parsedTopics.filter((element) => typeof element === 'string');
    } else {
      parsedTopics = [];
    }
  } catch {
    parsedTopics = [];
  }
  const searchResults = { courses: [], total: 0 };
  try {
    const courseRes = await fetch(absURL(`/api/search?query=${query}&topics=${topics}&page=${page}`));
    const courseJson = await courseRes.json();
    Object.assign(searchResults, courseJson);
    return {
      page: Number(page) || 1,
      query: query,
      topics: parsedTopics || [],
      searchResults: searchResults
    };
  } catch (err) {
    console.error(err);
    return {
      page: Number(page) || 1,
      query: query,
      topics: parsedTopics || [],
      searchResults: searchResults
    };
  }
};

SearchPage.propTypes = {
  page: PropTypes.number,
  query: PropTypes.string,
  topics: PropTypes.arrayOf(PropTypes.string),
  searchResults: PropTypes.shape({
    courses: PropTypes.arrayOf(CourseType).isRequired,
    total: PropTypes.number.isRequired
  })
};

export default withLayout(SearchPage);
