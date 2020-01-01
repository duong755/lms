/**
 * @typedef {{ id: string, email: string, username: string, type: 'teacher' | 'student', info: Object<string, string> }} User
 * @typedef {{ id: string, teacher_id: string, course_name: string, created_at: string, archive?: boolean, description?: string, topics?: string | string[], members?: string | string[] }} Course
 * @typedef {{ teacher_id: string, course_id: string, lesson_id: string, id: string, user_id: string, content: string }} Comment
 */
import NextLink from 'next/link';
import dayjs from 'dayjs';

import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

import { UserType, CommentType } from '../../propTypes';
import { getDateFromTimeUuid } from '../../helpers/timeuuid';

/**
 * @type {React.FunctionComponent<{ user: User, comment: Comment }>}
 */
const CommentItem = (props) => {
  const { user, comment } = props;
  return ((
    <Paper>
      <Box px={2} py={3}>
        <Box pr={5}>
          <NextLink href="/user/[userId]" as={`/user/${user.id}`} prefetch={false}>
            <Link color="primary" href={`/user/${user.id}`}>
              <Typography variant="h5">
                <strong>{user.username}</strong>
              </Typography>
            </Link>
          </NextLink>
        </Box>
        <Box display="flex" alignItems="center" pb={1}>
          <Icon>access_time</Icon>
          &nbsp;
          <Typography>{dayjs(getDateFromTimeUuid(comment.id).format('YYYY MMM D hh:mm'))}</Typography>
        </Box>
        <Box dangerouslySetInnerHTML={{ __html: comment.content }}></Box>
      </Box>
    </Paper>
  ));
};

CommentItem.propTypes = {
  user: UserType.isRequired,
  comment: CommentType.isRequired
};

export default CommentItem;
