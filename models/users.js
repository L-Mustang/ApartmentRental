class User {
    constructor(firstName, lastName, streetAddress, postalCode, city, dateOfBirth, phoneNumber, email, password) {
      this.firstName = firstName,
      this.lastName = lastName,
      this.streetAddress = streetAddress,
      (this.postalCode = this.validatePostalCode(postalCode)),
      this.city = city,
      this.dateOfBirth = dateOfBirth,
      (this.phoneNumber = this.validatePhone(phoneNumber)), 
      (this.email = this.validateEmail(email)),
      this.password = password
    }  

    validatePostalCode(postalCode){
      let regexPostCode = new RegExp("^([0-9]{4})([ ]{1,2})(?!SD|SA|SS)([A-Z]{2})$");
      if (regexPostCode.test(postalCode)) {
        return postalCode;
      } else {
        throw new Error("Invalid postal code: "+ postalCode)
      }
    }

    // Needs to be private ?
    validateEmail(email) {
      let regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regexEmail.test(email)) {
        return email;
      } else {
        throw new Error("Invalid Email: " + email)
      }
    }

    validatePhone(phone) {
      var vast_nummer = /^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$/;
      var mobiel_nummer = /^(((\\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/;
      if(vast_nummer.test(phone) || mobiel_nummer.test(phone)){
        return phone;
      }
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