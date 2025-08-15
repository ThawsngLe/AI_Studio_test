import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Vẽ tranh cùng AI
      </h1>
      <p className="mt-2 text-lg text-gray-400">
        Biến ước mơ thành kiệt tác.
      </p>
    </header>
  );
};

export default Header;