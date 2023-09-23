import GameObject from './GameObject';
import Player from './Player';

export default class GameMap extends GameObject {
    // 实现游戏的地图界面
    constructor(ctx, parent) {
        super();
        this.ctx = ctx;
        this.parent = parent;
        // 棋盘的大小一般都是15×15的
        this.rows = 15;
        this.cols = 15;
        this.L = 0; // 为了实现动态布局，格子的大小根据父元素的大小进行设定
        this.dynamic_len = 0; // 为了使得canvas最大化的边长
        this.map = []; // 为了方便判断，存储整个棋局
        // 创建两名玩家，共同享用一个对局
        this.players = [new Player({ id: 1, color: 'black' }, this), new Player({ id: 2, color: 'white' }, this)];
        this.current_round = 'black'; // 黑色的棋子先行
    }

    addEventListener_click() {
        this.ctx.canvas.focus(); // 使canvas聚焦
        this.ctx.canvas.addEventListener('click', (e) => {
            // 监听鼠标点击事件
            let { x, y } = e; // 得到点击的位置
            // 让他们相对于canvas的左上角进行定位
            const canvasRect = this.ctx.canvas.getBoundingClientRect();
            x = x - canvasRect.left;
            y = y - canvasRect.top;
            if (x < 35 || x > this.ctx.canvas.width - 35 || y < 45 || y > this.ctx.canvas.height - 45) return false;
            let pos_x = Math.floor((x + this.L / 2) / this.L) - 1;
            let pos_y = Math.floor((y + this.L / 2) / this.L) - 1;

            if (this.current_round === 'black' && this.map[pos_x][pos_y] === 'null') {
                this.players[0].set_position(pos_x * 15 + pos_y);
                this.map[pos_x][pos_y] = 'black';
                this.current_round = 'white';
            } else if (this.current_round === 'white' && this.map[pos_x][pos_y] === 'null') {
                this.players[1].set_position(pos_x * 15 + pos_y);
                this.map[pos_x][pos_y] = 'white';
                this.current_round = 'black';
            }
        });
    }

    start() {
        for (let i = 0; i < this.rows; i++) {
            let line = [];
            for (let j = 0; j < this.cols; j++) {
                line.push('null');
            }
            this.map[i] = line;
        }

        this.addEventListener_click();
    }

    check_Y(x, y) {
        let count = 0; // 控制下面循环的次数的变量
        let up = 0; // 记录向上找的次数
        let down = 0; // 记录向下找的次数
        let target = this.map[x][y]; // 获取当前棋子的颜色

        let num = 1; // 初始只有一个连子

        while (count < 100) {
            // 多次循环判断
            count++;
            if (num >= 5 || (this.map[x][y - up] !== target && this.map[x][y + down] !== target)) {
                // 如果连子的个数大于等于5或者旁边的棋子颜色跟当前棋子的颜色不同，退出当前循环
                break;
            }

            up++;
            if (this.map[x][y - up] && this.map[x][y - up] === target) {
                // 如果该子的上面的位置有棋子并且颜色与当前棋子颜色相同
                num++;
            }
            this.map[x][y - up];

            down++;
            if (this.map[x][y + down] && this.map[x][y + down] === target) {
                num++;
            }
        }

        return num >= 5;
    }

    check_X(x, y) {
        let count = 0;
        let left = 0; // 记录向左找的次数
        let right = 0; // 记录向右找的次数
        let target = this.map[x][y];

        let num = 1; // 初始只有一个连子

        while (count < 100) {
            count++;
            if (num >= 5 || (this.map[x - left][y] !== target && this.map[x + right][y] !== target)) {
                break;
            }

            left++;
            if (this.map[x - left][y] && this.map[x - right][y] === target) {
                num++;
            }
            this.map[x - right][y];

            right++;
            if (this.map[x + right][y] && this.map[x + right][y] === target) {
                num++;
            }
        }

        return num >= 5;
    }

    check_LR(x, y) {
        let count = 0;
        let left = 0; // 记录向左找的次数
        let right = 0; // 记录向右找的次数
        let target = this.map[x][y];

        let num = 1; // 初始只有一个连子

        while (count < 100) {
            count++;
            if (num >= 5 || (this.map[x - left][y] !== target && this.map[x + right][y] !== target)) {
                break;
            }

            left++;
            if (this.map[x - left][y] && this.map[x - right][y] === target) {
                num++;
            }
            this.map[x - right][y];

            right++;
            if (this.map[x + right][y] && this.map[x + right][y] === target) {
                num++;
            }
        }

        return num >= 5;
    }

    check_RL(x, y) {
        let count = 0;
        let num = 1;
        let lb = 0;
        let rt = 0;
        let target = this.map[x][y];
        while (count < 100) {
            count++;

            lb++;
            if (this.map[x - lb][y + lb] && this.map[x - lb][y + lb] === target) {
                num++;
            }
            rt++;
            if (this.map[x + rt][y - rt] && this.map[x + rt][y - rt] === target) {
                num++;
            }

            if (num >= 5 || (this.map[x + rt][y - rt] !== target && this.map[x - lb][y + lb] !== target)) {
                break;
            }
        }

        return num >= 5;
    }

    check_valid(pos) {
        // 检查当前是否结束游戏
        const x = Math.floor(pos / 15),
            y = Math.floor(pos % 15);
        if (this.check_X(x, y) || this.check_Y(x, y) || this.check_RL(x, y) || this.check_LR(x, y)) return false;
        return true;
    }

    updateGame_size() {
        // 对canvas的大小进行动态调整
        this.dynamic_len = parseInt(
            Math.min(this.parent.clientHeight / (this.cols - 1), this.parent.clientWidth / (this.rows - 1))
        );
        this.L = parseInt(this.dynamic_len * 0.9); // 取长度的0.9
        this.ctx.canvas.width = this.dynamic_len * (this.cols - 1);
        this.ctx.canvas.height = this.dynamic_len * (this.rows - 1);
    }

    update_draw() {
        // 棋盘距离上下各50，左右各40
        for (let i = 0; i < this.rows; i++) {
            this.ctx.moveTo(40, i * this.L + 50);
            this.ctx.lineTo(this.L * (this.cols - 1) + 40, i * this.L + 50);
            this.ctx.stroke();
        }
        for (let i = 0; i < this.cols; i++) {
            this.ctx.moveTo(i * this.L + 40, 50);
            this.ctx.lineTo(i * this.L + 40, this.L * (this.rows - 1) + 50);
            this.ctx.stroke();
        }
    }

    check_ready(player) {
        // 判断当前玩家是否准备好了下一步
        if (player.pos === -1) return false;
        if (player.status !== 'idle') return false;
        return true;
    }

    next_step(player) {
        player.next_step();
    }

    update() {
        this.updateGame_size();
        this.update_draw();

        // 不同时出手
        for (const player of this.players) {
            if (this.check_ready(player)) {
                this.next_step(player);
            }
        }
    }
}
