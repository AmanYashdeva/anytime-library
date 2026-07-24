import logo from "../assets/lib-logo-copy.png";
const Header = () => {
  return (
    <header
      className="bg-gradient-to-r from-black via-indigo-900 to-black text-white py-8 md:py-10 shadow-2xl border-b-4 border-yellow-400"
      style={{ fontFamily: "Helvetica, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative min-h-[190px] md:min-h-[100px] flex items-center justify-center">

        {/* Logo - Left Side */}
        <img
          src={logo}
          alt="Library Logo"
          className="
        absolute
        left-4 md:left-10
        top-1/2
        -translate-y-1/2
        h-20 sm:h-24 md:h-40
        w-auto
        object-contain
      "
        />

        {/* Center Content */}
        <div className="text-center w-full px-20 sm:px-28 md:px-40">

          <h1
            className="
          text-3xl
          sm:text-4xl
          md:text-6xl
          lg:text-7xl
          font-black
          tracking-[2px]
          md:tracking-[6px]
          text-yellow-300
          leading-tight
        "
          >
            ANY TIME LIBRARY
          </h1>

          <p
            className="
          mt-3
          md:mt-4
          text-sm
          sm:text-base
          md:text-lg
          opacity-90
          leading-relaxed
        "
            style={{ fontFamily: "Montserrat Tight" }}
          >
            Bachhrawan's Premium Smart Library Management System
          </p>

        </div>

      </div>
    </header>
  );
};

export default Header;
