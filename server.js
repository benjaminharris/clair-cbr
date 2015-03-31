//server.js

//BASE SETUP
// ======================================

//call necessary packages
var express		= require('express');
var app			= express();
var bodyParser	= require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose   = require('mongoose');
mongoose.connect('mongodb://172.28.1.9:27017/cbr');

var Bathroom	= require('./app/models/bathroom');

var port = process.env.port || 8081;

//ROUTES
//======================================

var router = express.Router();

router.use(function(req, res, next) {
	console.log('Something is happening.');
	next();
});

//test route
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api '});
});

router.route('/bathrooms')

	//create a bathroom
	.post(function(req, res) {
		var bathroom = new Bathroom();
		bathroom.uuid = req.body.uuid
		bathroom.name = req.body.name;
		bathroom.openDate = Date();
		bathroom.closeDate = Date();
		bathroom.isOccupied = req.body.isOccupied;

		bathroom.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Bathroom created!'});
		});
	})

	// get all the bathrooms
	.get(function(req, res) {
		Bathroom.find(function(err, bathrooms) {
			if (err)
				res.send(err);

			res.json(bathrooms);
		});
	});

router.route('/bathrooms/:bathroom_uuid')

	// get bathroom with associated id
	.get(function(req, res) {
		Bathroom.findOne({ uuid: req.params.bathroom_uuid }, function(err, bathroom) {
			if (err)
				res.send(err);
			res.json(bathroom);
		});
	})

	//update the bathroom with this id
	.put(function(req, res) {

		if (req.body.isOccupied == "true"){
		Bathroom.findOne({ uuid: req.params.bathroom_uuid }, function(err, bathroom) {
			if (err)
				res.send(err);
			console.log('The '+req.body.name+' door has been closed.');
			bathroom.name = req.body.name;
			bathroom.isOccupied = req.body.isOccupied;
			bathroom.closeDate = Date();

			bathroom.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bathroom opened updated!' });
			});
		})}
		else if (req.body.isOccupied == "false"){
		Bathroom.findOne({ uuid: req.params.bathroom_uuid }, function(err, bathroom) {
			if (err)
				res.send(err);
			console.log('The '+req.body.name+' door has been opened.');
			bathroom.name = req.body.name;
			bathroom.isOccupied = req.body.isOccupied;
			bathroom.openDate = Date();

			bathroom.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bathroom closed updated!' });
			})
		});
	}
})

	.delete(function(req, res) {
		Bathroom.remove({
			uuid: req.params.bathroom_uuid
		}, function(err, bathroom) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port)
