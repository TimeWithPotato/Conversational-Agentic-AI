const ProfileCard = ({ user, onEdit }) => {
  const { name, email, photoURL } = user;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-8 w-full max-w-md mx-auto min-h-[320px] flex flex-col items-center text-gray-100">
      <div className="w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
        <img
          src={photoURL}
          alt={`${name}'s profile picture`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "#";
          }}
        />
      </div>

      <h2 className="text-2xl font-semibold mb-2 truncate max-w-full text-center">
        {name}
      </h2>
      <p className="mb-6 text-sm break-all text-center opacity-80">{email}</p>

      <button
        onClick={onEdit}
        className="bg-teal-500 hover:bg-teal-400 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;