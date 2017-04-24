const stripe = require("stripe")("sk_test_ICSrGFupD7IcTa2HSBEwC2Iu");

module.exports.charge = function(req, res) {
    var stripeToken = req.body.stripeToken;
    var amount = 1000;

    stripe.charges.create({
        card: stripeToken.id,
        currency: 'usd',
        amount: amount
    },
    function(err, charge) {
        if (err) {
            res.status(500).json({error: err});
        } else {
            res.status(204).json({msg: "Payment confirmed!"});
        }
    });
}
