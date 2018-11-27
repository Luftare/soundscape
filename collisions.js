function rectsCollide(re,R){

	if(re.x+re.width>R.x
	&& re.y+re.height > R.y
	&& re.y < R.y+R.height
	&& re.x < R.x+R.width){//is colliding, now determining which side of the first rect is hitting
		var dR = re.x + re.width - R.x;
		var dL = R.x + R.width - re.x;
		var dT = R.y + R.height - re.y;
		var dB = re.y + re.height - R.y;
		if(dR<dL&&dR<dT&&dR<dB){
			return "right";
		}
		if(dL<dR&&dL<dT&&dL<dB){
			return "left";
		}
		if(dT<dR&&dT<dL&&dT<dB){
			return "top";
		}
		if(dB<dR&&dB<dL&&dB<dT){
			return "bottom";
		}
		return true;
	}
}




/*
var PI = Math.PI;

function toRadians(deg) {
    return deg * Math.PI / 180;
}

function toAngle(rad) {
	return rad*180/Math.PI;
}

function lineIntersectingRect(ls,le,r){//vectors ls = line start, le = line end, r = rect with properties: x,y,width,height
	var lt = {x:r.x,y:r.y};//left top ...
	var rt = {x:r.x+r.width,y:r.y};
	var lb = {x:r.x,y:r.y+r.height};
	var rb = {x:r.x+r.width,y:r.y+r.height};//... right bottom
	if(
	linesIntersecting(ls,le,lt,rt) 
	|| linesIntersecting(ls,le,rt,rb) 
	|| linesIntersecting(ls,le,lb,rb)
	|| linesIntersecting(ls,le,lb,lt)
	){
		return true;
	} else {
		return false;
	}
}

function linesIntersecting(s1,e1,s2,e2) {
	var p0_x = s1.x;
	var p0_y = s1.y;
	var p1_x = e1.x;
	var p1_y = e1.y;
	var p2_x = s2.x;
	var p2_y = s2.y;
	var p3_x = e2.x;
	var p3_y = e2.y;
 
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;
    s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;
    s2_y = p3_y - p2_y;
 
    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
 
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return true;
    }
 
    return false; // No collision
}

function rectCircleColliding(rect,circle){//var rect={x:100,y:100,width:40,height:100}; var circle={x:100,y:290,r:10};
    var distX = Math.abs(circle.x - rect.x-rect.width/2);
    var distY = Math.abs(circle.y - rect.y-rect.height/2);

    if (distX > (rect.width/2 + circle.r)) { return false;}
    if (distY > (rect.height/2 + circle.r)) { return false;}

    if (distX <= (rect.width/2)) {return true;} 
    if (distY <= (rect.height/2)) {return true;}

    var dx=distX-rect.width/2;
    var dy=distY-rect.height/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}

function rectsColliding(re,R){
	if(re.position){
		re.x = re.position.x;
		re.y = re.position.y;
	}
	if(R.position){
		R.x = R.position.x;
		R.y = R.position.y;
	}

	if(re.x+re.width>R.x
	&& re.y+re.height > R.y
	&& re.y < R.y+R.height
	&& re.x < R.x+R.width){//is colliding, now determining which side of the first rect is hitting
		var dR = re.x + re.width - R.x;
		var dL = R.x + R.width - re.x;
		var dT = R.y + R.height - re.y;
		var dB = re.y + re.height - R.y;
		if(dR<dL&&dR<dT&&dR<dB){
			return "right";
		}
		if(dL<dR&&dL<dT&&dL<dB){
			return "left";
		}
		if(dT<dR&&dT<dL&&dT<dB){
			return "top";
		}
		if(dB<dR&&dB<dL&&dB<dT){
			return "bottom";
		}
		return true;
	}
}

function pointInRect(p,R){//is point p inside rect R
	if(p.x>R.x
	&& p.x<R.x+R.width
	&& p.y>R.y
	&& p.y<R.y+R.height){
		return true;
	} else {
		return false;
	}
}

function pointCircleColliding(p,c){//var point = {x: 4,y: 200}; var circle = {x:2,y:66,r:150};
	if(pointDistance(p,c)<=c.r){
		return true;
	} else {
		return false;
	}
}

function circlesColliding(a,b){
	var dist = pointDistance(a,b);
	if(dist<= a.r+b.r){
		return a.r+b.r-dist;
	} else {
		return false;
	}
}

function sqr(a){
	return a*a;
}

function pointDistance(a,b){
	if(a.x==b.x && a.y == b.y){
		return 0;
	} else {
		return Math.sqrt(sqr(a.x-b.x)+sqr(a.y-b.y));
	}
}
*/