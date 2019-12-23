import Head from 'next/head';
import NextLink from 'next/link';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

import Link from '@material-ui/core/Link';
import CountDown from 'react-countdown-now';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import RadioGroup from '@material-ui/core/RadioGroup';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import withLayout from '../../../../../../../components/hoc/withLayout';
import withCourse from '../../../../../../../components/hoc/withCourse';
import absURL from '../../../../../../../components/helpers/URL';
import AppUser from '../../../../../../../components/auth/AppUser';

class Question extends React.Component {
  render() {
    const { value, idx } = this.props;
    return (
      <>
        <Typography>{`Question ${idx + 1}: ${value}`}</Typography>
      </>
    );
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.value !== this.props.value) {
      return true;
    }
    return false;
  }
}

class Choice extends React.Component {
  render() {
    const { idx, value, onClick } = this.props;
    return (
      <>
        <Box display="flex" alignItems="center">
          <FormControlLabel value={`choice${idx}`} control={<Radio />} onClick={onClick} />
          <Typography>{String(value)}</Typography>
        </Box>
      </>
    );
  }
}

class SubmitedButton extends React.Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <Grid item>
        <Box marginY={3}>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Grid>
    );
  }
  shouldComponentUpdate() {
    return false;
  }
}

class ExamPage extends React.Component {
  static displayName = 'ExamPage';
  constructor(props) {
    super(props);
    this.state = { examData: undefined };
    this.editAnswer = this.editAnswer.bind(this);
  }
  static contextType = AppUser;
  async handleSubmit() {
    event.preventDefault();
    const { router } = this.props;
    const dataSubmit = {
      content: this.state.examData.content,
      studentId: this.context.user.id
    };
    try {
      const result = await fetch(
        absURL(`/api/user/${router.query.userId}/course/${router.query.courseId}/exam/${router.query.examId}`),
        {
          method: 'POST',
          credentials: 'include',
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataSubmit)
        }
      );
      const examData = await result.json();
      if (examData.successful) {
        router.replace(`/user/${router.query.userId}/course/${router.query.courseId}/exam`);
        return;
      } else {
        console.log(examData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  renderTime({ hours, minutes, seconds, completed }) {
    if (completed) {
      this.handleSubmit();
    } else {
      return <span>{`${hours}:${minutes}:${seconds}`}</span>;
    }
  }

  editAnswer(questionIdx, choiceIdx) {
    const newQuestions = this.state.examData.content.map((currentQuestion, currentQuestionIndex) => {
      if (currentQuestionIndex === questionIdx) {
        return {
          ...currentQuestion,
          answer: choiceIdx + 1
        };
      }
      return currentQuestion;
    });
    this.setState({
      examData: {
        ...this.state.examData,
        content: newQuestions
      }
    });
  }

  componentDidMount() {
    const { router } = this.props;
    fetch(absURL(`/api/user/${router.query.userId}/course/${router.query.courseId}/exam/${router.query.examId}`))
      .then((response) => response.json())
      .then((data) => {
        this.setState({ examData: data.exam });
      });
  }

  render() {
    const { user, course } = this.props;
    const state = this.state;

    return (
      <>
        <Head>
          <title>{state.examData ? `${state.examData.title}` : 'Loading'}</title>
        </Head>
        <Container maxWidth="xl">
          <Box py={3} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Breadcrumbs separator="/" aria-label="breadcrumb">
              <NextLink href="/user/[userId]" as={`/user/${user.id}`} prefetch={false}>
                <Link co lor="textPrimary" href="/">
                  <Typography variant="h5">{user.username}</Typography>
                </Link>
              </NextLink>
              <NextLink
                href="/user/[userId]/course/[courseId]"
                as={`/user/${user.id}/course/${course.id}`}
                prefetch={false}
              >
                <Link color="textPrimary" href={`/user/${user.id}/course/${course.id}`}>
                  <Typography variant="h5">{course.course_name}</Typography>
                </Link>
              </NextLink>
              <NextLink href="/" as="/" prefetch={false}>
                <Link color="textPrimary" href="/">
                  <Typography variant="h5">{state.examData ? `${state.examData.title}` : 'Loading'}</Typography>
                </Link>
              </NextLink>
            </Breadcrumbs>
            <Box>
              <AccessAlarmIcon />
              &nbsp;
              <CountDown
                date={state.examData ? Date.now() + Number(state.examData.duration) * 60 * 1000 : Date.now() + 1000}
                renderer={this.renderTime}
              />
            </Box>
          </Box>
          <Grid container justify="center">
            <Grid item xs={12}>
              <Grid container alignItems="stretch" direction="column">
                <Box py={2} />
                <Grid item>
                  {this.state.examData !== undefined ? (
                    this.state.examData.content.map((currentQuestion, questionIdx) => (
                      <Fragment key={questionIdx}>
                        <Paper>
                          <Box py={1} px={2}>
                            <Question value={currentQuestion.question} idx={questionIdx} />
                            <Box py={1} />
                            <RadioGroup>
                              {currentQuestion.choices.map((currentChoice, choiceIdx) => (
                                <Choice
                                  key={choiceIdx}
                                  value={currentChoice}
                                  idx={choiceIdx}
                                  onClick={() => this.editAnswer(questionIdx, choiceIdx)}
                                />
                              ))}
                            </RadioGroup>
                            <Typography>{`${currentQuestion.point} ${
                              currentQuestion.point > 1 ? 'points' : 'point'
                            }`}</Typography>
                          </Box>
                        </Paper>
                        <Box py={1} />
                        <Divider />
                        <Box py={1} />
                      </Fragment>
                    ))
                  ) : (
                    <Box textAlign="center">
                      <Typography variant="h5">Loading....</Typography>
                    </Box>
                  )}
                </Grid>
                <SubmitedButton handleSubmit={(event) => this.handleSubmit(event)} />
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
}

ExamPage.propTypes = {
  user: PropTypes.object.isRequired,
  course: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired
};
Question.propTypes = {
  value: PropTypes.string.isRequired,
  idx: PropTypes.number.isRequired
};
Choice.propTypes = {
  value: PropTypes.string.isRequired,
  idx: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired
};
SubmitedButton.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};
export default withLayout(withCourse(withRouter(ExamPage)));
