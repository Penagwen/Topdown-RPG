const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// map width = 2400
// map height = 2400
const map = new Image();
map.onload = () => {
    drawMap();
}
map.src = `RPGmap.png`;

class Camera{
    constructor({position, size}){
        this.position = position;
        this.size = size;
    }
    update(){
        this.position = player.position;
    }
}

class Sprite{
    constructor({position, size, spriteSheet, cropbox, animationName}){
        this.position = position;
        this.size = size;

        this.loaded = false;
        this.frame = 0;

        this.sprite = new Image();
        this.sprite.onload = () => {
            this.loaded = true;
        }
        this.sprite.src = spriteSheet;
        this.loaded = false;

        this.cropbox = cropbox;
        this.animationName = animationName;
        this.direction = "down";
    }
    draw(){
        if(!this.loaded){ return; }

        const animationData = eval(`this.cropbox.${this.animationName}.${this.direction}`);

        c.imageSmoothingEnabled = false;
        //c.drawImage(this.sprite, 50 * this.frame, this.cropbox.position[this.animationName][this.direction].y, 50, 50, canvas.width/2-45, canvas.height/2-50, 95, 100);

        this.nextFrame();
    }
    nextFrame(){
        this.frame = this.frame + 1 > this.cropbox[this.animationName][this.direction].frames ? 0 : this.frame + 1;
    }
}

class Player extends Sprite{
    constructor({position, size, velocity}){
        super({
            position: {
                x: canvas.width/2,
                y: canvas.width/2,
            },
            size: size,
            spriteSheet: "img/sprites/player.png",
            cropbox: {
                idle: {
                    up: {
                        position: {
                            x: 0,
                            y: 200,
                        },
                        frames: 6,
                    },
                    down: {
                        position: {
                            x: 0,
                            y: 0,
                        },
                        frames: 6,
                    },
                    horizontally: {
                        position: {
                            x: 0,
                            y: 100,
                        },
                        frames: 6,
                    },
                },
                running: {
                    up: {
                        position: {
                            x: 0,
                            y: 600,
                        },
                        frames: 6,
                    },
                    down: {
                        position: {
                            x: 0,
                            y: 400,
                        },
                        frames: 6,
                    },
                    horizontally: {
                        position: {
                            x: 0,
                            y: 500,
                        },
                        frames: 6,
                    },
                },
                attack: {
                    up: {
                        position: {
                            x: 0,
                            y: 900,
                        },
                        frames: 4,
                    },
                    down: {
                        position: {
                            x: 0,
                            y: 700,
                        },
                        frames: 4,
                    },
                    horizontally: {
                        position: {
                            x: 0,
                            y: 800,
                        },
                        frames: 4,
                    },
                },
                death: {
                    position: {
                        x: 0,
                        y: 1000,
                    },
                    frames: 3,
                },
            },
            animationName: "idle",
        })
        this.position = position;
        this.size = size;
        this.velocity = velocity;

        this.speed = 3;
    }
    update(){
        this.movement();
        this.draw();
    }
    movement(){
        let halfSpeed = 1;
        if((keys.w.pressed || keys.s.pressed) && (keys.a.pressed || keys.d.pressed)){ halfSpeed = 1.5;}

        if(keys.w.pressed){
            this.velocity.y += this.speed/halfSpeed;
        }
        if(keys.s.pressed){
            this.velocity.y -= this.speed/halfSpeed;
        }
        if(keys.a.pressed){
            this.velocity.x += this.speed/halfSpeed;
        }
        if(keys.d.pressed){
            this.velocity.x -= this.speed/halfSpeed;
        }

        this.position.x -= this.velocity.x;
        this.position.y -= this.velocity.y;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
}

const camera = new Camera({
    position: {
        x: 1200,
        y: 1350,
    },
    size: {
        width: canvas.width/30*16,
        height: canvas.height/30*16,
    },
})

const player = new Player({
    position: {
        x: 1200,
        y: 1200,
    },
    size: {
        width: 16,
        height: 24,
    },
    velocity: {
        x: 0,
        y: 0,
    },
});

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

function Update(){
    requestAnimationFrame(Update);
    drawMap();

    player.update();

    camera.update();

}

// movement
window.onkeydown = (e) => {
    Object.keys(keys).forEach((key) => {
        if(key == e.key.toLowerCase()){
            keys[key].pressed = true;
        }
    })
}

window.onkeyup = (e) => {
    Object.keys(keys).forEach((key) => {
        if(key == e.key.toLowerCase()){
            keys[key].pressed = false;
        }
    })
}


function drawMap(){
    c.imageSmoothingEnabled = false;
    c.drawImage(map, camera.position.x-camera.size.width/2, camera.position.y-camera.size.height/2, camera.size.width, camera.size.height, 0, 0, canvas.width, canvas.height);
}

function Init(){
    Update();
}