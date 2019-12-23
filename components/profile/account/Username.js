import { useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import fetch from 'isomorphic-unfetch';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Snackbar from '@material-ui/core/Snackbar';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useFormStyles } from '../../styles/form';
import { useSettingsFormStyles } from '../../styles/settingsForm';
import absURL from '../../helpers/URL';
import AppUser from '../../auth/AppUser';
import ProfileNotification from '../Notification';

const UsernameSettings = (props) => {
  const userContext = useContext(AppUser);
  const notiContext = useContext(ProfileNotification);
  const formClasses = useFormStyles();
  const formSettingsClasses = useSettingsFormStyles();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { username: props.username },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .trim()
        .required('Username is required')
    }),
    onSubmit: async (values, helpers) => {
      if (values.username !== props.username) {
        try {
          const updateUsernameRes = await fetch(absURL('/api/user/username'), {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: values.username })
          });
          const json = await updateUsernameRes.json();
          if (updateUsernameRes.ok) {
            userContext.setUser({ ...userContext.user, username: values.username });
            notiContext.setNotification({ open: true, action: <Icon>check</Icon>, message: 'Username was updated' });
          } else {
            switch (updateUsernameRes.status) {
              case 401:
                notiContext.setNotification({
                  open: true,
                  action: <Icon>close</Icon>,
                  message: 'Please sign in to continue'
                });
                break;
              case 400:
                notiContext.setNotification({ open: true, action: <Icon>close</Icon>, message: json.error });
                break;
              default:
                notiContext.setNotification({ open: true, action: <Icon>close</Icon>, message: '' });
                break;
            }
          }
        } catch {
          notiContext.setNotification({ open: true, action: <Icon>times</Icon>, message: 'Username was not updated' });
        } finally {
          helpers.setSubmitting(false);
        }
      }
    },
    onReset: (values, helpers) => {
      helpers.resetForm({
        isSubmitting: false,
        isValidating: false,
        submitCount: 0,
        errors: { username: '' },
        touched: { username: '' },
        values: { username: props.username }
      });
    }
  });

  const { values, touched, errors, handleChange, handleSubmit } = formik;

  return (
    <Box py={2}>
      <Typography>
        <strong>Username</strong>
      </Typography>
      <Box className={clsx(formSettingsClasses.form)}>
        <TextField
          fullWidth
          value={values.username}
          onChange={handleChange('username')}
          helperText={touched.username && errors.username}
          FormHelperTextProps={{
            className: clsx(formClasses.formHelperText)
          }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={handleSubmit}>
                <Icon>edit</Icon>
              </IconButton>
            )
          }}
        />
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        onClose={() => notiContext.setNotification({ open: false, action: '', message: '' })}
        autoHideDuration={3000}
        {...notiContext.notification}
      />
    </Box>
  );
};

UsernameSettings.propTypes = {
  username: PropTypes.string.isRequired
};

export default UsernameSettings;
