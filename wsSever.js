// 创建一个http服务器
var app = require("http").createServer();

var io = require("socket.io")(app);
var PORT = 3000;
// 监听端口
app.listen(PORT);
// 客户端计数
var clientCount = 0;
// 用来存储客户端socket 两个玩家的参数
var socketMap = {};
// 接受到local发送过来的类型消息
var bindListener = function (socket, event) {
    socket.on(event, function (data) {
        // 如果余为零，证明是最后进来的玩家 
        if (socket.clientNum % 2 == 0) {
            // 发送数据给第一位
            if (socketMap[socket.clientNum - 1]) {
                socketMap[socket.clientNum - 1].emit(event, data);
            }

        } else {
            // 发送数据给第二位
            if (socketMap[socket.clientNum + 1]) {
                socketMap[socket.clientNum + 1].emit(event, data);
            }
        }
    });
}

// 客户端连接
io.on("connection", function (socket) {
    // 因为用户有两个，需要计数。
    clientCount = clientCount + 1;
    socket.clientNum = clientCount;
    socketMap[clientCount] = socket;
    if (clientCount % 2 == 1) {
        // 第一位进来 发送一个waiting消息
        socket.emit("waiting", "等待另一位一个靓仔");
    } else {
        // 第二位进来 发送一个start消息
        // 向第一位玩家发送一个start命令
        if (socketMap[(clientCount - 1)]) {
            socket.emit("start");
            socketMap[(clientCount - 1)].emit("start");
        } else {
            socket.emit('leave')
        }
    }




    bindListener(socket, 'init');
    bindListener(socket, 'next');
    bindListener(socket, 'rotate');
    bindListener(socket, 'left');
    bindListener(socket, 'right');
    bindListener(socket, 'down');
    bindListener(socket, 'fall');
    bindListener(socket, 'fiexd');
    bindListener(socket, 'line');
    bindListener(socket, 'time');
    bindListener(socket, 'lose');
    bindListener(socket, 'bottomLines');
    bindListener(socket, 'addTailLines');

    socket.on("disconnect", function () {
        // 服务器断开的时候

        if (socket.clientNum % 2 == 0) {
            // 发送数据给第一位
            if (socketMap[socket.clientNum - 1]) {
                socketMap[socket.clientNum - 1].emit('leave');
            }

        } else {
            // 发送数据给第二位
            if (socketMap[socket.clientNum + 1]) {
                socketMap[socket.clientNum + 1].emit('leave');
            }
        }
        delete(socketMap[socket.clientNum]);
    });
});

console.log("监听3000")