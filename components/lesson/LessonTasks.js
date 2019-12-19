import { useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import clsx from 'clsx';
import { convertToRaw, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

import Box from '@material-ui/core/Box';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import MuiRte from 'mui-rte';

import { LessonType } from '../propTypes';
import absURL from '../helpers/URL';
import { useFormStyles } from '../styles/form';

const EditLessonSchema = Yup.object().shape({
  title: Yup.string().required('Lesson title must not be empty'),
  content: Yup.string().required('Lesson content must not be empty')
});

/**
 * @type {React.FunctionComponent<{ lesson: Lesson }>}
 */
const LessonTasks = (props) => {
  const [formOpen, setFormOpen] = useState(false);
  const muiRef = useRef();
  const router = useRouter();
  const formClasses = useFormStyles();

  const initialLessonValues = useMemo(() => {
    const { lesson } = props;
    return {
      title: lesson.title,
      content: lesson.content
    };
  }, [props.lesson]);

  const handleDeleteLesson = useCallback(async () => {
    const { teacher_id, course_id, id, title } = props.lesson;
    if (confirm(`Are you sure that you want to delete "${title}"?`)) {
      try {
        const deleteLessonRes = await fetch(absURL(`/api/user/${teacher_id}/course/${course_id}/lesson/${id}`), {
          method: 'DELETE',
          credentials: 'include'
        });
        const deleteLessonJson = await deleteLessonRes.json();
        if (deleteLessonJson.successful) {
          router.replace(`/user/${teacher_id}/course/${course_id}/lesson`);
        }
      } catch (deleteLessonErr) {
        console.error(deleteLessonErr);
      }
    }
  }, [props.lesson.teac, props.lesson.course_id, props.lesson.id, props.lesson.title]);

  const formik = useFormik({
    validationSchema: EditLessonSchema,
    enableReinitialize: true,
    initialValues: initialLessonValues,
    onSubmit: async (values, helpers) => {
      try {
        const { userId, courseId, lessonId } = router.query;
        const response = await fetch(absURL(`/api/user/${userId}/course/${courseId}/lesson/${lessonId}`), {
          method: 'PUT',
          credentials: 'include',
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        const json = await response.json();
        if (json.successful) {
          router.replace(`/user/${userId}/course/${courseId}/lesson/${lessonId}`);
          return;
        } else {
          // need notification
          console.log(json);
        }
      } catch (error) {
        // need notification
        console.log(error);
      } finally {
        helpers.setSubmitting(false);
      }
    },
    onReset: (values, helpers) => {
      helpers.resetForm({
        errors: {
          title: '',
          content: ''
        },
        values: initialLessonValues,
        touched: {
          title: false,
          content: false
        }
      });
    }
  });
  const { values, touched, errors, handleChange, handleSubmit, handleReset, setFieldValue } = formik;

  return ((
    <>
      <Box display="flex" justifyContent="flex-end" pb={3}>
        <Button
          color="secondary"
          size="small"
          variant="outlined"
          startIcon={<Icon>edit</Icon>}
          onClick={() => setFormOpen(true)}
        >
          Edit
        </Button>
        &nbsp;
        <Button
          color="secondary"
          size="small"
          variant="outlined"
          startIcon={<Icon>delete</Icon>}
          onClick={handleDeleteLesson}
        >
          Delete
        </Button>
      </Box>

      <Dialog
        fullWidth
        maxWidth={false}
        open={formOpen}
        onBackdropClick={() => {
          setFormOpen(false);
          handleReset();
        }}
      >
        <DialogTitle>
          <TextField
            fullWidth
            placeholder="Lesson Title"
            value={values.title}
            onChange={handleChange('title')}
            helperText={touched.title && errors.title}
            FormHelperTextProps={{
              className: clsx(formClasses.formHelperText)
            }}
          />
        </DialogTitle>
        <DialogContent>
          <MuiRte
            label="Type something here..."
            ref={muiRef}
            inlineToolbar
            value={JSON.stringify(convertToRaw(stateFromHTML(values.content)))}
            onSave={(data) => {
              const htmlContent = stateToHTML(convertFromRaw(JSON.parse(data)));
              setFieldValue('content', htmlContent);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            disabled={formik.isSubmitting}
            onClick={() => {
              muiRef.current.save();
              handleSubmit();
            }}
          >
            Save changes
          </Button>
          &nbsp;
          <Button
            color="primary"
            variant="text"
            onClick={() => {
              setFormOpen(false);
              handleReset();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ));
};

LessonTasks.propTypes = {
  lesson: LessonType.isRequired
};

export default LessonTasks;
