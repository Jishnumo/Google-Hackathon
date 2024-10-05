import { useState } from 'react';
import { Link } from 'react-router-dom';
import navlogo from "../assets/healio.png";

const Navbar = () => {
  const [state, setState] = useState(false);

  const navigation = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Services', path: '/services' },
  ];

  const handleSignInClick = () => {
    // Add your sign-in logic here, e.g., navigating to a sign-in page
    console.log("Sign In Clicked");
  };

  return (
    <nav className="fixed w-full py-3 md:fixed md:text-base md:border-none">
      <div className="items-center px-4 max-w-screen-2xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link to="/">
            <img
              src={navlogo}
              width={120}
              height={50}
              alt="Logo"
            />
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={() => setState(!state)}
            >
              {state ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div
          className={`flex-1 pb-3 mt-8 md:block md:pb-0 md:mt-0 ${state ? 'block' : 'hidden'}`}
        >
          <ul className="font-semibold justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
            {navigation.map((item, idx) => (
              <li key={idx} className="text-yellow-200 hover:text-violet-600">
                <Link to={item.path} className="block">
                  {item.title}
                </Link>
              </li>
            ))}
            <span className="hidden w-px h-6 bg-gray-300 md:block"></span>
            <div className="space-y-3 items-center gap-x-6 md:flex md:space-y-0">
              <li>
                <button
                  onClick={handleSignInClick}
                  className="block py-3 px-4 font-medium text-center text-lime-50 bg-violet-600 hover:bg-violet-600 active:bg-violet-600 active:shadow-none rounded-lg shadow md:inline"
                >
                  Sign In
                </button>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
