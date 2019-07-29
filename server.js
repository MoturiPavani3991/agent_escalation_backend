var express = require('express');
var app = express();
var cfEnv = require('cfenv');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http)
var request=require('request')
//Body Parser 
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json())

var appEnv = cfEnv.getAppEnv();

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, content-type, Accept");
	next();
});
app.get('/test',(req,res)=>{
res.send(" this is test api ");
})
app.use('/', express.static('public'))

var name;
var agentname;
io.on('connection', function (socket) {
	console.log("id",socket.id);
app.post('/getrequest',(req,res)=>{
	console.log("2222222222222222222222222")
	console.log(req.body)
	userInfo(req.body.fbId).then((userData)=>{
		console.log("userData",userData);
		socket.emit('message', {"fbId":req.body.fbId,"msg":req.body.msg,"firstName":userData.first_name,"profilePic":userData.profile_pic})
		
	})
	res.send("success")
	
})
socket.on('sendMsg', function (msg,userid) {	
	console.log(msg,userid)
	loginSuccessMessage(userid, msg)
})
})
function userInfo(id)
{
	 return new Promise(function(resolve,reject){
  request('https://graph.facebook.com/v3.2/' + id + '?fields=id,first_name,last_name,profile_pic&access_token=EAAE0pZBFEZCDQBAAkdtliYnjjua0W44XscD6gXzOySdXwD4Gg69ZCZAbmnfQ16vO60ZAB0viM3z108mAZBvWIy3Y6d558At6OnZCXq9bif9Wu4B3bRf2ZBaYEp79Uaj2ZBo1OB4tz2mgcQMqwJaLs7rWv3yaaGwwYHO8l69UhRuhZA7ZAeZB6ZCu3ANxi',
    async function (err, response, body) {
		if(err)
		{
			reject({"error":err})
		}
		else
		{
			  var res = JSON.parse(body)
			resolve({"first_name":res.first_name,"profile_pic":res.profile_pic})
		}
    })

});
}
function loginSuccessMessage(id, text) {
    console.log("***************************************************")
    var dataPost = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token:'EAAE0pZBFEZCDQBAAkdtliYnjjua0W44XscD6gXzOySdXwD4Gg69ZCZAbmnfQ16vO60ZAB0viM3z108mAZBvWIy3Y6d558At6OnZCXq9bif9Wu4B3bRf2ZBaYEp79Uaj2ZBo1OB4tz2mgcQMqwJaLs7rWv3yaaGwwYHO8l69UhRuhZA7ZAeZB6ZCu3ANxi'},
        method: 'POST',
        json: {
            recipient: { id: id },
            message: {
                text: text
            }
        }
    };
    requestFun(dataPost)
}
function requestFun(dataPost) {

    request(dataPost, (error, response, body) => {
        if (error) {
            console.log('Error when we try to sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });

}
//Port Initialization 
http.listen(6000, function () {
	console.log('Application port number 6000');
});
