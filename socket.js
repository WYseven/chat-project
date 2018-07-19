var io = require('socket.io');
class Socket {
  constructor(){
    this.userNameList = [];
    this.userName = null;
    this.init();
  }
  init(){
    io.on('connection', (socket) => {
      console.log('有人进来了。。。',this.userName)
      socket.emit('welcome chat', { hello: '欢迎来到聊天室',mySelfName: this.userName});
      // 广播给每一个人,不包括自己
      socket.broadcast.emit('have people come in',{
        userName: this.userName
      });
      
      // 监听说的消息
      socket.on('say message', (data) => {
        // 广播给自己
        socket.emit('have people say message',data);
        socket.broadcast.emit('have people say message',data);
      })

      // 监听离开的用户
      socket.on('disconnect', () => {
        console.log('user disconnected',this.userName);
      });
    });
  }
  getUserNameBySession(req){
    this.userNameList.push(req.session.name);
    this.userName = req.session.name;
  }
}

module.exports =  (server) => {
  io = io(server)
  return Socket
};

