var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var cookieParser = require('cookie-parser')
var session = require('express-session')
var bodyParser = require('body-parser')

app.use(express.static('public'));
app.use(cookieParser())
app.set('trust proxy', 1) // trust first proxy
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  secret: 'keyboard cat',
  name:'test',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 1000 * 3600,httpOnly: true }
}))

app.get('/', function (req, res) {
  console.log(req.session.name)
  if (!req.session.name ){
    res.redirect('/login')
    return;
  }
  res.sendFile(__dirname + '/views/index.html');
});
app.get('/login', function (req, res) {
  console.log('拿到session',req.session.name)
  res.sendFile(__dirname + '/views/login.html');
});
var reqG = null;
app.post('/login', function (req, res) {
  console.log(req.body.name);
  req.session.name = req.body.name
  reqG = req;
  res.redirect('/')
});

io.on('connection', function (socket) {
  console.log(reqG && reqG.session.name)
  console.log('有人进来了。。。')
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('say message', function (data) {
    console.log(data);
  });

  // 广播给每一个人,不包括自己
  socket.broadcast.emit('init send message',{m:1});

  // 监听离开的用户
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

});

server.listen(8081);