/**
 * @typedef {{ teacher_id: string, course_id: string, id: string, title: string, content: string }} Lesson
 */
import { useContext, useMemo } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { isObject } from 'lodash';
import fetch from 'isomorphic-unfetch';
import { convertToRaw } from 'draft-js';
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
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Snackbar from '@material-ui/core/Snackbar';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import MuiRte from '../../../../../../../components/MuiRte';
import { UserType, CourseType, LessonType } from '../../../../../../../components/propTypes';
import withLayout from '../../../../../../../components/lib/withLayout';
import absURL from '../../../../../../../components/helpers/URL';
import AppUser from '../../../../../../../components/auth/AppUser';
import { useMuiRteStyles } from '../../../../../../../components/styles/muirte';

const EditLessonSchema = Yup.object().shape({
  title: Yup.string().required(),
  content: Yup.string().required()
});

/**
 * @type {React.FunctionComponent<{ lesson: Lesson }>}
 */
const EditLessonForm = (props) => {
  const router = useRouter();
  const muirteClasses = useMuiRteStyles();

  const initialLessonValues = useMemo(() => {
    const { lesson } = props;
    return {
      title: lesson.title,
      content: lesson.content
    };
  }, [props.lesson]);

  const formik = useFormik({
    validationSchema: EditLessonSchema,
    enableReinitialize: true,
    initialValues: initialLessonValues,
    onSubmit: async (values, helpers) => {
      try {
        const respone = await fetch(absURL(`/api/user/${router.query.userId}/course/${router.query.courseId}/lesson`), {
          method: 'PUT',
          credentials: 'include',
          mode: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        const json = await respone.json();
        if (json.successful) {
          router.replace(`/user/${router.query.userId}/course/${router.query.courseId}/lesson/${json.lessonId}`);
          return;
        } else {
          console.log(json);
        }
      } catch (error) {
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
  const { values, handleChange, handleSubmit, handleReset, setFieldValue } = formik;
  return ((
    <Dialog fullWidth maxWidth={false} open>
      <DialogTitle>
        <Input fullWidth placeholder="Lesson Title" value={values.title} onChange={handleChange('title')} />
      </DialogTitle>
      <DialogContent>
        <MuiRte
          classes={muirteClasses}
          value={JSON.stringify(convertToRaw(stateFromHTML(values.content)))}
          onChange={(data) => setFieldValue('content', stateToHTML(data.getCurrentContent()))}
        />
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={handleSubmit}>
          Save
        </Button>
        &nbsp;
        <Button color="primary" variant="text" onClick={handleReset}>
          Cancel
        </Button>
        <Snackbar open anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }} />
      </DialogActions>
    </Dialog>
  ));
};

/**
 * @type {React.FunctionComponent<{ lesson: Lesson }>}
 */
const LessonTasks = (props) => {
  return ((
    <>
      <EditLessonForm lesson={props.lesson} />
      <Box display="flex" justifyContent="flex-end">
        <Button color="secondary" size="small" variant="outlined" startIcon={<Icon>edit</Icon>}>
          Edit
        </Button>
        &nbsp;
        <Button color="secondary" size="small" variant="outlined" startIcon={<Icon>delete</Icon>}>
          Delete
        </Button>
      </Box>
    </>
  ));
};

const LessonDetail = (props) => {
  const { user, course, lesson } = props;
  const userContext = useContext(AppUser);

  const isCourseCreator = useMemo(() => {
    if (isObject(userContext.user)) {
      if (userContext.user.id === user.id) {
        return true;
      }
      return false;
    }
    return false;
  }, [userContext.user]);

  return (
    <>
      <Head>
        <title>{lesson.title}</title>
      </Head>
      <Box>
        <Container maxWidth="xl">
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

          <Box py={3}>
            <div dangerouslySetInnerHTML={{ __html: lesson.content }}></div>
          </Box>
          <Divider color="initial" />
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
    user = await userResponse.json();
    course = await courseResponse.json();
    lesson = await lessonResponse.json();
  } catch (err) {
    console.error(err);
  }

  return {
    ...user,
    ...course,
    ...lesson
  };
};

EditLessonForm.propTypes = {
  lesson: LessonType.isRequired
};

LessonTasks.propTypes = {
  lesson: LessonType.isRequired
};

LessonDetail.propTypes = {
  user: UserType.isRequired,
  course: CourseType.isRequired,
  lesson: LessonType.isRequired
};

export default withLayout(LessonDetail);
