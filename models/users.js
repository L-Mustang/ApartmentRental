class User {
    constructor(firstName, lastName, streetAddress, postalCode, city, dateOfBirth, phoneNumber, email, password) {
      
      (this.email = this.validateEmail(email)),
      this.password = password,
      this.firstName = firstName,
      this.lastName = lastName,
      this.streetAddress = streetAddress,
      this.postalCode = postalCode,
      this.city = city,
      this.dateOfBirth = dateOfBirth,
      this.phoneNumber = phoneNumber
    }
  
    // Needs to be private ?
    validateEmail(email) {
      let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regexEmail.test(email)) {
        return email;
      } else {
        throw new Error("Invalid Email: " + email)
      }
      return email;
    }
  
    // validateUsername(username) {
    //   let regexUser = new RegExp("^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$");
    //   if (regexUser.test(username)) {
    //     return username;
    //   } else {
    //     throw new Error("Invalid Username: " + username);
    //   }
    // }
  }
  
  module.exports = User;