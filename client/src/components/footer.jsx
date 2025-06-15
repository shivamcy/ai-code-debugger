// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="text-center py-8 text-sm text-gray-400 border-t border-zinc-800 mt-12">
      Created by{" "}
      <a
        href="https://github.com/shivamcy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white underline hover:text-green-400 transition duration-200"
      >
        shivamcy
      </a>
    </footer>
  );
};

export default Footer;
