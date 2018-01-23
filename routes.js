var bodyParser = require('body-parser');
var morgan = require('morgan');
var Twilio = require('twilio');
var config = require('./config');
var AccessToken = Twilio.jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var ACCOUNT_SID = config.accountSid;
var API_KEY_SID = config.apiKeySid;
var API_KEY_SECRET = config.apiKeySecret;
// Create a Twilio REST API client for authenticated requests to Twilio
var client = new Twilio(API_KEY_SID, API_KEY_SECRET, {accountSid: ACCOUNT_SID});
var db;
const Rooms = {}
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect(config.mongoUrl, function(err, client) {
    // assert.equal(null, err);
    // console.log("Connected successfully to server");

    db = client.db(config.dbName);
    // console.log("db>>>>>>",db)
    // client.close();
});
function getTokenCreator(accessToken, grant) {

}
module.exports = function (app) {
    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    app.use(morgan('combined'));
    app.get("/insertName/:name",function (req, res) {

        const collection = db.collection('UserNames');
        collection.insertOne({name:req.params.name},function (err,docs) {
            if(!err){
                res.send(docs)
            }else{
                res.status(500).send(error)
            }
        })
    })
    app.get('/', function (req, res) {
        res.send('Hello World!');
    });
    app.get('/requestAccessToken/:name', function (req, res) {
        var accessToken = new AccessToken(
            ACCOUNT_SID,
            API_KEY_SID,
            API_KEY_SECRET
        );
        accessToken.identity = req.params.name;
        var grant = new VideoGrant();
        var RoomsIds = Object.keys(Rooms);
        var availableRoomId;
        for (var id of RoomsIds) {
            if (Rooms[id]) {
                Rooms[id] = false;
                availableRoomId = id;
                break;
            }
        }
        if (!availableRoomId) {
            client.video.rooms.create({
                type: 'peer-to-peer',
                enableTurn: 'false'
            }).then((room) => {
                Rooms[room.sid] = true
                grant.room = room.sid;
                accessToken.addGrant(grant);
                var jwt = accessToken.toJwt();
                console.log("room.sid",room.sid)
                res.send({jwt, sid: room.sid});
            }).catch((error) => {
                console.log(error);
                res.status(500).send(error)
            });
        } else {
            grant.room = availableRoomId;
            accessToken.addGrant(grant);
            var jwt = accessToken.toJwt();
            res.send({jwt, sid: availableRoomId});
        }
    });
    app.get('/createRoom', function (req, res) {
        client.video.rooms.create({
            type: 'peer-to-peer',
            enableTurn: 'false'
        }).then((room) => {
            res.send('Hello World!' + JSON.stringify(room.sid));
            console.log(room.sid);
        }).catch((error) => {
            console.log(error);
            res.status(500).send(error)
        });

    });
    app.get('/completeRoom/:sid', function (req, res) {
        const roomId = req.params.sid
        if (Rooms.hasOwnProperty(roomId)) {
            delete Rooms[roomId];
            client.video.rooms(roomId)
                .update({
                    status: 'completed'
                })
                .then((room) => {
                    res.send({status: true, message: "room id is succesfull completed"})
                    console.log(room.status);
                });
        } else {
            res.send({status: true, message: "room id doesn't exists"})
        }

    });
}