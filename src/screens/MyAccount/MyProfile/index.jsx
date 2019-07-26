import React from "react";
import SectionHeader from "../../../components/SectionHeader";
import { Field, Form } from "react-final-form";
import builton from "../../../utils/builton";
import notify from "../../../utils/toast";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useDispatch, useGlobal } from "reactn";

const MyProfile = () => {
  const [user] = useGlobal("user");
  const updateUser = useDispatch("updateUser");

  const Error = ({ name }) => (
    <div className="form-error-container">
      <Field name={name} subscription={{ error: true, touched: true }}>
        {({ meta: { error, touched } }) =>
          error && touched ? <span>{error}</span> : null
        }
      </Field>
    </div>
  );

  const onSubmit = async values => {
    try {
      const updatedUser = await builton.users.setMe().update({
        body: values
      });
      updateUser(updatedUser);
    } catch (err) {
      notify(`Failed to update user. Please try again.`, { type: "error" });
    }
  };

  const validate = values => {
    const errors = {};
    if (!values.email) {
      errors.email = "Required";
    }
    return errors;
  };

  const renderUserProfleForm = () => {
    return (
      <div className="form-content-container">
        <Form
          onSubmit={onSubmit}
          initialValues={{
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          }}
          validate={values => validate(values)}
        >
          {({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit} className="form-container">
              <div className="input">
                <Field
                  name="first_name"
                  type="text"
                  render={({ input }) => (
                    <Input
                      id="input-1"
                      inputProps={input}
                      submitting={submitting}
                      colorScheme={1}
                      placeholder="First Name"
                    />
                  )}
                />
                <Error name="first_name" />
              </div>
              <div className="input">
                <Field
                  name="last_name"
                  type="text"
                  render={({ input, meta }) => (
                    <Input
                      id="input-2"
                      inputProps={input}
                      meta={meta}
                      submitting={submitting}
                      colorScheme={1}
                      placeholder="Last Name"
                    />
                  )}
                />
                <Error name="last_name" />
              </div>
              <div className="input">
                <Field
                  name="email"
                  type="email"
                  render={({ input, meta }) => (
                    <Input
                      id="input-3"
                      inputProps={input}
                      submitting={submitting}
                      meta={meta}
                      colorScheme={1}
                      placeholder="Email"
                    />
                  )}
                />
                <Error name="email" />
              </div>
              <div className="button-container">
                <Button
                  type="submit"
                  className="button round"
                  loading={submitting}
                  title="Save"
                />
              </div>
            </form>
          )}
        </Form>
      </div>
    );
  };

  return (
    <>
      <SectionHeader title="My Profile" />
      <SectionHeader title="General settings" type="sub" />
      {renderUserProfleForm()}
    </>
  );
};

export default MyProfile;
