import React from 'react';

import { NextPage } from 'next';
import Head from 'next/head';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';

import withLayout from '../../components/hoc/withLayout';

const SignUpPage: NextPage = () => {
  const signUpInitialValues = React.useMemo(
    () => ({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }),
    []
  );

  type SignUpValues = typeof signUpInitialValues;
  type SignUpOnSubmit = (values: SignUpValues, formikHelpers: FormikHelpers<SignUpValues>) => void | Promise<any>;

  const signUpValidationSchema = React.useMemo(
    () =>
      yup.object().shape({
        username: yup
          .string()
          .trim()
          .required(),
        email: yup
          .string()
          .email()
          .required(),
        password: yup
          .string()
          .min(8)
          .required(),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref('password')])
          .required()
      }),
    []
  );

  const signUpOnSubmit = React.useCallback<SignUpOnSubmit>((values, formikHelpers) => {
    console.log(values, formikHelpers);
  }, []);

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Container maxWidth="xl">
        <Grid container justify="center">
          <Grid item md={6} sm={8} xs={12}>
            <Box pt={3} textAlign="center">
              <Typography variant="h4">Create an account</Typography>
            </Box>
            <Formik
              onSubmit={signUpOnSubmit}
              initialValues={signUpInitialValues}
              validationSchema={signUpValidationSchema}
            >
              {(formikProps) => {
                const { values, touched, errors, handleChange, handleSubmit } = formikProps;

                return (
                  <Form>
                    <Box py={2}>
                      <TextField
                        label="Username"
                        fullWidth
                        value={values.username}
                        onChange={handleChange('username')}
                        helperText={touched.username && errors.username}
                      />
                    </Box>
                    <Box py={2}>
                      <TextField
                        label="Email"
                        fullWidth
                        value={values.email}
                        onChange={handleChange('email')}
                        helperText={touched.email && errors.email}
                      />
                    </Box>
                    <Box py={2}>
                      <TextField
                        label="Password"
                        fullWidth
                        value={values.password}
                        onChange={handleChange('password')}
                        helperText={touched.password && errors.password}
                      />
                    </Box>
                    <Box py={2}>
                      <TextField
                        label="Retype password"
                        fullWidth
                        value={values.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                      />
                    </Box>
                    <Box py={2}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        Create
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default withLayout(SignUpPage);
