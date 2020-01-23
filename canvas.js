window.onload = draw;

function draw(){
   var canvas = document.getElementById("mycanvas");
   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight;
   
   particles.init(canvas);
   canvas.onmousemove = particles.mouseHandler.bind(particles);
   canvas.onmouseleave = particles.mouseHandler.bind(particles, {clientX:-100, clientY:-100});
}


var particles = {
  canvasEl:null,
  width:0,
  height:0,
  particles:[],
  maxParticles:150,
  mouseX: -100,
  mouseY: -100,
  init:function(canvasEl){
    this.canvasEl = canvasEl;
    this.width = this.canvasEl.width;
    this.height = this.canvasEl.height;
    this.ctx = this.canvasEl.getContext("2d");

    this.mountParticles();
  },
  mountParticles:function(){
    for(var i = 0; i < this.maxParticles; i++){
      var initialX = Math.random()*this.width;
      var initialY = Math.random()*this.height;
      var speedX = Math.random()*2*Math.pow(-1, Math.floor(Math.random()*10));
      var speedY = Math.random()*2*Math.pow(-1, Math.floor(Math.random()*10));
      this.particles[i] = new Particle(this.ctx, initialX, initialY, speedX, speedY);
    }
    this.moveParticles();
  },
  moveParticles:function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.particles.forEach(function(p){
      p.move();
    });

    this.raf = window.requestAnimationFrame(this.moveParticles.bind(this));
  },
  mouseHandler:function(e){
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }
}

function Particle(ctx, x, y, vX, vY){
  this.radius = 1;
  this.ctx = ctx;
  this.x = x;
  this.y = y;
  this.vX = vX;
  this.vY = vY;
  this.draw();
}
Particle.prototype = particles;
Particle.prototype.draw = function(){
  this.ctx.save();
    var radius = this.radius;
    var distanceToMouse = Math.sqrt(Math.pow(this.mouseX-this.x, 2) + Math.pow(this.mouseY-this.y, 2));
    if(distanceToMouse < 100){
      this.drawLine(distanceToMouse);
      radius*=3;
    }
    
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, radius, 0, Math.PI*2);
    this.ctx.closePath();
    this.ctx.fillStyle = "#fff";
    this.ctx.fill();
    
  this.ctx.restore();
}
Particle.prototype.drawLine = function(distanceToMouse){
  this.ctx.beginPath();
  this.ctx.moveTo(this.x, this.y);
  this.ctx.lineTo(this.mouseX, this.mouseY);
  this.ctx.closePath();
  this.ctx.strokeStyle = "rgba(255, 255, 255, "+(1-(distanceToMouse/100)).toFixed(1)+")";
  this.ctx.stroke();
}
Particle.prototype.move = function(){
  this.x+=this.vX;
  if(this.x > this.width) {this.x = 0;}
  if(this.x < 0) {this.x = this.width;}

  this.y+=this.vY;
  if(this.y > this.height) {this.y = 0;}
  if(this.y < 0) {this.y = this.height;}

  this.draw();
}
