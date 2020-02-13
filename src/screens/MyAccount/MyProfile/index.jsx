import React, { useRef, useState } from "react";
import SectionHeader from "../../../components/SectionHeader";
import { Field, Form } from "react-final-form";
import builton from "../../../utils/builton";
import notify from "../../../utils/toast";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { useDispatch, useGlobal } from "reactn";
import config from "../../../config";
import Spinner from "../../../components/Spinner";
import get from 'lodash.get';
import Account from "../../../assets/icons/person";

const MyProfile = () => {
  const [user] = useGlobal("user");
  const updateUser = useDispatch("updateUser");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

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
      const updatedUser = await builton.users.setMe().update(values, { urlParams: { expand: 'image' }});
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

  const renderUserProfileForm = () => {
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

  const handleAvatarUpload = async (ev) => {
    if (get(ev, 'target.value') && ev.target.files[0]) {
      ev.persist();
      const imageData = ev.target.files[0];
      const fileSize = imageData.size / 1024 / 1024;

      if (fileSize > 5) {
        notify(
          'The file size is too large. The maximum allowed size is 5mb.',
          {
            type: 'error'
          }
        );
        return false;
      }
      setLoading(true);
      try {
        const image = await builton.images.create(imageData, {isPublic: true});
        const user = builton.users.setMe();
        const updatedUser = await user.update({image: image._id.$oid}, { urlParams: { expand: 'image' }});
        await updateUser(updatedUser);
        // This makes it possible to re-attach the same file, otherwise onChange on the input does not trigger
        ev.target.value = '';
      } catch (err) {
        notify('Failed to upload image. Please try again.', {
          type: 'error',
        })
      }
    }
  };

  const deleteAvatar = async () => {
    setLoading(true);
    try {
      const user = builton.users.setMe();
      const updatedUser = await user.update({ image: null });
      await updateUser(updatedUser);
    } catch(err) {
      notify('Failed to delete profile picture. Please try again.', {
        type: 'error'
      })
    }
    setLoading(false);
  };

  return (
    <>
      <SectionHeader title="My Profile" />
      <div className="profile-image-container">
        <div className="image-upload-container">
          <input type="file" name="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/gif,image/jpeg,image/png,image/jpg"/>
          {user.image && user.image.url &&
            <img
              src={`${config.endpoint}/images/${user.image.url}?api_key=${config.apiKey}`}
              alt={`profile-img-${user.first_name}`}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
            />
          }
          {!user.image &&
            <div className="empty-image-container">
              <Account width={48} height={48} color={'#C0C0C0'} />
            </div>
          }
          {!loading &&
            <div className="image-upload-actions">
              <button type="button" className="button-link" onClick={() => fileInputRef.current.click()}>
                {user.image && user.image.url ? 'Change' : 'Upload'}
              </button>
              {user.image && user.image.url &&
                <button type="button" className="button-link" onClick={() => deleteAvatar()}>
                  Delete
                </button>
              }
            </div>
          }
          {loading &&
            <div className="image-loading-container">
              <Spinner/>
            </div>
          }
        </div>
      </div>
      <SectionHeader title="General settings" type="sub" />
      {renderUserProfileForm()}
    </>
  );
};

export default MyProfile;
