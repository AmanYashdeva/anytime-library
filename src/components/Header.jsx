import logo from "../assets/lib-logo-copy.png";

const Header = () => {
  return (
    <header
      className="relative overflow-hidden border-b border-slate-800 bg-[#07111f] text-white"
      style={{ fontFamily: "Helvetica, sans-serif" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.22),transparent_45%)]"></div>
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"></div>

      <div className="relative mx-auto flex min-h-[250px] max-w-7xl flex-col items-center justify-center px-4 pb-8 pt-5 sm:min-h-[270px] sm:px-6 md:min-h-[150px] md:flex-row md:justify-center md:px-8 md:py-7">
        <img
          src={logo}
          alt="Library Logo"
          className="absolute left-1/2 top-4 h-[78px] w-auto -translate-x-1/2 object-contain sm:top-5 sm:h-[88px] md:left-7 md:top-1/2 md:h-[92px] md:-translate-y-1/2 md:translate-x-0 lg:left-9 lg:h-[150px]"
        />

        <div className="w-full max-w-3xl px-2 pt-[92px] text-center sm:pt-[102px] md:px-10 md:pt-0 lg:px-20">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="h-px w-7 bg-amber-400/70"></span>
            <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400 sm:text-[10px]">Welcome to the</span>
            <span className="h-px w-7 bg-amber-400/70"></span>
          </div>
          <h1 className="text-[28px] font-black tracking-[0.06em] text-amber-400 sm:text-4xl md:text-5xl lg:text-6xl">
            ANY TIME <span className="text-amber-400">LIBRARY</span>
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-xs leading-5 text-slate-300 sm:text-sm md:text-base">
            Bachhrawan's Premium Smart Library Management System
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
