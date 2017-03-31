var mongoose = require("mongoose");
var Business = mongoose.model('Business');




module.exports.EditBusinessBasicInfo=function (req,res){

	res.send("should redirect to EditBusiness Page !");
	//res.render('editbusiness');
}


module.exports.SaveNewInfo=function (req,res){


 if (req.session.name) {
 	Business.findOne({
 		name:req.session.name } , function(err, business){
 			if(!err && business)
 			{ 
 				var name = req.body.name;
				var field = req.param.name ;
				var fieldbody = req.body ; 

					switch (field){

						case'Name': business.name=fieldbody; break;
						case 'Email': business.email= fieldbody; break;
						case'phoneNumber': business.phoneNumbers=fieldbody; break;
						case'workingDay': business.workingDays=fieldbody; break;
						case'workingHourFrom': business.workingHours.from=fieldbody; break;
						case'workingHourTo':business.workingHours.to=fieldbody; break;
				        case'address': business.address=fieldbody; break;
						case'description': business.description=fieldbody; break;
						case'logo':business.logo=fieldbody; break;
					} 
			}
			 else 
 				res.send("Please SignIn first !");
}

 	)} 
 	else 
 		res.send("Updating info Failed , Please try again !");
 }

    
