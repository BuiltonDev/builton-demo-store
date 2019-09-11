import React, { useState } from "react";
import PropTypes from "prop-types";
import { Field, Form } from "react-final-form";
import Input from "../../../components/Input";
import Hyperlink from "../../../components/Hyperlink";
import Button from "../../../components/Button";
import firebaseClient from "../../../utils/firebase";
import { setFirebaseToken } from "../../../utils/auth";
import builton from "../../../utils/builton";
import notify from "../../../utils/toast";
import { useDispatch } from "reactn";

const AuthForm = ({ onAuth }) => {
  const [formType, setFormType] = useState("login");
  const updateUser = useDispatch("updateUser"); //reducer
  const updateBuiltonSession = useDispatch("updateBuiltonSession");

  const Error = ({ name }) => (
    <div className="form-error-container">
      <Field name={name} subscription={{ error: true, touched: true }}>
        {({ meta: { error, touched } }) =>
          error && touched ? <span>{error}</span> : null
        }
      </Field>
    </div>
  );

  const validate = values => {
    const errors = {};
    if (formType === "register") {
      if (!values.email) {
        errors.email = "Required";
      }
      if (!values.password) {
        errors.password = "Required";
      }
      if (!values.confirmPassword) {
        errors.confirmPassword = "Required";
      }

      if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Passwords do not match";
      }
    }
    return errors;
  };

  const onSubmit = async values => {
    try {
      if (formType === "register") {
        await firebaseClient
          .auth()
          .createUserWithEmailAndPassword(values.email, values.password);
      } else {
        await firebaseClient
          .auth()
          .signInWithEmailAndPassword(values.email, values.password);
      }

      const idToken = await setFirebaseToken();
      await updateBuiltonSession(idToken);

      let apiUser;

      if (formType === "register") {
        apiUser = await builton.users.authenticate({
          body: {
            email: values.email
          }
        });
      } else {
        apiUser = await builton.users.setMe().get();
      }

      await updateUser(apiUser);

      if (!apiUser) {
        throw new Error("Missing user data");
      }

      onAuth();
    } catch (err) {
      notify(
        `Failed to ${
          formType === "login" ? "Login" : "Register"
        }. Please try again.`,
        { type: "error" }
      );
    }
  };

  return (
    <Form onSubmit={onSubmit} validate={values => validate(values)}>
      {({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="input">
            <Field
              name="email"
              type="email"
              render={({ input }) => (
                <Input
                  id="input-1"
                  inputProps={{
                    ...input,
                    autoComplete: "username email"
                  }}
                  submitting={submitting}
                  colorScheme={1}
                  placeholder="Email"
                />
              )}
            />
            <Error name="email" />
          </div>
          <div className="input">
            <Field
              name="password"
              type="password"
              render={({ input }) => (
                <Input
                  id="input-2"
                  inputProps={{
                    ...input,
                    autoComplete: "new-password"
                  }}
                  submitting={submitting}
                  colorScheme={2}
                  placeholder="Password"
                />
              )}
            />
            <Error name="password" />
          </div>
          <div
            className={`input input ${
              formType === "register" ? "show-field" : "hide-field"
            }`}
          >
            <Field
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              render={({ input }) => (
                <Input
                  id="input-3"
                  inputProps={{
                    ...input,
                    autoComplete: "new-password"
                  }}
                  submitting={submitting}
                  colorScheme={2}
                  placeholder="Confirm Password"
                />
              )}
            />
            <Error name="confirmPassword" />
          </div>
          <div className="buttons">
            <Hyperlink
              onClick={() =>
                setFormType(formType === "register" ? "login" : "register")
              }
              title={formType === "register" ? "Login" : "Register"}
            />
            <Button
              type="submit"
              className="button round"
              loading={submitting}
              title={formType === "register" ? "Register" : "Login"}
            />
          </div>
        </form>
      )}
    </Form>
  );
};

AuthForm.propTypes = {
  onAuth: PropTypes.func.isRequired
};

export default AuthForm;
