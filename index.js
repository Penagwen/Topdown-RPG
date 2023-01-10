const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// map width = 2400
// map height = 2400
const map = new Image();
map.src = `img/RPGmap.png`;

class Camera{
    constructor(position, size){
        this.position = position;
        this.size = size;
    }
}



c.drawImage(map.src, 100, 100);

c.fillStyle = 'red';
c.fillRect(0, 0, 25, 25);