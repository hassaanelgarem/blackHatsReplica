const stripe = require("stripe")("sk_test_ICSrGFupD7IcTa2HSBEwC2Iu");

module.exports.charge = function(req, res) {
  console.log("PAYMENT");
    var stripeToken = req.body.stripeToken;
    var amount = 1000;
    console.log(stripeToken);
    // res.json({msg: "hey"});

    stripe.charges.create({
        card: stripeToken.id,
        currency: 'usd',
        amount: amount
    },
    function(err, charge) {
        if (err) {
            console.log("ERROR");
            console.log(err);
            res.status(500).json({error: err});
        } else {
            res.status(204).json({msg: "Payment confirmed!"});
        }
    });
}
