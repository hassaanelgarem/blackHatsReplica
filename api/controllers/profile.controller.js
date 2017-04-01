const mongoose=require('mongoose');
const User=mongoose.model('User');
const Review=mongoose.model('Review');


/*Get User info from the User model with _id
equal to the paraams.userID and return it
Calling route: '/api/profile/:userId'
*/
module.exports.getOneUser =function(req,res){
  var userId=req.params.userId;

  // finds user with the userId from the User model
  User
    .findById(userId)
    .exec(function(err,doc){
      //if an error to find the user,I return the error message
      if(err){
        res
          .status(500)
          .json(err);
      //if no user with that userId was found,I return an error message
      }else if(!doc){
        res
          .status(404)
          .json({"message":"userId not found "+userId});
      }
      //when the user is found successfully,I return the user
      else{
        res
          .status(200)
          .json(doc);
      }
    });
};
