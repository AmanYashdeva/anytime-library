const Buttons = ({ onSignUp, onSignIn, onAdminLoginClick }) => {
  return (
    <div className="fixed top-4 right-4 z-50 gap-2 flex">

      {/* <button
        onClick={onSignUp}
        className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2 rounded-lg font-bold transition"
      >
        Sign Up
      </button>

      <button
        onClick={onSignIn}
        className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-2 py-1 rounded-lg font-bold transition"
      >
        Sign In
      </button> */}
      <br />
      <button
        onClick={onAdminLoginClick}
        className="bg-yellow-400 text-black px-5 py-2 rounded-xl font-bold shadow-xl hover:bg-yellow-300 transition"
      >
        Admin Login
      </button>

    </div>
  );
};

export default Buttons;
