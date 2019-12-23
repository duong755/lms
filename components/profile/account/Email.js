import PropTypes from 'prop-types';
import clsx from 'clsx';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useFormStyles } from '../../styles/form';
import { useSettingsFormStyles } from '../../styles/settingsForm';

const EmailSettings = (props) => {
  const formClasses = useFormStyles();
  const formSettingsClasses = useSettingsFormStyles();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { email: props.email },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Invalid email')
        .required('Email is required')
    }),
    onSubmit: (values, helpers) => {
      if (values.email !== props.email) {
        console.log(values, helpers);
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
    </Box>
  );
};

EmailSettings.propTypes = {
  email: PropTypes.string.isRequired
};

export default EmailSettings;
