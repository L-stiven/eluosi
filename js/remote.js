// 控制对方游戏区域的逻辑
var Remote = function (socket) {
    var game;
    var bindEvents = function () {
        // 这个页面控制对方游戏区域的逻辑
        // 相当于在对方的页面调用这个函数
        socket.on("init", function (data) {
            start(data.type, data.dir);
        });
        socket.on("next", function (data) {
            game.performNext(data.type, data.dir);
        });
        socket.on("rotate", function (data) {
            game.rotate();
        });
        socket.on("right", function (data) {
            game.right();
        });
        socket.on("down", function (data) {
            game.down();
        });
        socket.on("left", function (data) {
            game.left();
        });
        socket.on("fall", function (data) {
            game.fall();
        });
        socket.on("fiexd", function (data) {
            game.fiexd();
        });
        socket.on("line", function (data) {
            game.checkClear();
            game.addScore(data);
        });
        socket.on("time", function (data) {
            game.setTime(data);
        });
        socket.on("lose", function (data) {
            game.gameover(false);
        });
        socket.on("addTailLines", function (data) {
            game.addTailLines(data);
        });
    }
    var start = function (type, dir) {
        var doms = {
            gameDiv: document.getElementById("remote_game"),
            nextDiv: document.getElementById("remote_next"),
            timeDiv: document.getElementById("remote_time"),
            scoreDiv: document.getElementById("remote_score"),
            resultDiv: document.getElementById("remote_gameover")
        }
        game = new Game();
        game.init(doms, type, dir);
    }
    bindEvents();
}