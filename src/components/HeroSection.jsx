const HeroSection = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => document.getElementById('adminLoginPanel')?.classList.remove('hidden')}
        className="bg-yellow-400 text-black px-5 py-2 rounded-xl font-bold shadow-xl hover:bg-yellow-300 transition"
      >
        Admin Login
      </button>
    </div>
  );
};

export default HeroSection;
