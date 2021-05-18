const isEmail = (email) => {
  const exp =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email.match(exp)) return true
  else return false
}

const isEmpty = (string) => {
  if (string.trim() === "") return true
  else return false
}

exports.validateSignUpData =(data)=>{
  //validations
  let errors = {}
  if (isEmpty(data.email)) {
    errors.email = "Email should not be empty"
  } else if (!isEmail(data.email)) {
    errors.email = "Email must be valid"
  }
  if (isEmpty(data.password)) errors.password = "should not be empty"

  if (data.password !== data.conformPassword)
    errors.conformPassword = "Password must be match"

  if (isEmpty(data.handle)) errors.handle = "should not be empty"

  
  return {
    errors,
    valid:Object.keys(errors).length===0 ? true:false
  }
}

exports.validationsLoginData=(data)=>{
  let errors = {}
  if (isEmpty(data.email)) {
    errors.email = "Email Should not be empty"
  }
  if (!isEmail(data.email)) {
    errors.email = "Email must be valid"
  }

  if (isEmpty(data.password)) {
    errors.password = "Password Should not be empty"
  }

  return{
    errors,
    valid:Object.keys(errors).length==0 ?true:false
  }
}