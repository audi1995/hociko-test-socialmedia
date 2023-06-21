exports.email = (value) => {
    var rogex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let data = null;
    value.email && value.email.match(rogex)
      ? (data = { message: "data valid", status: true })
      : (data = { message: "Invalid email", status: false });
    return data;
  };
  
  exports.phone = (value) => {
    var phone_rogex =  /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    let data = null;
    value.phone && value.phone.match(phone_rogex)
      ? (data = { message: "Phone no validated", status: true })
      : (data = { message: "PLease Provide Valid Phone No", status: false });
    return data;
  };
  
  exports.both = (value) => {
    var phone_regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    var email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let data = null;
    
    if (value.email && value.email.match(email_regex)) {
      if (value.phone && String(value.phone).match(phone_regex)) {
        data = { message: "Data validated", status: true };
      } else {
        data = { message: "Please provide a valid phone number", status: false };
      }
    } else {
      data = { message: "Please provide a valid email", status: false };
    }
    return data;
  };
  