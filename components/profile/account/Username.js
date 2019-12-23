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

const UsernameSettings = (props) => {
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
    onSubmit: (values, helpers) => {
      if (values.username !== props.username) {
        console.log(values, helpers);
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
    </Box>
  );
};

UsernameSettings.propTypes = {
  username: PropTypes.string.isRequired
};

export default UsernameSettings;
