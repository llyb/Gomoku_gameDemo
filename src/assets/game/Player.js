import GameObject from './GameObject';

export default class Player extends GameObject {
    constructor(info, gamemap) {
        super();
        this.id = info.id;
        this.color = info.color;
        this.gamemap = gamemap;
        this.pos = -1; // 表示落子的位置,-1表示没有移动
        this.status = 'idle'; // idle表示没有进行移动，die表示死亡
        this.cells = []; // 用于记录当前的操作
    }

    set_position(x) {
        this.pos = x;
    }

    next_step() {
        this.cells.push(this.pos);

        if (!this.gamemap.check_valid(this.pos)) {
            this.status = 'die';
            alert(`游戏结束：${this.color}颜色获胜`);
        }

        this.pos = -1; // 清空操作
    }

    start() {}

    render() {
        let col = '#fff'; // 默认是白色
        if (this.color === 'black') {
            col = '#000';
        }
        const L = this.gamemap.L;
        for (let i = 0; i < this.cells.length; i++) {
            let x = Math.floor(this.cells[i] / 15);
            let y = Math.floor(this.cells[i] % 15);
            this.gamemap.ctx.beginPath();
            this.gamemap.ctx.arc(40 + x * L, 50 + y * L, L / 2 - 2, 0, 2 * Math.PI);
            this.gamemap.ctx.fillStyle = col;
            this.gamemap.ctx.fill();
            this.gamemap.ctx.closePath();
        }
    }

    update() {
        this.render();
    }
}
