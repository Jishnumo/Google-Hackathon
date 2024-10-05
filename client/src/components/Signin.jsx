import React, { useState } from 'react';

const Signin = () => {
  const [activeTab, setActiveTab] = useState('signup');

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* Tab Menu */}
        <div className="flex justify-between mb-6">
          <button
            className={`w-1/2 text-center py-2 font-semibold ${activeTab === 'signup' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign up
          </button>
          <button
            className={`w-1/2 text-center py-2 font-semibold ${activeTab === 'login' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => setActiveTab('login')}
          >
            Log in
          </button>
        </div>

        {/* Sign up Form */}
        {activeTab === 'signup' && (
          <div>
            <h2 className="text-center text-2xl font-bold mb-6">Sign up</h2>
            {/* Social Sign Up Buttons */}
            <div className="space-y-4">
              <button className="w-full py-2 border border-gray-300 rounded-full flex items-center justify-center text-gray-700">
                <img src="/facebook-icon.png" alt="Facebook" className="h-6 mr-2" />
                Sign up with Facebook
              </button>
              <button className="w-full py-2 border border-gray-300 rounded-full flex items-center justify-center text-gray-700">
                <img src="/google-icon.png" alt="Google" className="h-6 mr-2" />
                Sign up with Google
              </button>
            </div>

            {/* OR Divider */}
            <div className="my-6 text-center text-gray-500">OR</div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="First name"
                  className="w-1/2 py-2 px-4 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-1/2 py-2 px-4 border border-gray-300 rounded-lg"
                />
              </div>
              <input
                type="email"
                placeholder="Email address"
                className="w-full py-2 px-4 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <button className="mt-6 w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700">
              Sign up
            </button>
          </div>
        )}

        {/* Log In Form */}
        {activeTab === 'login' && (
          <div>
            <h2 className="text-center text-2xl font-bold mb-6">Log in</h2>
            {/* Input Fields */}
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                className="w-full py-2 px-4 border border-gray-300 rounded-lg"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full py-2 px-4 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <button className="mt-6 w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700">
              Log in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signin;
