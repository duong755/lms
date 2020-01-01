import { useState, useCallback } from 'react';
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import MuiRte from 'mui-rte';

import { useFormStyles } from '../../styles/form';

const CommentEditor = () => {
  const [commentState, setCommentState] = useState(EditorState.createEmpty());
  const [commentError, setCommentError] = useState(false);
  const formClasses = useFormStyles();

  const handlePostComment = useCallback(() => {
    if (
      commentState
        .getCurrentContent()
        .getPlainText()
        .trim()
    ) {
      console.log(stateToHTML(commentState.getCurrentContent()));
      return;
    }
    setCommentError(true);
  }, [commentState]);

  return (
    <Paper>
      <Box px={2} py={3}>
        <Typography variant="h5">
          <strong>Comment</strong>
        </Typography>
        <NoSsr>
          <MuiRte
            onChange={(data) => {
              setCommentError(false);
              setCommentState(data);
            }}
          />
        </NoSsr>
        {commentError && <Typography className={formClasses.formHelperText}>Comment must not be empty</Typography>}
        <Box py={1} />
        <Button variant="contained" color="primary" onClick={handlePostComment}>
          Post Comment
        </Button>
      </Box>
    </Paper>
  );
};

export default CommentEditor;
