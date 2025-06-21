import React, { useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../ContextProvider/AuthProvider";

const ProfileEdit = ({ user, onCancel, onSaved }) => {
  const { updateUserProfile } = useContext(AuthContext);

  useEffect(() => {
    Swal.fire({
      title: "Edit Profile",
      html: `
        <input type="text" id="swal-name" class="swal2-input" value="${user.name || ""}" placeholder="Name" />
        <input type="text" id="swal-photo" class="swal2-input" value="${user.photoURL || ""}" placeholder="Photo URL" />
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("swal-name").value;
        const photo = document.getElementById("swal-photo").value;

        return updateUserProfile({ displayName: name, photoURL: photo })
          .then(() => {
            Swal.fire("Updated!", "", "success");
            onSaved(); // notify parent to exit edit mode
          })
          .catch(() => Swal.fire("Failed to update!", "", "error"));
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        onCancel(); // notify parent to exit edit mode if canceled
      }
    });
  }, []);

  return null; // no UI needed here
};

export default ProfileEdit;
