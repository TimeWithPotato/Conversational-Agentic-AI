import React, { useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../ContextProvider/AuthProvider";

const ProfileEdit = ({ user, onCancel, onSaved }) => {
  const { updateUserProfile } = useContext(AuthContext);

  useEffect(() => {
    Swal.fire({
      title: "Edit Profile",
      html: `
        <input type="text" id="swal-name" class="swal2-input custom-swal-input" value="${user.name || ""}" placeholder="Name" />
        <input type="text" id="swal-photo" class="swal2-input custom-swal-input" value="${user.photoURL || ""}" placeholder="Photo URL" />
      `,
      confirmButtonText: "Save",
      showCancelButton: true,
      focusConfirm: false,
      customClass: {
        popup: "custom-swal-popup",
        confirmButton: "custom-swal-btn",
        cancelButton: "custom-swal-btn-cancel",
      },
      preConfirm: () => {
        const name = document.getElementById("swal-name").value;
        const photo = document.getElementById("swal-photo").value;

        return updateUserProfile({ displayName: name, photoURL: photo })
          .then(() => {
            Swal.fire("Updated!", "", "success");
            onSaved();
          })
          .catch(() => Swal.fire("Failed to update!", "", "error"));
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        onCancel();
      }
    });
  }, []);

  return null;
};

export default ProfileEdit;
