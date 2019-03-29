
// 我的区域中游戏的代码逻辑
var Local = function (socket) {
    // 游戏对象
    var game;
    // 时间间隔
    var INTERVAL = 200;
    // 定时器
    var timer = null;
    // 时间计数器
    var timeCount = 0;
    // 时间
    var time = 0;
    // 绑定键盘事件
    var bingKeyEvent = function () {
        document.onkeydown = function (e) {
            if (e.keyCode == 38) { //向上
                game.rotate();
                socket.emit("rotate");
            } else if (e.keyCode == 39) { //向右
                game.right();
                socket.emit("right");
            } else if (e.keyCode == 40) {// 向下
                game.down();
                socket.emit("down");
            } else if (e.keyCode == 37) {// 向左  
                game.left();
                socket.emit("left");
            } else if (e.keyCode == 32) {// 空格键
                game.fall();
                socket.emit("fall");
            }
        }
    }
    // 方块下落
    var move = function () {
        // 直接调用下落函数
        timeFun();
        if (!game.down()) {
            // 方块下落到底部固定
            game.fiexd();
            socket.emit("fiexd");
            // 固定之后要检测是否能消除
            var line = game.checkClear();
            if (line) {
                game.addScore(line);
                socket.emit("line", line);
                if (line > 1) {
                    var bottomLines = gennerateBottomLine(line);
                    socket.emit("bottomLines", bottomLines);
                }
            }
            // 检查游戏是否结束
            var gameOver = game.checkGameOver();
            // 如果是true 证明游戏结束
            if (gameOver) {
                game.gameover(false);
                document.getElementById("remote_gameover").innerHTML = "你赢了"
                socket.emit('lose');
                stop();
            } else {
                var t = generateType();
                var d = generateDir();
                game.performNext(t, d);
                // 下一个方块也是随机的，也要告诉wsSever
                socket.emit("next", { type: t, dir: d });
            }
        } else {
            socket.emit("down");
        }
    }

    // 随机生成一个方块种类
    var generateType = function () {
        return Math.ceil(Math.random() * 7) - 1;
    }

    // 随机生成一个方块的旋转次数
    var generateDir = function () {
        return Math.ceil(Math.random() * 4) - 1;
    }

    // 随机生成干扰行
    var gennerateBottomLine = function (lineNum) {
        var lines = [];
        for (var i = 0; i < lineNum; i++) {
            var line = [];
            for (var j = 0; j < 10; j++) {
                line.push(Math.ceil(Math.random() * 2) - 1);
            }
            lines.push(line);
        }
        return lines;
    }

    // 计时的函数
    var timeFun = function () {
        timeCount = timeCount + 1;
        if (timeCount == 5) {
            timeCount = 0;
            time = time + 1;
            game.setTime(time);
            socket.emit("time", time);
            // if (time % 10 == 0) {
            //     game.addTailLines(gennerateBottomLine(1));
            // }

        }
    }

    // 开始
    var start = function () {
        // 获取html的两个盒子
        var doms = {
            gameDiv: document.getElementById("local_game"),
            nextDiv: document.getElementById("local_next"),
            timeDiv: document.getElementById("local_time"),
            scoreDiv: document.getElementById("local_score"),
            resultDiv: document.getElementById("local_gameover"),
        }
        game = new Game();
        // 要监听到对方的方块是什么，所以要把随机生成的数据传过来
        var type = generateType();
        var dir = generateDir();
        game.init(doms, type, dir);
        // 游戏开始要发送init消息给wsSever 
        socket.emit("init", { type: type, dir: dir });
        bingKeyEvent();
        var t = generateType();
        var d = generateDir();
        game.performNext(t, d);
        // 下一个方块也是随机的，也要告诉wsSever
        socket.emit("next", { type: t, dir: d });
        // 绑定下落定时器
        timer = setInterval(move, INTERVAL);
    }

    // 结束
    var stop = function () {
        // 结束把定时器清除
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        document.onkeydown = null;
    }
    // 监听start命令
    socket.on("start", function () {
        document.getElementById("waiting").innerHTML = "";
        start();
    });

    socket.on("lose", function () {
        game.gameover(true);
        stop();
    });

    socket.on("leave", function () {
        document.getElementById("local_gameover").innerHTML = "对方掉线";
        document.getElementById("remote_gameover").innerHTML = "已掉线";
    });

    socket.on("bottomLines", function (data) {
        game.addTailLines(data);
        socket.emit("addTailLines",data);
    });
}