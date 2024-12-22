import React, { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

// GraphQL Query
const LOGIN_QUERY = gql`
  query FacultyLogin($Username: String!, $Password: String!) {
    FacultyLogin(Username: $Username, Password: $Password) {
      Username
      token
      School_Id
    }
  }
`;


export default function Login() {
  const [data, setData] = useState({
    Username: "",
    Password: ""
  });

  const [loginFailed, setLoginFailed] = useState(false);
  const [login, { data: queryData, loading, error }] = useLazyQuery(LOGIN_QUERY);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (queryData && queryData.FacultyLogin) {
        localStorage.setItem('token', queryData.FacultyLogin.token);
        navigate('/admin/adminPanel');
      }
    } catch (err) {
      console.error("Frontend error:", err);
    }
  }, [queryData, navigate]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginFailed(false);
    login({ variables: { Username: data.Username, Password: data.Password } });
  };
  return (
    <div>
      <section className="bg-admin bg-cover bg-center">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="Username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    name="Username"
                    id="Username"
                    onChange={handleChange}
                    value={data.Username}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="Password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="Password"
                    id="Password"
                    onChange={handleChange}
                    value={data.Password}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {loading ? "Loading..." : "Sign in"}
                </button>
                {loginFailed && (
                  <p className="text-sm font-light text-red-500">
                    Login failed. Please check your username and password.
                  </p>
                )}
                {error && (
                  <p className="text-sm font-light text-red-500">
                    An error occurred. Please try again later.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}