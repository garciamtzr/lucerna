const passport = require('passport');
const User = require('../models/user');

exports.createUser = (req, res, next) =>{

   if(req.body.email === undefined || req.body.password === undefined){
      return res.status(200).json({error: 'Empty fields are not allowed'});
   }

   if(req.body.email === '' || req.body.password === ''){
      return res.status(200).json({error: 'Empty fields are not allowed'});
   }

      passport.authenticate('local-signup',(err, user, info) =>{
         if(err){
            return res.status(200).json({error: err});
         }
         if(info){
            return res.status(200).json({error: info});
         }

      return res.status(201).json({message: 'User succesfully created', user: user});

   })(req, res, next);
}


exports.loginUser = (req, res, next) =>{
      if(req.body.email === undefined || req.body.password === undefined){
         return res.status(200).json({error: 'Empty fields are not allowed'});
      }

      if(req.body.email === '' || req.body.password === ''){
         return res.status(200).json({error: 'Empty fields are not allowed'});
      }

      passport.authenticate('local-login',(err, user, info) =>{
         if(err){
            return res.status(200).json({error: err});
         }
         if(info){
            return res.status(200).json({error: info});
         }
      
    
      return res.status(201).json({message: 'User login succesfully ', user: user});

   })(req, res, next);
}

exports.homePage = async (req, res) =>{
   const results = await User.findOne({'email': req.params.email}, {'password': 0});

   return res.status(200).json({user: results});
}