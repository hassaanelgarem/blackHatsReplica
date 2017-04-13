const path = require('path');
const fs = require('fs');
const imageTypes = ["activityPhotos", "businessAds", "businessLogos", "businessPhotos", "profilePictures"];


/*
    Get function that retrieves an image
    imageType can only be:
        - activityPhotos
        - businessAds
        - businessLogos
        - businessPhotos
        - profilePictures
    Takes: 
        params{
            imageType,
            imageName
        }
    Returns: an image or an error message.
    Redirect to: Nothing
    Calling route: '/api/image/:imageType/:imageName'
*/
module.exports.getImage = function(req, res) {
    if (imageTypes.indexOf(req.params.imageType) < 0) {
        res.status(500).send("Invalid image type");
    } else {
        const filePath = './public/uploads/' + req.params.imageType + '/' + req.params.imageName;
        if (fs.existsSync(filePath)) {
            res.sendFile(path.resolve(filePath));
        } else {
            res.status(404).send("Image not found");
        }
    }
}
