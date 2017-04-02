const mongoose = require("mongoose");
const Business = mongoose.model('Business');


/*redirects business to display "Edit View" 
also it passes business basic info to the "Edit view" */
module.exports.editBasicInfo=function(req ,res){
	//check if logged in 
	if(req.user){ 
			Business.findOne({
				_id:req.params.businessId} , function(err,business){
				//if error occured 
				if (err) {
				 res.json(err);
			    } 
			else { 

					// if business found 
					if(business)
						res.json(business);
					

					//business is not logged in
					else 
						res.json({error : "Please log in first !"});
			     }
	    });
   }
}


/* service to save the edited business info in the database */
module.exports.saveNewInfo=function (req,res){

//if logged in
 if (req.user) { 
 	Business.findOne({
 		_id:req.parms.businessId} , function(err, business){
 			//if an error occurred, return the error
			if (err) {
				res.json(err);
			}

			// if business found in database its basic info will be saved 
 			if(!err && business){ 

						business.name= req.body.name;
						business.email= req.body.email;
						business.password=req.body.password;
						business.phoneNumbers.push(req.body.phoneNumber1); 
						business.phoneNumbers.push(req.body.phoneNumber2); 
						business.workingDays.push(req.body.workingDays);
						business.workingHours = {from : req.body.from, to : req.body.to};
				        business.address=req.body.address;
					    business.description=req.body.description;
					} 
			} 
		

     	)}  
 	
		 	//if business not logged in
		 	else {
				res.json({error : "login"});
			    }
}

    
