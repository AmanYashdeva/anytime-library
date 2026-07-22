const Header = () => {
  return (
    <header className="bg-gradient-to-r from-black via-indigo-900 to-black text-white py-10 shadow-2xl border-b-4 border-yellow-400" style={{ fontFamily: "'Helvetica, sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-9xl md:text-6xl font-black tracking-[6px] text-yellow-300" >
            ANY TIME LIBRARY
          </h1>
          <p className="mt-4 text-lg opacity-90" style={{ fontFamily: "Montserrat Tight" }}>
            Bachhrawan's Premium Smart Library Management System
          </p>
          
        </div>
        {/* <div>
            <div className="fixed top-4 left-4 z-50">
                <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg">Login</button>
                <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg ml-2">Sign Up</button>
            </div>
            <div className="hidden md:block">
                <p className="text-sm">Call us: +91 12345 67890</p>
                <p className="text-sm">Email: info@anytimelibrary.com</p>
            </div>
        </div> */}
        {/* <div>
            <nav className="justify-between mt-4">
            <ul className="flex justify-between space-x-2 p-2 text-sm md:text-lg backdrop-blur-none">
              <li className="hover:text-blue-500 cursor-pointer">Home</li>
              <li className="hover:text-blue-500 cursor-pointer">About</li>
              <li className="hover:text-blue-500 cursor-pointer">Services</li>
              <li className="hover:text-blue-500 cursor-pointer">Contact</li>
            </ul>
          </nav>
        </div> */}
        
      </header>
  );
};

export default Header;
