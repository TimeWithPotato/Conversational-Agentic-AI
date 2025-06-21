const ProfileCard = ({ user, onEdit }) => {
  const { name, email, photoURL } = user;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card bg-base-100 w-96 shadow-xl text-white">
        <figure>
          <img src={photoURL} alt={`${name}'s profile picture`} />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Name: {name}</h2>
          <p>Email: {email}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={onEdit}>Edit Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
