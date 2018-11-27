var targetElement = false;

$(function(){

	$("#button_play").on("mousedown touchstart",function(e){
		e.preventDefault();
		iosInit();
		playPause();
		if(play){
			$(this).html("Pause");
		} else {
			$(this).html("Play");
		}
	});

	var rad = 25+4;//width + border-width of xycontrollers
	
	function setInfo(id,el){
		if(id=="xyAttRel"){
			$("#xyInfo").html(
				"Attack: "+Math.round(el.relX*4990+10)+"ms<br>Release: "+Math.round((1-el.relY)*4990+10)+"ms"
			);
		} else if(id=="xyOctTra"){
			$("#xyInfo").html(
				"Transpose: +"+(5-Math.floor((1-el.relX)*5))+"<br>Spread: "+(Math.floor((1-$("#xyOctTra")[0].relY)*5)+1)
			);
		} else if(id=="xyDetDyn"){
			$("#xyInfo").html(
				"Detune: "+Math.floor(el.relX*100)+"%<br>Dynamics: "+Math.floor(100-el.relY*100)+"%"
			);
		} else if(id=="xyTemSca"){
			var scaleVal = 1-el.relY;
			var scale;
			if(scaleVal <= 0.25){
				scale = "Minor triad";
			} else if(scaleVal <= 0.5){
				scale = "Pentatonic";
			} else if(scaleVal <= 0.75){
				scale = "Minor scale";
			} else {
				scale = "Chromatic";
			}
		
			$("#xyInfo").html(
				"Tempo: "+Math.round((el.relX*300+20)/0.6)+"bps<br>Scale: "+scale
			);
		}
		
	}
	
	

	$("#xyInfo").hide();
	
	$("#xyDetDyn")[0].relX = 0;
	$("#xyDetDyn")[0].relY = 1;
	
	$("#xyOctTra")[0].relX = 0.3;
	$("#xyOctTra")[0].relY = 0.5;
	
	$("#xyAttRel")[0].relX = 0.1;
	$("#xyAttRel")[0].relY = 0.5;
	
	$("#xyTemSca")[0].relX = 0.5;
	$("#xyTemSca")[0].relY = 1;
	
	$(".xycontroller").each(function(){//init parameters
		var that = this;
		this.inMotion = false;
		
		this.width = rad*2;
		this.height = rad*2;
		this.x = that.relX*(window.innerWidth-rad*2);
		this.y = that.relY*(window.innerHeight-rad*2);
		this.velX = 0;
		this.velY = 0;
		this.lastRelX = this.relX;
		this.lastRelY = this.relY;
		$(this).css("left",that.relX*(window.innerWidth-rad*2)+"px");
		$(this).css("top",that.relY*(window.innerHeight-rad*2)+"px");
	});
	
	$(document).on("mousemove touchmove",function(e){
	
		e.preventDefault();
		if(targetElement){
		
			setInfo($(targetElement)[0].id,targetElement);
		
			targetElement.lastRelX = targetElement.relX;
			targetElement.lastRelY = targetElement.relY;
		
			var x;
			var y;
			
			if(e.pageX){
				x = e.pageX-rad;
				y = e.pageY-rad;
			} else if(e.originalEvent.touches) {
				x = e.originalEvent.touches[0].pageX-rad;
				y = e.originalEvent.touches[0].pageY-rad;
			} else {return;}
			
			x = Math.max(0,Math.min(x,window.innerWidth-rad*2));
			y = Math.max(0,Math.min(y,window.innerHeight-rad*2));
			
			var relX = x/(window.innerWidth-rad*2);
			var relY = y/(window.innerHeight-rad*2);
			
			targetElement.relX = relX;
			targetElement.relY = relY;
			
			targetElement.posX = x;
			targetElement.posY = y;
			
			targetElement.x = targetElement.relX*(window.innerWidth-rad*2);
			targetElement.y = targetElement.relY*(window.innerHeight-rad*2);
			
			targetElement.style.left = x+"px";
			targetElement.style.top = y+"px";
		}
	});
	
	$(document).on("mouseup touchend",function(e){
		var dX = targetElement.lastRelX-targetElement.relX;//relative change in X
		var dY = targetElement.lastRelY-targetElement.relY;//relative change in Y
		var tX = dX*window.innerWidth;//absolute change in X
		var tY = dY*window.innerHeight;
		
		var len = Math.sqrt(tX*tX+tY*tY);//calculate vector length
		
		if(len>5){
			targetElement.inMotion = true;
			targetElement.velX = -dX*0.02;
			targetElement.velY = -dY*0.02;
			$(targetElement).addClass("inMotion");
		} else {
			targetElement.inMotion = false;
			$(targetElement).removeClass("inMotion");
		}
		
		e.preventDefault();
		$(targetElement).removeClass("shiny");
		targetElement = false;
		$("#xyInfo").slideUp("slow");
		
	});
	
	$(".xycontroller").on("mousedown touchstart",function(e){
		e.preventDefault();
		targetElement = this;
		
		this.inMotion = false;
		$(this).addClass("shiny");
		$(targetElement).addClass("inMotion");
		
		
		setInfo($(targetElement)[0].id,this);
		$("#xyInfo").slideDown("fast");
	});
	
	$( window ).resize(function() {
		//make sure all items are in boundaries
		$(".xycontroller").each(function(){
			var that = this;
			$(this).css("left",that.relX*(window.innerWidth-rad*2)+"px");
			$(this).css("top",that.relY*(window.innerHeight-rad*2)+"px");
		});
	});
	
	function DOMloop(){
		$(".xycontroller").each(function(){
			this.collided = false;
			if(this.inMotion){
				var that = this;
				this.relX += this.velX;
				this.relY += this.velY;
				
				this.lastRelX = this.relX;
				this.lastRelY = this.relY;
				
				var bouncy = 1;//does motion slow when colliding?
				
				if(this.relX>=1){
					this.relX=1;
					this.velX*=-bouncy;
				}
				if(this.relY>=1){
					this.relY=1;
					this.velY*=-bouncy;
				}
				if(this.relX<0){
					this.relX=0;
					this.velX*=-bouncy;
				}
				if(this.relY<0){
					this.relY=0;
					this.velY*=-bouncy;
				}
				
				this.x = that.relX*(window.innerWidth-rad*2);
				this.y = that.relY*(window.innerHeight-rad*2);
				
				$(this).css("left",that.relX*(window.innerWidth-rad*2)+"px");
				$(this).css("top",that.relY*(window.innerHeight-rad*2)+"px");
				
				$(".xycontroller").each(function(){
					if(that.id != this.id && !this.collided && !that.collided && that.inMotion && this.inMotion){
						var col = rectsCollide(that,this);
						if(col){
							var THAT = this;//the another rect, that refers to the rect in questions
							if(col==="top"){
								var temp = that.velY;
								that.velY = THAT.velY;
								THAT.velY = temp;
								that.y = THAT.relY*(window.innerHeight-rad*2)+that.height;
								$(that).css("top",that.y+"px");
							} else if(col==="bottom"){
								var temp = that.velY;
								that.velY = THAT.velY;
								THAT.velY = temp;
								that.y = THAT.relY*(window.innerHeight-rad*2)-that.height;
								$(that).css("top",that.y+"px");
							} else if(col==="left"){
								var temp = that.velX;
								that.velX = THAT.velX;
								THAT.velX = temp;
								that.x = THAT.relX*(window.innerWidth-rad*2)+THAT.width;
								$(that).css("left",that.x+"px");
							} else if(col==="right"){
								var temp = that.velX;
								that.velX = THAT.velX;
								THAT.velX = temp;
								that.x = THAT.relX*(window.innerWidth-rad*2)-that.width;
								$(that).css("left",that.x+"px");
							} 
							THAT.collided = true;
							that.collided = true;	
						}
					}
				});
				
			}
		});
	}
	
	
	
	setInterval(DOMloop,25);
	initSounds();
	viewLoop();
});
