import { useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

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
import ProfileNotication from '../Notification';

const EmailSettings = (props) => {
  const formClasses = useFormStyles();
  const formSettingsClasses = useSettingsFormStyles();
  const notiContext = useContext(ProfileNotication);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { email: props.email },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Invalid email')
        .required('Email is required')
    }),
    onSubmit: async (values, helpers) => {
      if (values.email !== props.email) {
        try {
          const updateEmailRes = await fetch(absURL('/api/user/email'), {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: values.email })
          });
          const json = await updateEmailRes.json();
          if (updateEmailRes.ok) {
            notiContext.setNotification({ open: true, action: <Icon>check</Icon>, message: 'Email was updated' });
          } else {
            switch (updateEmailRes.status) {
              case 400:
                notiContext.setNotification({ open: true, action: <Icon>close</Icon>, message: json.error });
                break;
              case 401:
                notiContext.setNotification({
                  open: true,
                  action: <Icon>close</Icon>,
                  message: 'Please sign in to continue'
                });
                break;
              default:
                notiContext.setNotification({
                  open: true,
                  action: <Icon>close</Icon>,
                  message: 'Email was not updated'
                });
                break;
            }
          }
        } catch {
          notiContext.setNotification({ open: true, action: <Icon>close</Icon>, message: 'Email was not updated' });
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
        errors: { email: '' },
        touched: { email: '' },
        values: { email: props.email }
      });
    }
  });

  const { values, touched, errors, handleChange, handleSubmit, handleReset } = formik;

  return (
    <Box py={2}>
      <Typography>
        <strong>Email</strong>
      </Typography>
      <Box className={clsx(formSettingsClasses.form)}>
        <form className={clsx(formSettingsClasses.fullWidth)} onSubmit={handleSubmit} onReset={handleReset}>
          <TextField
            fullWidth
            value={values.email}
            onChange={handleChange('email')}
            helperText={touched.email && errors.email}
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
        </form>
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

EmailSettings.propTypes = {
  email: PropTypes.string.isRequired
};

export default EmailSettings;
