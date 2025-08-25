import React, { useContext, useState } from "react";
import { AuthContext } from "../ContextProvider/AuthProvider";
import ProfileCard from "../Components/ProfileCard";
import ProfileEdit from "../Components/ProfileEdit";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  const userInfo = {
    name: user?.displayName || "No Name",
    email: user?.email || "No Email",
    photoURL: user?.photoURL || "No photo",
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl mt-12 text-gray-100">
      {isEditing ? (
        <ProfileEdit
          user={userInfo}
          onCancel={() => setIsEditing(false)}
          onSaved={() => setIsEditing(false)}
        />
      ) : (
        <ProfileCard user={userInfo} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
};

export default Profile;
