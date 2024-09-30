import React from "react";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-5 bg-black fixed min-w-full z-10">
      <div className="text-2xl font-bold text-black p-2 bg-green-200 rounded-2xl">
        HERBAL FLOW
      </div>
      <nav className="flex gap-8 text-lg">
        <a href="#home" className="text-white hover:text-green-700">
          Home
        </a>
        <a href="#shop" className="text-white hover:text-green-700">
          Shop
        </a>
        <a href="#about" className="text-white hover:text-green-700">
          About us
        </a>
        <a
          href="/login"
          className="text-black hover:text-green-700 bg-yellow-300 p-1 pl-3 pr-3 rounded-2xl"
        >
          Login
        </a>
      </nav>
    </header>
  );
};

export default Navbar;
