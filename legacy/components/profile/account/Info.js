import { useContext } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { isEqual } from 'lodash';
import fetch from 'isomorphic-unfetch';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useFormStyles } from '../../styles/form';
import { useSettingsFormStyles } from '../../styles/settingsForm';
import ProfileNotification from '../Notification';
import absURL from '../../helpers/URL';

const infoValidationSchema = Yup.object().shape({
  fullname: Yup.string().notRequired(),
  birthday: Yup.date().notRequired()
});

const InfoSettings = (props) => {
  const formClasses = useFormStyles();
  const formSettingsClasses = useSettingsFormStyles();
  const notiContext = useContext(ProfileNotification);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: props.info.fullname,
      birthday: props.info.birthday
    },
    validationSchema: infoValidationSchema,
    onSubmit: async (values, helpers) => {
      if (!isEqual(values, props.info)) {
        try {
          const updateInfoRes = await fetch(absURL('/api/user/info'), {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          });
          if (updateInfoRes.ok) {
            notiContext.setNotification({ open: true, action: <Icon>check</Icon>, message: 'Info was updated' });
          } else {
            notiContext.setNotification({ open: true, action: <Icon>check</Icon>, message: 'Info was not updated' });
          }
        } catch {
          notiContext.setNotification({ open: true, action: <Icon>check</Icon>, message: 'Info was not updated' });
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
            Save Info
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
