var express = require('express');
var app = express();
var server = require('http').Server(app);

var cookieParser = require('cookie-parser')
var session = require('express-session')
var bodyParser = require('body-parser')
const Socket = require('./socket')(server)
var RedisStrore = require('connect-redis')(session);

app.use(express.static('public'));
app.use(cookieParser())
app.set('trust proxy', 1) // trust first proxy
app.use(bodyParser.urlencoded({ extended: false }))


let sessionStore = {
  "host" : "127.0.0.1",
  "port" : "6379",
  "db" : 1,
  "ttl" : 1000,
  "logErrors" : true
}

app.use(session({
  secret: 'keyboard cat',
  name:'test',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 18000,httpOnly: true },
  store : new RedisStrore(sessionStore)
}))

const cusomeSocket = new Socket();

app.use((req,res,next) => {
  cusomeSocket.getUserNameBySession(req);
  next();
})

app.get('/', function (req, res) {
  if (!req.session.name){
    res.redirect('/login')
    return;
  }
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/views/login.html');
});
app.post('/login', function (req, res) {
  req.session.name = req.body.name
  res.send({
    code:0,
    success: true,
    isLogin: true
  })
});



server.listen(8081);