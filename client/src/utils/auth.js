import decode from 'jwt-decode';


/*
Here's a series of methods that try to do one thing and one thing only.
If need to do anything outside of that, then rely another method to perform
that action.
If the .loggedIn() method is called from a component, it will return a simple
true or false in return, but the functionality itself will rely on other methods
to get to that response. If .login() is called, then accept the token, set it to
localStorage, and refresh the app.
*/
class AuthService {
   // retrieve data saved in token
   getProfile() {
      return decode(this.getToken());
   }

   // check if the user is still logged in
   loggedIn() {
      // Checks if there is a saved token and it's still valid
      const token = this.getToken();
      // use type coersion to check if token is NOT undefined and the token is NOT expired
      return !!token && !this.isTokenExpired(token);
   }

   // check if the token has expired
   isTokenExpired(token) {
      try {
         const decoded = decode(token);
         if (decoded.exp < Date.now() / 1000) {
            return true;
         } else {
            return false;
         }
      } catch (err) {
         return false;
      }
   }

   // retrieve token from localStorage
   getToken() {
      // Retrieves the user token from localStorage
      return localStorage.getItem('id_token');
   }

   // set token to localStorage and reload page to homepage
   login(idToken) {
      // Saves user token to localStorage
      localStorage.setItem('id_token', idToken);
      window.location.assign('/');
   }

   // clear token from localStorage and force logout with reload
   logout() {
      // Clear user token and profile data from localStorage
      localStorage.removeItem('id_token');
      // this will reload the page and reset the state of the application
      window.location.assign('/');
   }
}


export default new AuthService();