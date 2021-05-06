import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';


const Header = () => {
  /*
  With the event.preventDefault(), we're actually overriding the <a> element's
  default nature of having the browser load a different resource. Instead, we
  execute the .logout() method, which will remove the token from localStorage
  and then refresh the application by taking the user back to the homepage.
  */
  const logout = event => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1>Deep Thoughts</h1>
        </Link>

        <nav className="text-center">
          {Auth.loggedIn() ? (
            <>
              <Link to="/profile">Me</Link>
              <a href="/" onClick={logout}>Logout</a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};


export default Header;