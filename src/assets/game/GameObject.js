let game_objects = []; // 存储所有的游戏对象

export default class GameObject {
    constructor() {
        game_objects.push(this);
        this.has_called = false;
        this.timedelta = 0; // 得到每两帧之间的时间差
    }

    start() {
        // 开始时执行一次
    }

    update() {
        // 每一帧执行一次
    }

    before_destory() {
        // 对象被销毁前执行
    }

    destroy() {
        // 销毁对象
        // filter函数是对数据中的每一个元素进行检查判断是否保留
        this.before_destory();

        game_objects = game_objects.filter(function (obj) {
            return obj !== this;
        });
    }
}

let last_timestamp; // 记录上一次的时间
let step = (timestamp) => {
    for (const obj of game_objects) {
        if (!obj.has_called) {
            obj.has_called = true;
            obj.start();
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(step);
};

requestAnimationFrame(step);
