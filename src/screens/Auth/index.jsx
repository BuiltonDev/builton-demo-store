import React, { useState } from "react";
import { Form, Field } from "react-final-form";
import builton from "../../utils/builton";
import { useDispatch } from "reactn";
import { withRouter } from "react-router-dom";
import notify from "../../utils/toast";

import "./index.scss";
import { setFirebaseToken } from "../../utils/auth";
import firebaseClient from "../../utils/firebase";
import useReactRouter from "use-react-router";
import BuiltonLogo from "../../components/BuiltonLogo";
import Button from "../../components/Button";
import Hyperlink from "../../components/Hyperlink";
import Input from "../../components/Input";

const Auth = () => {
  const [formType, setFormType] = useState("login");
  const updateUser = useDispatch("updateUser"); //reducer
  const updateBuiltonSession = useDispatch("updateBuiltonSession");

  const { history } = useReactRouter();

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
            email: values.email,
            first_name: "", // TODO remove
            last_name: "" // TODO remove
          }
        });
      } else {
        apiUser = await builton.users.setMe().get();
      }

      await updateUser(apiUser);

      if (!apiUser) {
        throw new Error("Missing user data");
      }

      history.push("/");
    } catch (err) {
      notify(
        `Failed to ${
          formType === "login" ? "Login" : "Register"
        }. Please try again.`,
        { type: "error" }
      );
    }
  };

  const validate = (values) => {
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

  const Error = ({ name }) => (
    <div className="form-error-container">
      <Field name={name} subscription={{ error: true, touched: true }}>
        {({ meta: { error, touched } }) =>
          error && touched ? <span>{error}</span> : null
        }
      </Field>
    </div>
  );

  return (
    <div className="wrapper">
      <BuiltonLogo style={{ position: 'absolute', top: 12, left: 48 }}/>
      <div className="paper-container">
        <Form
          onSubmit={onSubmit}
          validate={values => validate(values)}
        >
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit} className="form-container">
              <div className="input">
                <Field
                  name="email"
                  type="email"
                  render={({ input }) => (
                    <Input id="input-1" inputProps={input} submitting={submitting} colorScheme={1} placeholder="Email"/>
                  )}
                />
                <Error name="email" />
              </div>
              <div className="input">
                <Field
                  name="password"
                  type="password"
                  render={({ input }) => (
                    <Input id="input-2" inputProps={input} submitting={submitting} colorScheme={2} placeholder="Password"/>
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
                  render={({ input }) => (
                    <Input id="input-3" inputProps={input} submitting={submitting} colorScheme={2} placeholder="Confirm Password"/>
                  )}
                />
                <Error name="confirmPassword" />
              </div>
              <div className="buttons">
                <Hyperlink
                  onClick={() =>
                    setFormType(formType === "register" ? "login" : "register")}
                  title={formType === "register" ? "Login" : "Register"}
                />
                <Button type="submit" className="button round" loading={submitting} title={formType === 'register' ? 'Register' : 'Login'} />
              </div>
            </form>
          )}
        </Form>
      </div>
    </div>
  );
};

export default withRouter(Auth);
