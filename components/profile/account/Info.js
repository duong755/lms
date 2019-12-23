import PropTypes from 'prop-types';
import clsx from 'clsx';
import { isEqual } from 'lodash';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useFormStyles } from '../../styles/form';
import { useSettingsFormStyles } from '../../styles/settingsForm';

const infoValidationSchema = Yup.object().shape({
  fullname: Yup.string().notRequired(),
  birthday: Yup.date().notRequired()
});

const InfoSettings = (props) => {
  const formClasses = useFormStyles();
  const formSettingsClasses = useSettingsFormStyles();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: props.info.fullname,
      birthday: props.info.birthday
    },
    validationSchema: infoValidationSchema,
    onSubmit: (values, helpers) => {
      if (!isEqual(values, props.info)) {
        console.log(values, helpers);
      }
    },
    onReset: (values, helpers) => {
      helpers.resetForm({
        isSubmitting: false,
        isValidating: false,
        submitCount: 0,
        touched: { fullname: '', birthday: '' },
        errors: { fullname: '', birthday: '' },
        values: props.info
      });
    }
  });

  const { values, touched, errors, handleChange, handleSubmit, handleReset } = formik;

  return (
    <Box py={2}>
      <Typography>
        <strong>Info</strong>
      </Typography>
      <Box className={clsx(formSettingsClasses.form)}>
        <form className={clsx(formSettingsClasses.fullWidth)} onSubmit={handleSubmit} onReset={handleReset}>
          <TextField
            label="Fullname"
            fullWidth
            value={values.fullname}
            onChange={handleChange('fullname')}
            helperText={touched.fullname && errors.fullname}
            FormHelperTextProps={{ className: clsx(formClasses.formHelperText) }}
          />
          <Box py={2} />
          <TextField
            label="Birthday"
            fullWidth
            value={values.birthday}
            onChange={handleChange('birthday')}
            helperText={touched.birthday && errors.birthday}
            FormHelperTextProps={{ className: clsx(formClasses.formHelperText) }}
          />
          <Box py={2} />
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            Save changes
          </Button>
        </form>
      </Box>
    </Box>
  );
};

InfoSettings.propTypes = {
  info: PropTypes.shape({
    fullname: PropTypes.string,
    birthday: PropTypes.string
  }).isRequired
};

export default InfoSettings;
