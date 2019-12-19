/**
 * @typedef {{ teacher_id: string, course_id: string, id: string, title: string, content: string }} Lesson
 */
import { useContext, useMemo, useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { isObject } from 'lodash';
import fetch from 'isomorphic-unfetch';
import clsx from 'clsx';
import { convertToRaw, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import NoSsr from '@material-ui/core/NoSsr';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import MuiRte from 'mui-rte';

import { UserType, CourseType, LessonType } from '../../../../../../../components/propTypes';
import withLayout from '../../../../../../../components/lib/withLayout';
import NotFound from '../../../../../../../components/NotFound';
import absURL from '../../../../../../../components/helpers/URL';
import AppUser from '../../../../../../../components/auth/AppUser';
import { useFormStyles } from '../../../../../../../components/styles/form';

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

const LessonDetail = (props) => {
  const { user, course, lesson } = props;
  const userContext = useContext(AppUser);

  const isCourseCreator = useMemo(() => {
    if (isObject(userContext.user)) {
      if (user) {
        if (userContext.user.id === user.id) {
          return true;
        }
        return false;
      }
      return false;
    }
    return false;
  }, [userContext.user]);

  return (
    <>
      <Head>
        <title>{lesson ? lesson.title : 'Lesson Not Found'}</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
          {user && course && lesson ? (
            <>
              <Box py={3}>
                <Breadcrumbs separator="/" aria-label="breadcrumb">
                  <NextLink href="/user/[userId]" as={`/user/${user.id}`} prefetch={false}>
                    <Link color="textPrimary" href={`/user/${user.id}`}>
                      <Typography variant="h5">{user.username}</Typography>
                    </Link>
                  </NextLink>
                  <NextLink
                    href="/user/[userId]/course/[courseId]"
                    as={`/user/${user.id}/course/${course.id}`}
                    prefetch={false}
                  >
                    <Link color="textPrimary" href={`/user/${user.id}/course/${course.id}`}>
                      <Typography variant="h5">
                        <strong>{course.course_name}</strong>
                      </Typography>
                    </Link>
                  </NextLink>
                  <Typography variant="h5" color="textPrimary">
                    <strong>{lesson.title}</strong>
                  </Typography>
                </Breadcrumbs>
              </Box>

              <NoSsr>{isCourseCreator && <LessonTasks lesson={lesson} />}</NoSsr>

              <Paper>
                <Box px={2} py={3}>
                  <div id="lessonContent" dangerouslySetInnerHTML={{ __html: lesson.content }}></div>
                </Box>
              </Paper>
              <Divider color="initial" />
            </>
          ) : (
            <Box py={3} textAlign="center">
              <NotFound user={user} course={course} lesson={lesson} item="lesson" />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

LessonDetail.getInitialProps = async (context) => {
  const { userId, courseId, lessonId } = context.query;
  let user = {};
  let course = {};
  let lesson = {};

  try {
    const userResponse = await fetch(absURL(`/api/user/${userId}`), {
      method: 'GET',
      credentials: 'include'
    });
    const courseResponse = await fetch(absURL(`/api/user/${userId}/course/${courseId}`), {
      method: 'GET',
      credentials: 'include'
    });
    const lessonResponse = await fetch(absURL(`/api/user/${userId}/course/${courseId}/lesson/${lessonId}`), {
      method: 'GET',
      credentials: 'include'
    });
    if (userResponse.ok) {
      user = await userResponse.json();
    }
    if (courseResponse.ok) {
      course = await courseResponse.json();
    }
    if (lessonResponse.ok) {
      lesson = await lessonResponse.json();
    }
  } catch (err) {
    console.error(err);
  }

  return {
    ...user,
    ...course,
    ...lesson
  };
};

LessonTasks.propTypes = {
  lesson: LessonType
};

LessonDetail.propTypes = {
  user: UserType,
  course: CourseType,
  lesson: LessonType
};

export default withLayout(LessonDetail);
