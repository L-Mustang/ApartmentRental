class User {
    constructor(email, password, username) {
      (this.email = this.validateEmail(email)),
        (this.password = this.validatePassword(password)),
        (this.username = this.validateUsername(username));
    }
  
    // Needs to be private ?
    validateEmail(email) {
      let regexEmail = new RegExp("^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$");
      if (regexEmail.test(email)) {
        return email;
      } else {
        throw new Error("Invalid Email: " + email)
      }
      return email;
    }
  
    validatePassword(password) {
      return password;
    }
  
    validateUsername(username) {
      let regexUser = new RegExp("^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$");
      if (regexUser.test(username)) {
        return username;
      } else {
        throw new Error("Invalid Username: " + username);
      }
    }
  }
  
  module.exports = User;
  