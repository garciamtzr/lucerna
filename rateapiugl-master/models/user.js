const mongoose = require('mongoose');
const bcypt = require('bcrypt-nodejs');

const userSchema = mongoose.Schema({
    fullname: {type: String},
    email: {type: String},
    password: {type: String}
});

userSchema.methods.encryptPassword = (password) =>{
    return bcypt.hashSync(password, bcypt.genSaltSync(10),null);
}

userSchema.methods.checkPassword = function(password){
    return bcypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);