import gql from 'graphql-tag';

// Setup the two arguments to pass in when integrating with the login form page.
// Expect the logged-in user's data and the token to be returned.
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


// Mutation for creating a new user through the signup form page
// This will be passed to the useMutation Hook in the Signup component
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;


// Mutation for adding a friend through the profile form page
// This will be passed to the useMutation Hook in the Profile component
export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
      _id
      username
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;