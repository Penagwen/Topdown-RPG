class CollisionBlock{
    constructor(position){ 
        this.position = position;
        this.width = canvas.width/30;
        this.height = canvas.height/30;
    }
    draw(){
        c.fillStyle = "rgba(255, 0, 0, 0.5)";
        c.fillRect(this.position.x - camera.position.x, this.position.y - camera.position.y, this.width, this.height);
    }
}



