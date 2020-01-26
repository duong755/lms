import React from 'react';

import { NextPage } from 'next';
import Head from 'next/head';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Formik, Form, FormikHelpers } from 'formik';
import * as yup from 'yup';

import withLayout from '../../components/hoc/withLayout';

const SignInPage: NextPage = () => {
  const signInInitialValues = React.useMemo(
    () => ({
      usernameOrEmail: '',
      password: ''
    }),
    []
  );

  type SignInValues = typeof signInInitialValues;
  type SignInOnSubmit = (values: SignInValues, formikHelpers: FormikHelpers<SignInValues>) => void | Promise<any>;

  const signInValidationSchema = React.useMemo(
    () => ({
      usernameOrEmail: yup.string().required(),
      password: yup.string().required()
    }),
    []
  );

  const signInOnSubmit = React.useCallback<SignInOnSubmit>((values, formikHelpers) => {
    console.log(values, formikHelpers);
  }, []);

  return (
    <>
      <Head>
        <title>Sign in to OpenLMS</title>
      </Head>
      <Container maxWidth="xl">
        <Grid container justify="center">
          <Grid item md={6} sm={8} xs={12}>
            <Box pt={3} textAlign="center">
              <Typography variant="h4">Sign in to OpenLMS</Typography>
            </Box>
            <Formik
              onSubmit={signInOnSubmit}
              initialValues={signInInitialValues}
              validationSchema={signInValidationSchema}
            >
              {(formikProps) => {
                const { values, touched, errors, handleChange, handleSubmit } = formikProps;

                return (
                  <Form>
                    <Box py={2}>
                      <TextField
                        fullWidth
                        label="Username or Email"
                        value={values.usernameOrEmail}
                        onChange={handleChange('usernameOrEmail')}
                        helperText={touched.usernameOrEmail && errors.usernameOrEmail}
                      />
                    </Box>
                    <Box py={2}>
                      <TextField
                        fullWidth
                        label="Password"
                        value={values.password}
                        onChange={handleChange('password')}
                        helperText={touched.password && errors.password}
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
                        Sign in
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

export default withLayout(SignInPage);
