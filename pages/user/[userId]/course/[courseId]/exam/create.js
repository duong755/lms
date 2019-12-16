import React from 'react';
import PropTypes from 'prop-types';
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
import Delete from '@material-ui/icons/Delete';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { AddCircleOutline } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';

import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import withLayout from '../../../../../../components/lib/withLayout';
import absURL from '../../../../../../components/helpers/URL';

class Header extends React.Component {
  render() {
    const { startAt, editStartedTime, duration, editDuration, title, handleChangeTitle } = this.props;
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
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDateTimePicker
                name="startAt"
                fullWidth
                ampm={false}
                format="dd/MM/yyyy HH:mm"
                disablePast
                value={new Date(startAt)}
                onChange={editStartedTime}
                label="Thời gian bắt đầu"
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6}>
            <label className="title">Thời lượng làm bài</label>
            <TextField
              name="duration"
              value={duration}
              onChange={editDuration}
              fullWidth
              placeholder="Thời lượng làm bài"
            />
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
    return (
      <>
        <TextField multiline placeholder="Nhập câu hỏi" fullWidth value={value} onChange={onChange} />
        {console.log('render Question')}
        <Box py={1} />
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
    const { idx, value, onChange, onClick } = this.props;
    return (
      <>
        <Box display="flex">
          <FormControlLabel value={`choice${idx}`} control={<Radio />} onClick={onClick} />
          {console.log('Render Choice')}
          <TextField placeholder="Nhập đáp án" multiline fullWidth value={value} onChange={onChange} />
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
      <>
        <Grid item>
          <IconButton onClick={deleteQuestion}>
            <Icon>
              <Delete fontSize="large" />
            </Icon>
          </IconButton>
        </Grid>
      </>
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
      <>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            {console.log('Render Point')}
            <Grid container>
              <TextField value={point} placeholder="Nhập điểm" onChange={handlePoint} />
              <Typography>điểm</Typography>
            </Grid>
          </Grid>
          <DeleteQuestionButton deleteQuestion={deleteQuestion} />
        </Grid>
      </>
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
      <>
        <IconButton onClick={addQuestion}>
          <Icon>
            <AddCircleOutline />
          </Icon>
        </IconButton>
      </>
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
      <>
        <Grid item>
          <Box marginY={3}>
            {console.log('render submited button')}
            <Button color="primary" variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Grid>
      </>
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
      questions: [
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
    const newQuestions = this.state.questions.map((currentQuestion, questionIndex) => {
      if (questionIdx === questionIndex) {
        return {
          ...currentQuestion,
          question: event.target.value
        };
      }
      return currentQuestion;
    });
    this.setState({
      questions: newQuestions
    });
  }

  editChoice(event, questionIdx, choiceIdx) {
    const newQuestions = this.state.questions.map((currentQuestion, questionIndex) => {
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
      questions: newQuestions
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
      ...this.state.questions.slice(0, questionIdx + 1),
      newQuestion,
      ...this.state.questions.slice(questionIdx + 1)
    ];

    this.setState({ questions: newQuestions });
  }

  deleteQuestion(questionIdx) {
    if (this.state.questions.length === 1) {
      return;
    }

    const newQuestions = [
      ...this.state.questions.slice(0, questionIdx),
      ...this.state.questions.slice(questionIdx + 1)
    ];

    this.setState({
      questions: newQuestions
    });
  }

  editPoint(event, questionIdx) {
    const newQuestions = this.state.questions.map((currentQuestion, questionIndex) => {
      if (questionIdx === questionIndex) {
        return {
          ...currentQuestion,
          point: event.target.value
        };
      }
      return currentQuestion;
    });
    this.setState({
      questions: newQuestions
    });
  }

  editAnswer(questionIdx, choiceIdx) {
    const newQuestions = this.state.questions.map((currentQuestion, questionIndex) => {
      if (questionIdx === questionIndex) {
        return {
          ...currentQuestion,
          answer: choiceIdx + 1
        };
      }
      return currentQuestion;
    });
    this.setState({
      questions: newQuestions
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
            {console.log('Render Container')}
            <Grid container alignItems="stretch" direction="column">
              <Header
                duration={this.state.duration}
                editDuration={(event) => this.handleDuration(event)}
                startAt={this.state.startAt}
                editStartedTime={(event) => this.handleStartedTime(event)}
                title={this.state.title}
                handleChangeTitle={(event) => this.editTitle(event)}
              />
              <Grid item>
                {this.state.questions.map((currentQuestion, questionIdx) => (
                  <Paper className="question" key={questionIdx} style={{ position: 'relative' }}>
                    <AddQuestionButton addQuestion={() => this.addQuestion(questionIdx)} />
                    <Question
                      value={currentQuestion.question}
                      onChange={(event) => this.editQuestion(event, questionIdx)}
                    />
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
                      handlePoint={(event) => this.editPoint(event)}
                    />
                  </Paper>
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
  router: PropTypes.object
};

Header.propTypes = {
  startAt: PropTypes.number.isRequired,
  editStartedTime: PropTypes.func.isRequired,
  duration: PropTypes.string.isRequired,
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

export default withLayout(withRouter(CreateExamPage));
