import { Fragment } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { withRouter } from 'next/router';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';

import { KeyboardDateTimePicker } from '@material-ui/pickers';

import withLayout from '../../../../../../components/hoc/withLayout';
import withCourse from '../../../../../../components/hoc/withCourse';
import absURL from '../../../../../../components/helpers/URL';
import { UserType, CourseType } from '../../../../../../components/propTypes';

class Header extends React.Component {
  render() {
    const { startAt, editStartAt, duration, editDuration, title, handleChangeTitle } = this.props;
    return (
      <>
        <Grid item>
          <Box py={2}>
            <Typography variant="h4">
              <strong>Create new exam</strong>
            </Typography>
          </Box>
          <Divider />
        </Grid>
        <Box py={1} />
        <Grid item>
          <TextField value={title} fullWidth onChange={handleChangeTitle} placeholder="Exam Title" />
        </Grid>
        <Box py={1} />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <KeyboardDateTimePicker
              name="startAt"
              fullWidth
              ampm={false}
              format="YYYY MMM D hh:mm"
              disablePast
              value={dayjs(startAt).toDate()}
              onChange={editStartAt}
              label="Start at"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Duration" value={duration} onChange={editDuration} fullWidth />
          </Grid>
        </Grid>
      </>
    );
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.duration !== this.props.duration) {
      return true;
    }
    if (nextProps.startAt !== this.props.startAt) {
      return true;
    }
    if (nextProps.title !== this.props.title) {
      return true;
    }
    return false;
  }
}

class Question extends React.Component {
  render() {
    const { value, onChange } = this.props;
    return <TextField fullWidth multiline placeholder="Question..." value={value} onChange={onChange} />;
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
    const { idx, value, onChange, onClick } = this.props;
    return (
      <>
        <Box display="flex">
          <FormControlLabel value={`choice${idx}`} control={<Radio />} onClick={onClick} />
          <TextField placeholder="Choice..." multiline fullWidth value={value} onChange={onChange} />
        </Box>
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

class DeleteQuestionButton extends React.Component {
  render() {
    const { deleteQuestion } = this.props;
    return (
      <IconButton onClick={deleteQuestion}>
        <Icon>delete</Icon>
      </IconButton>
    );
  }
  shouldComponentUpdate() {
    return false;
  }
}

class PointAndDelete extends React.Component {
  render() {
    const { point, deleteQuestion, handlePoint } = this.props;
    return (
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex">
          <TextField type="number" value={point} placeholder="Point" onChange={handlePoint} />
          <Typography>point{point > 1 && 's'}</Typography>
        </Box>
        <DeleteQuestionButton deleteQuestion={deleteQuestion} />
      </Box>
    );
  }
  shouldComponentUpdate(nextProps) {
    if (nextProps.point !== this.props.point) {
      return true;
    }
    return false;
  }
}

class AddQuestionButton extends React.Component {
  render() {
    const { addQuestion } = this.props;
    return (
      <IconButton onClick={addQuestion}>
        <Icon>add_circle_outlined</Icon>
      </IconButton>
    );
  }
  shouldComponentUpdate() {
    return false;
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

class CreateExamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startAt: new Date().getTime(),
      duration: 0,
      title: '',
      content: [
        {
          question: '',
          choices: ['', '', '', ''],
          answer: '',
          point: 1
        }
      ]
    };
  }

  editQuestion(event, questionIdx) {
    const newQuestions = this.state.content.map((currentQuestion, questionIndex) => {
      if (questionIdx === questionIndex) {
        return {
          ...currentQuestion,
          question: event.target.value
        };
      }
      return currentQuestion;
    });
    this.setState({
      content: newQuestions
    });
  }

  editChoice(event, questionIdx, choiceIdx) {
    const newQuestions = this.state.content.map((currentQuestion, questionIndex) => {
      if (questionIdx === questionIndex) {
        return {
          ...currentQuestion,
          choices: currentQuestion.choices.map((currentChoice, choiceIndex) => {
            if (choiceIdx === choiceIndex) {
              return event.target.value;
            }
            return currentChoice;
          })
        };
      }
      return currentQuestion;
    });
    this.setState({
      content: newQuestions
    });
  }

  addQuestion(questionIdx) {
    const newQuestion = {
      question: '',
      choices: ['', '', '', ''],
      answer: '',
      point: 1
    };

    const newQuestions = [
      ...this.state.content.slice(0, questionIdx + 1),
      newQuestion,
      ...this.state.content.slice(questionIdx + 1)
    ];

    this.setState({ content: newQuestions });
  }

  deleteQuestion(questionIdx) {
    if (this.state.content.length === 1) {
      return;
    }

    const newQuestions = [...this.state.content.slice(0, questionIdx), ...this.state.content.slice(questionIdx + 1)];

    this.setState({
      content: newQuestions
    });
  }

  editPoint(event, questionIdx) {
    const newQuestions = this.state.content.map((currentQuestion, questionIndex) => {
      if (questionIdx === questionIndex) {
        return {
          ...currentQuestion,
          point: Number(event.target.value) || 1
        };
      }
      return currentQuestion;
    });
    this.setState({
      content: newQuestions
    });
  }

  editAnswer(questionIdx, choiceIdx) {
    const newQuestions = this.state.content.map((currentQuestion, questionIndex) => {
      if (questionIdx === questionIndex) {
        return {
          ...currentQuestion,
          answer: choiceIdx + 1
        };
      }
      return currentQuestion;
    });
    this.setState({
      content: newQuestions
    });
  }

  handleDuration(event) {
    this.setState({
      duration: event.target.value
    });
  }

  handleStartedTime(event) {
    this.setState({
      startAt: new Date(event).getTime()
    });
  }

  editTitle(event) {
    this.setState({
      title: event.target.value
    });
  }

  async handleSubmit() {
    event.preventDefault();
    const { router } = this.props;
    try {
      const result = await fetch(absURL(`/api/user/${router.query.userId}/course/${router.query.courseId}/exam`), {
        method: 'POST',
        body: JSON.stringify(this.state),
        credentials: 'include',
        mode: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await result.json();
      if (json.successful) {
        router.replace(`/user/${router.query.userId}/course/${router.query.courseId}/exam/${json.examId}`);
        return;
      } else {
        console.log(json);
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    return (
      <Container maxWidth="xl">
        <Grid container justify="center">
          <Grid item xs={12} sm={8}>
            <Grid container alignItems="stretch" direction="column">
              <Header
                duration={this.state.duration}
                editDuration={(event) => this.handleDuration(event)}
                startAt={this.state.startAt}
                editStartAt={(event) => this.handleStartedTime(event)}
                title={this.state.title}
                handleChangeTitle={(event) => this.editTitle(event)}
              />
              <Box py={2} />
              <Grid item>
                {this.state.content.map((currentQuestion, questionIdx) => (
                  <Fragment key={questionIdx}>
                    <Paper>
                      <Box py={1} px={2}>
                        <Box display="flex" flexDirection="row-reverse">
                          <AddQuestionButton addQuestion={() => this.addQuestion(questionIdx)} />
                        </Box>
                        <Question
                          value={currentQuestion.question}
                          onChange={(event) => this.editQuestion(event, questionIdx)}
                        />
                        <Box py={2} />
                        <RadioGroup>
                          {currentQuestion.choices.map((currentChoice, choiceIdx) => (
                            <Choice
                              key={choiceIdx}
                              value={currentChoice}
                              idx={choiceIdx}
                              onClick={() => this.editAnswer(questionIdx, choiceIdx)}
                              onChange={(event) => this.editChoice(event, questionIdx, choiceIdx)}
                            />
                          ))}
                        </RadioGroup>
                        <PointAndDelete
                          point={currentQuestion.point}
                          deleteQuestion={() => this.deleteQuestion(questionIdx)}
                          handlePoint={(event) => this.editPoint(event, questionIdx)}
                        />
                      </Box>
                    </Paper>
                    <Box py={1} />
                    <Divider />
                    <Box py={1} />
                  </Fragment>
                ))}
              </Grid>
              <SubmitedButton handleSubmit={(event) => this.handleSubmit(event)} />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

CreateExamPage.propTypes = {
  router: PropTypes.object,
  user: UserType.isRequired,
  course: CourseType.isRequired
};

Header.propTypes = {
  startAt: PropTypes.number.isRequired,
  editStartAt: PropTypes.func.isRequired,
  duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  editDuration: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  handleChangeTitle: PropTypes.func.isRequired
};

Question.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

Choice.propTypes = {
  idx: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
};

DeleteQuestionButton.propTypes = {
  deleteQuestion: PropTypes.func.isRequired
};

PointAndDelete.propTypes = {
  point: PropTypes.number.isRequired,
  handlePoint: PropTypes.func.isRequired,
  deleteQuestion: PropTypes.func.isRequired
};

AddQuestionButton.propTypes = {
  addQuestion: PropTypes.func.isRequired
};

SubmitedButton.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default withLayout(withCourse(withRouter(CreateExamPage)));
