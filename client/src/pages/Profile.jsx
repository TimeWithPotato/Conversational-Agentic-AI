import React, { useContext, useState } from "react";
import { AuthContext } from "../ContextProvider/AuthProvider";
import ProfileCard from "../Components/ProfileCard";
import ProfileEdit from "../Components/ProfileEdit";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  const userInfo = {
    name: user?.displayName,
    email: user?.email,
    photoURL: user?.photoURL,
  };

  if (isEditing) {
    return (
      <ProfileEdit
        user={userInfo}
        onCancel={() => setIsEditing(false)}
        onSaved={() => setIsEditing(false)}
      />
    );
  }

  return (
    <ProfileCard user={userInfo} onEdit={() => setIsEditing(true)} />
  );
};

export default Profile;
