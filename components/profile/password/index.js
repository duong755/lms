import { useContext } from 'react';
import clsx from 'clsx';
import fetch from 'isomorphic-unfetch';

import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useFormStyles } from '../../styles/form';
import { useSettingsFormStyles } from '../../styles/settingsForm';
import absURL from '../../helpers/URL';
import ProfileNotification from '../Notification';

const initialPasswordValues = {
  oldPassword: '',
  newPassword: '',
  retypeNewPassword: ''
};

const passwordValidationSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .notOneOf([Yup.ref('oldPassword')], 'New password must be different')
    .required('New password is required'),
  retypeNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')])
    .required('New password is required')
});

const PasswordSettings = () => {
  const formSettingsClasses = useSettingsFormStyles();
  const formClasses = useFormStyles();
  const notiContext = useContext(ProfileNotification);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialPasswordValues,
    validationSchema: passwordValidationSchema,
    onSubmit: async (values, helpers) => {
      try {
        const updatePasswordRes = await fetch(absURL('/api/user/password'), {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
          })
        });
        const json = await updatePasswordRes.json();
        if (updatePasswordRes.ok) {
          helpers.resetForm();
          notiContext.setNotification({ open: true, action: <Icon>check</Icon>, message: 'Password was updated' });
        } else {
          switch (updatePasswordRes.status) {
            case 400:
              helpers.setFieldError(json.field, json.error);
              break;
            case 401:
              notiContext.setNotification({
                open: true,
                action: <Icon>close</Icon>,
                message: 'Please sign in to continue'
              });
              break;
            case 404:
              notiContext.setNotification({
                open: true,
                action: <Icon>close</Icon>,
                message: json.error
              });
              break;
            default:
              notiContext.setNotification({
                open: true,
                action: <Icon>close</Icon>,
                message: 'Password was not updated'
              });
              break;
          }
        }
      } catch {
        notiContext.setNotification({ open: true, action: <Icon>close</Icon>, message: 'Password was not updated' });
      } finally {
        helpers.setSubmitting(false);
      }
    },
    onReset: (values, helpers) => {
      helpers.resetForm({
        isSubmitting: false,
        isValidating: false,
        submitCount: 0,
        values: initialPasswordValues,
        errors: initialPasswordValues,
        touched: initialPasswordValues
      });
    }
  });

  const { values, touched, errors, handleChange, handleSubmit, handleReset, isSubmitting } = formik;

  return (
    <Box className={clsx(formSettingsClasses.fullWidth)}>
      <Box py={5}>
        <Typography variant="h5">Change Password</Typography>
      </Box>
      <form className={clsx(formSettingsClasses.fullWidth)} onSubmit={handleSubmit} onReset={handleReset}>
        <TextField
          fullWidth
          type="password"
          label="Current password"
          value={values.oldPassword}
          onChange={handleChange('oldPassword')}
          helperText={touched.oldPassword && errors.oldPassword}
          FormHelperTextProps={{
            className: clsx(formClasses.formHelperText)
          }}
        />
        <Box py={2} />
        <TextField
          fullWidth
          type="password"
          label="New password"
          value={values.newPassword}
          onChange={handleChange('newPassword')}
          helperText={touched.newPassword && errors.newPassword}
          FormHelperTextProps={{
            className: clsx(formClasses.formHelperText)
          }}
        />
        <Box py={2} />
        <TextField
          fullWidth
          type="password"
          label="Retype new password"
          value={values.retypeNewPassword}
          onChange={handleChange('retypeNewPassword')}
          helperText={touched.retypeNewPassword && errors.retypeNewPassword}
          FormHelperTextProps={{
            className: clsx(formClasses.formHelperText)
          }}
        />
        <Box py={4}>
          <Button disabled={isSubmitting} color="primary" variant="contained" onClick={handleSubmit}>
            Save changes
          </Button>
          &nbsp;
          <Button color="default" variant="contained" onClick={handleReset}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default PasswordSettings;
