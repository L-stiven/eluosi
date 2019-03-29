// 俄罗斯方块游戏的核心代码
var Game = function (socket) {
    // dom元素
    var gameDiv;
    var nextDiv;
    var timeDiv;
    var resultDiv;
    // 分数
    var score = 0;

    // 游戏矩阵
    var gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    // 当前方块
    var cur;
    // 下一个方块
    var next;
    // divs
    var nextDivs = [];
    var gameDivs = [];

    // 初始化DIV
    var initDiv = function (container, data, divs) {
        for (var i = 0; i < data.length; i++) {
            var div = [];
            for (var j = 0; j < data[0].length; j++) {
                var newNode = document.createElement("div");
                newNode.className = "none";
                newNode.style.top = (i * 20) + "px";
                newNode.style.left = (j * 20) + "px";
                container.appendChild(newNode);
                div.push(newNode);
            }
            divs.push(div);
        }
    }

    // 刷新div
    var refreshDiv = function (data, divs) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] == 0) {
                    divs[i][j].className = "none";
                } else if (data[i][j] == 1) {
                    divs[i][j].className = "done";
                } else if (data[i][j] == 2) {
                    divs[i][j].className = "current";
                }
            }
        }
    }

    // 检测点是否合法
    var check = function (pos, x, y) {
        // pos相当于原点x,y; x和y是当前函数的i和j
        if (pos.x + x < 0) {
            return false;
        } else if (pos.x + x >= gameData.length) {
            return false;
        } else if (pos.y + y < 0) {
            return false;
        } else if (pos.y + y >= gameData[0].length) {
            return false;
        } else if (gameData[pos.x + x][pos.y + y] == 1) {
            return false;
        } else {
            return true;
        }
    }


    // 检测数据是否合法
    var isValid = function (pos, data) {
        // pos代表原点  data代表方块的数据 二维数组
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] != 0) {
                    if (!check(pos, i, j)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }





    // 清除数据
    var clearData = function () {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 0;
                }
            }
        }
    }




    // 设置数据
    var setData = function () {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j];
                }
            }
        }
    }

    // 下移
    var down = function () {
        if (cur.canDown(isValid)) {
            clearData();
            cur.down();
            setData();
            refreshDiv(gameData, gameDivs);
            // 返回一个状态,是否可以继续下降
            return true;
        } else {
            // 返回一个状态,是否可以继续下降
            return false;
        }
    }

    // 左移
    var left = function () {
        if (cur.canLeft(isValid)) {
            clearData();
            cur.left();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    }

    // 右移
    var right = function () {
        if (cur.canRight(isValid)) {
            clearData();
            cur.right();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    }


    // 旋转
    var rotate = function () {
        if (cur.canRotate(isValid)) {
            clearData();
            cur.rotate();
            setData();
            refreshDiv(gameData, gameDivs);
        }
    }




    // 方块到底固定
    var fiexd = function () {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    if (gameData[cur.origin.x + i][cur.origin.y + j] == 2) {
                        gameData[cur.origin.x + i][cur.origin.y + j] = 1
                    }
                }
            }
        }
        refreshDiv(gameData, gameDivs);
    }






    // 消行逻辑
    var checkClear = function () {
        // 设置消行行数为0
        var line = 0;
        // 先循环游戏区域数组，从下往上循环
        for (var i = gameData.length - 1; i >= 0; i--) {
            // 先设置为true
            var clear = true;
            // 循环每一个项中的每一个
            for (var j = 0; j < gameData[0].length; j++) {
                // 如果有一个不等于1,就不能被清除,为false
                if (gameData[i][j] != 1) {
                    clear = false;
                    break;
                }
            }
            // 如果可以被清除
            if (clear) {
                // 消行了就加一
                line = line + 1;
                // 从下往上循环
                for (var m = i; m > 0; m--) {
                    // 循环每项每一个
                    for (var n = 0; n < gameData[0].length; n++) {
                        // 将当前可以消除的一项等于消除的上一项
                        // 第8行可以消除，将第七项的数据复制给第八行
                        gameData[m][n] = gameData[m - 1][n]
                    }
                }
                for (var n = 0; n < gameData[0].length; n++) {
                    gameData[0][n] = 0;
                }
                i++
            }
        }
        return line;
    }


    // 检查游戏是否结束
    var checkGameOver = function () {
        // 先设为false
        var gameOver = false;
        // 循环游戏数据 
        for (var i = 0; i < gameData[0].length; i++) {
            // 如果第二行有方块的话  就差不多凉了
            if (gameData[1][i] == 1) {
                // 设为游戏结束
                gameOver = true;
            }
        }
        return gameOver;
    }




    // 使用下一个方块
    var performNext = function (type, dir) {
        cur = next;
        setData();
        next = SquareFactory.prototype.make(type, dir);
        refreshDiv(gameData, gameDivs);
        refreshDiv(next.data, nextDivs);
    }









    // 设置时间
    var setTime = function (time) {
        timeDiv.innerHTML = time;
    }

    // 消行分数
    var addScore = function (line) {
        var s = 0;
        switch (line) {
            case 1:
                s = 10;
                break;
            case 2:
                s = 30;
                break;
            case 3:
                s = 60;
                break;
            case 4:
                s = 100;
                break;
            default:
                break;
        }
        score = score + s;
        scoreDiv.innerHTML = score;
    }

    // 游戏结束
    var gameover = function (win) {
        console.log(resultDiv);
        if (win) {
            resultDiv.innerHTML = '赢了'
        } else {
            resultDiv.innerHTML = '输了'
        }
    }


        // 底部加行 lines是数组，要增加的行 1
        var addTailLines = function (lines) {
            // 循环gameData 把数据往上移增加的行数数量
            for (var i = 0; i < gameData.length - lines.length; i++) {
                gameData[i] = gameData[i + lines.length];
            }
            // 将空出来的行数增加为lines的数据
            for (var i = 0; i < lines.length; i++) {
                gameData[gameData.length - lines.length + i] = lines[i]
            }
            // 将当前的方块也挪lines.length行
            cur.origin.x = cur.origin.x - lines.length;
            if (cur.origin.x < 0) {
                cur.origin.x = 0
            }
            refreshDiv(gameData, gameDivs);
        }

    //初始化
    var init = function (doms, type, dir) {
        gameDiv = doms.gameDiv;
        nextDiv = doms.nextDiv;
        timeDiv = doms.timeDiv;
        scoreDiv = doms.scoreDiv;
        resultDiv = doms.resultDiv;
        next = SquareFactory.prototype.make(type, dir);
        initDiv(gameDiv, gameData, gameDivs);
        initDiv(nextDiv, next.data, nextDivs);
        refreshDiv(next.data, nextDivs);
    }

    // 导出API
    this.init = init;
    this.down = down;
    this.left = left;
    this.right = right;
    this.rotate = rotate;
    // 如果返回是true，就一直向下，返回false，表示到底了
    this.fall = function () {
        while (down());
    }
    this.fiexd = fiexd;
    this.performNext = performNext;
    this.checkClear = checkClear;
    this.checkGameOver = checkGameOver;
    this.setTime = setTime;
    this.addScore = addScore;
    this.gameover = gameover;
    this.addTailLines = addTailLines;
}