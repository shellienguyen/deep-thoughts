import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';


const Login = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async event => {
    event.preventDefault();

    /*
    The try...catch block functionality is especially useful with asynchronous code
    such as Promises. This way, it allows the use of async/await instead of .then()
    and .catch() method-chaining while still being able to handle any errors that may occur.
    */
    try {
      /*
      The ... in this context is being used as the spread operator. This means that
      we are setting the variables field in our mutation to be an object with key/value
      pairs that match directly to what our formState object looks like.
      */
      const { data } = await login({
        variables: { ...formState }
      });

      // Take the token and store in localstorage
      Auth.login(data.login.token);
    }
    catch (e) {
      console.error(e);
    };
  };

  return (
    <main className='flex-row justify-center mb-4'>
      <div className='col-12 col-md-6'>
        <div className='card'>
          <h4 className='card-header'>Login</h4>
          <div className='card-body'>
            <form onSubmit={handleFormSubmit}>
              <input
                className='form-input'
                placeholder='Your email'
                name='email'
                type='email'
                id='email'
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className='form-input'
                placeholder='******'
                name='password'
                type='password'
                id='password'
                value={formState.password}
                onChange={handleChange}
              />
              <button className='btn d-block w-100' type='submit'>
                Submit
              </button>
            </form>

            {error && <div>Login failed</div>}
          </div>
        </div>
      </div>
    </main>
  );
};


export default Login;