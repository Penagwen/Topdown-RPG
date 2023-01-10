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
        this.animationBuffer = 0;

        this.sprite = new Image();
        this.sprite.onload = () => {
            this.loaded = true;
        }
        this.sprite.src = spriteSheet;
        this.loaded = false;

        this.cropbox = cropbox;
        this.animationName = animationName;
        this.direction = "down";
        this.flip = false;
        this.completedLoop = 0;
    }
    draw(){
        if(!this.loaded){ return; }

        const animationData = eval(`this.cropbox.${this.animationName}.${this.direction}`);

        c.save();
        c.imageSmoothingEnabled = false;
        if(this.flip){
            c.scale(-1, 1);
            c.drawImage(this.sprite, this.frame * (this.sprite.width/6), animationData.position.y * (this.sprite.height/10), this.sprite.width/6, this.sprite.height/10, -canvas.width/2 - 100, canvas.height/2, 95, 100);
        }else{
            c.drawImage(this.sprite, this.frame * (this.sprite.width/6), animationData.position.y * (this.sprite.height/10), this.sprite.width/6, this.sprite.height/10, canvas.width/2, canvas.height/2, 95, 100);
        }
        c.restore();

        this.nextFrame();
    }
    nextFrame(){
        if(this.animationBuffer > 4){
            this.frame = this.frame + 1 >= this.cropbox[this.animationName][this.direction].frames ? 0 : this.frame + 1;
            this.animationBuffer = 0;
            this.completedLoop ++;
        }else{ this.animationBuffer ++; }

        if(this.completedLoop > 4 && this.attack){
            this.attack = false
            this.completedLoop = 0;
        }
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
                            y: 2,
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
                            y: 1,
                        },
                        frames: 6,
                    },
                },
                running: {
                    up: {
                        position: {
                            x: 0,
                            y: 5,
                        },
                        frames: 6,
                    },
                    down: {
                        position: {
                            x: 0,
                            y: 3,
                        },
                        frames: 6,
                    },
                    horizontally: {
                        position: {
                            x: 0,
                            y: 4,
                        },
                        frames: 6,
                    },
                },
                attack: {
                    up: {
                        position: {
                            x: 0,
                            y: 8,
                        },
                        frames: 4,
                    },
                    down: {
                        position: {
                            x: 0,
                            y: 6,
                        },
                        frames: 4,
                    },
                    horizontally: {
                        position: {
                            x: 0,
                            y: 7,
                        },
                        frames: 4,
                    },
                },
                death: {
                    position: {
                        x: 0,
                        y: 9,
                    },
                    frames: 3,
                },
            },
            animationName: "idle",
        })
        this.position = position;
        this.size = size;
        this.velocity = velocity;

        this.attack = false;
        this.speed = 3;
    }
    update(){
        this.movement();
        this.draw();
    }
    movement(){
        let halfSpeed = 1;
        if((keys.w.pressed || keys.s.pressed) && (keys.a.pressed || keys.d.pressed)){ halfSpeed = 1.5;}

        
        this.animationName = "idle";
        

        if(keys.w.pressed){
            this.velocity.y += this.speed/halfSpeed;
            this.animationName = "running";
            this.direction = "up";
        }
        if(keys.s.pressed){
            this.velocity.y -= this.speed/halfSpeed;
            this.animationName = "running";
            this.direction = "down";
        }
        if(keys.a.pressed){
            this.velocity.x += this.speed/halfSpeed;
            this.animationName = "running";
            this.direction = "horizontally";
            this.flip = true;
        }
        if(keys.d.pressed){
            this.velocity.x -= this.speed/halfSpeed;
            this.animationName = "running";
            this.direction = "horizontally";
            this.flip = false;
        }

        if(this.attack){ this.animationName = "attack" }
        else{
            this.position.x -= this.velocity.x;
            this.position.y -= this.velocity.y;
        }
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
}

const camera = new Camera({
    position: {
        x: 0,
        y: 0,
    },
    size: {
        width: canvas.width/30*16,
        height: canvas.height/30*16,
    },
})

const player = new Player({
    position: {
        x: 1200,
        y: 1350,
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

window.onmousedown = (e) => {
    player.attack = true;
    player.completedLoop = 0;
    player.frame = 0;
}


function drawMap(){
    c.imageSmoothingEnabled = false;
    c.drawImage(map, camera.position.x-camera.size.width/2, camera.position.y-camera.size.height/2, camera.size.width, camera.size.height, 0, 0, canvas.width, canvas.height);
}

function Init(){
    Update();
}