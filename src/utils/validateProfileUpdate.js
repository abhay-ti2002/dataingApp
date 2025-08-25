const validateProfileEditData = (req) => {
    const allowedEditField = ["about", "name", "phoneno", "username", "age", "gender", "photourl", "about", "skills"];
     return  Object.keys(req.body).every((field) => allowedEditField.includes(field));
};

module.exports = {validateProfileEditData};