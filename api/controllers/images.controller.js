const path = require('path');
const fs = require('fs');
const imageTypes = ["activityPhotos", "businessAds", "businessLogos", "businessPhotos", "profilePictures"];

module.exports.getImage = function(req, res) {
  if(imageTypes.indexOf(req.params.imageType) < 0){
    res.status(500).send("Invalid image type");
  }
  else {
    const filePath = './public/uploads/' + req.params.imageType + '/' + req.params.imageName;
    if(fs.existsSync(filePath)){
      res.sendFile(path.resolve(filePath));
    }
    else{
      res.status(404).send("Image not found");
    }
  }

}
