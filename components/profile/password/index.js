import clsx from 'clsx';

import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useFormStyles } from '../../styles/form';
import { useSettingsFormStyles } from '../../styles/settingsForm';

const initialPasswordValues = {
  currentPassword: '',
  newPassword: '',
  retypeNewPassword: ''
};

const passwordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .notOneOf([Yup.ref('currentPassword')], 'New password must be different')
    .required('New password is required'),
  retypeNewPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')])
    .required('New password is required')
});

const PasswordSettings = () => {
  const formSettingsClasses = useSettingsFormStyles();
  const formClasses = useFormStyles();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialPasswordValues,
    validationSchema: passwordValidationSchema,
    onSubmit: (values, helpers) => {
      console.log(values, helpers);
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

  const { values, touched, errors, handleChange, handleSubmit, handleReset } = formik;

  return (
    <Box className={clsx(formSettingsClasses.fullWidth)}>
      <form className={clsx(formSettingsClasses.fullWidth)} onSubmit={handleSubmit} onReset={handleReset}>
        <TextField
          fullWidth
          label="Current password"
          value={values.currentPassword}
          onChange={handleChange('currentPassword')}
          helperText={touched.currentPassword && errors.currentPassword}
          FormHelperTextProps={{
            className: clsx(formClasses.formHelperText)
          }}
        />
        <Box py={2} />
        <TextField
          fullWidth
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
          label="Retype new password"
          value={values.retypeNewPassword}
          onChange={handleChange('retypeCurrentPassword')}
          helperText={touched.retypeNewPassword && errors.retypeNewPassword}
          FormHelperTextProps={{
            className: clsx(formClasses.formHelperText)
          }}
        />
        <Box py={4}>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
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
