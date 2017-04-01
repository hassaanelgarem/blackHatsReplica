const multer = require('multer');
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Business = mongoose.model("Business");
const fs = require('fs');
const path = require("path");


// for testing
/*
module.exports.add = function(req, res){
    const newBusiness = new Business({name: "test", email: "test", password: "test", description: "test"});
    newBusiness.save(function (err, business) {
      if (err) return res.json({success: false, msg: 'adding failed'});
      res.json({success: true, msg: 'added'});
    });
};
*/

/* Multer configuration to upload a single file from an
html input with name "myfile" to public/uploads folder*/
const upload = multer({
    dest: path.join(__dirname, '../', '../public/uploads')
}).single('myfile');


/*3.3: 
Upload photo using multer 
and store the uploaded image path in the Business 
model in photos array, and return the 
filepath to the frontend to show the image.
Calling route: '/api/business/:businessId/addPhoto'
*/
module.exports.addPhoto = function (req, res) {
	//Check if business logged in
	if (req.user) {
		//upload the image
		upload(req, res, function (err) {
			//if an error occurred, return the error
			if (err) {
				return res.json(err);
			}
			/*if multer found a file selected
			and image was uploaded successfully, 
			multer will save the image in req.file*/
			if (req.file) {
				//get the image format
				var string = req.file.originalname.substring(req.file.originalname.length - 3, req.file.originalname.length);
				
				//if it was jpeg add a "j" to the returned "peg"
				if (string === "peg")
					string = "j" + string;

				//check if it is not a valid image format
				if (!(string === "png" || string === "jpg" || string === "jpeg")) {
					//delete the uploaded file
					fs.unlink(req.file.path);

					//return the error message to frontend
					return res.json({
						error: "File format is not supported!"
					});
				}
				//copy and rename the image to the following format and location
				var newPath = path.join(__dirname, "../", "../public/uploads/businessPhotos/img" + Date.now() + "." + string);
				fs.renameSync(req.file.path, newPath, function (err) {
					if (err) throw err;

					//delete the image with the old name
					fs.unlink(req.file.path);
				});
                
                //add the image file path to the photos array of the Business model
                db.Business.update(
                 {"_id": req.params.businessId },
                 {$push: {"photos": newPath }},
                 function(err, result) {
                    //couldn't add to array, return the error
                    if (err) {
                        res.json(err);
                     }
                    else{
                        //return the file path to the frontend to show the image
			            res.json(newPath);
                    }
      
                });
			} 
			//multer did not find a file selected to upload
			else {
				res.json({
					error: "Choose a valid file"
				});
			}
		});
	} 
	//user is not logged in
	else {
		res.json({error : "login"});
	}
};


/*
delete function that deletes photo from business page
URI: api/business/:businessId/deletePhoto/:photoPath
 */
module.exports.deletePhoto = function(req, res){
    var imagePath = req.params.photoPath;
    var businessId = req.params.businessID;
    Business.findOneAndUpdate({"_id": businessId}, {$pull: {"photos": imagePath}}, function(err, data){
        
        if(err){
            res.json({success: false, msg: 'deleting photo failed'});
        } 
        else{
            res.json({success: true, msg: 'photo deleted successfully'});
        }
        

      });
}

