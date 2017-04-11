function main(){
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext('2d');
    
    var kl = false;                     // Variable pour les touches
    var ku = false;
    var kr = false;
    var gravity = true;
    var jump = true;
    var char_jump = 0;
    var score = 0;
    var mouse = {x:0, y:0, down:false};

	var gun = {delay: 6, delay_recharge: 125, balles: 30, ballesmax: 30, recharge: false};		// caractèristique de l'arme
    var character = {x:canvas.width/2, y:canvas.height/2, xv:5, yv:0, size:20, jump:200, health:10};       // Elements à créer  
    var shoots = [];
	var speed_norme = 5;		// vitesse des balles
    var mob = [];
	var a = 1500;
    var mob_health = 2;
	var sl= 0;
	var dx = 0;
	var dy = 0;
	var hypo = 0;  // hypoténus 
	
    function create_mob(){
        mob.push( {x: Math.floor((canvas.width-10)*Math.random())+5, y: Math.floor((canvas.height-100)*Math.random())+50, xv:1.5, yv:0, size:15, goRight:1, health:mob_health});
		if(a>1000){
			a-=50;
		}
		timeout = setTimeout(create_mob,a);
    }
	
	create_mob();  						// Les mobs apparaissent de plus en plus vite
	
	var ground = [];
		ground[0] = {x:5, y:canvas.height - 30, w:canvas.width - 10, h:25};							 //ground du bas
		ground[1] = {x:5, y:2*canvas.height/3, w:canvas.width/4, h:25};                              //ground de gauche  
		ground[2] = {x:3*canvas.width/4 - 5, y:2*canvas.height/3, w:canvas.width/4, h:25};           //ground de droite
        ground[3] = {x:canvas.width/3, y:canvas.height/2, h:40, w:canvas.width/3};					 //ground du haut
    
    document.body.onkeydown = key_down;
    document.body.onkeyup = key_up;
    document.body.onmousedown = mouse_down;
    document.body.onmouseup = mouse_up;
    document.body.onmousemove = mouse_move;
    var interval = setInterval(background, 16);
    
    function key_down(ev){             // fonction active à l'appui d'une touche
        switch(ev.keyCode){
            case 81:kl = true;
                break;
            case 90:ku = true;
                break;
            case 68:kr = true;
                break;
			case 82:gun.recharge = true;
        }
        
    }
        
    function key_up(ev){               // fonction active lorsque la touche est relachée
        switch(ev.keyCode){
            case 81:kl = false;
                break;
            case 90:ku = false;
                break;
            case 68:kr = false;
                break;
        }
            
    }
    
    function mouse_down(ev){
        mouse.down = true;
		mouse.x = ev.x;
        mouse.y = ev.y;
    }
    
    function mouse_up(ev){
        mouse.down = false;
    }
    
    function mouse_move(ev){
        mouse.x = ev.x;
        mouse.y = ev.y;
    }
    
	function fshoots(xx,yy){
		sl= shoots.length-1;
		dx = xx - shoots[sl].x;
		dy = shoots[sl].y - yy;
		hypo = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));  // hypoténus 
		shoots[sl].xv = dx/hypo * speed_norme;
		shoots[sl].yv = dy/hypo * speed_norme;
	} 
        
    function background(){
        
        if (mouse.down && gun.delay >= 6 && gun.recharge == false){
			shoots.push( {x: character.x + character.size/2, y: character.y + character.size/2, xv: 0, yv: 0, size: 2}) ;
			fshoots(mouse.x, mouse.y);
			gun.delay = 0;
			gun.balles --;
			gun.delay_recharge -= 125/gun.ballesmax;
			if (gun.balles == 0) gun.recharge = true;
		}

		if (gun.delay < 6) gun.delay++;
		if (gun.delay_recharge < 125 && gun.recharge){
			gun.delay_recharge ++;
		}
		if (gun.delay_recharge >= 125){
			gun.balles = gun.ballesmax;
			gun.recharge = false;
		}

			
		for(var s =0; s <= shoots.length-1; s++){
			shoots[s].x += shoots[s].xv;
			shoots[s].y -= shoots[s].yv;
            
            for(var g=0; g <= ground.length -1; g++){
                if(shoots[s].x + shoots[s].size >= ground[g].x && shoots[s].x <= ground[g].x + ground[g].w && shoots[s].y + shoots[s].size >= ground[g].y && shoots[s].y <= ground[g].y + ground[g].h || shoots[s].y > canvas.height || shoots[s].y < 0 || shoots[s].x > canvas.width || shoots[s].x < 0){
                    shoots.splice(s,1);
                }
            }
                    
            for(var m=0; m <= mob.length -1; m++){
                if(shoots[s].x + shoots[s].size >= mob[m].x && shoots[s].x <= mob[m].x + mob[m].size && shoots[s].y + shoots[s].size >= mob[m].y && shoots[s].y <= mob[m].y + mob[m].size){
                    mob[m].health--;
                    shoots.splice(s,1);
                    if(mob[m].health <= 0){
                        mob.splice(m,1);
                        score++;
                    }
                }
            }
        }
		
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.beginPath();                                                   // Dessin des éléments
        ctx.font="20px Arial";
        ctx.fillText("Score: " + score, 10, 40);
        ctx.rect(character.x, character.y, character.size, character.size);
        var grd = ctx.createLinearGradient(0, 0, 160, 0);
        
        ctx.fillStyle="#cca300";
		ctx.fillRect(character.x + character.size + 10, character.y + character.size +10, -gun.delay_recharge*(character.size + 20)/125, 3.5);
        
        if(character.health >=7){
            ctx.fillStyle = "#00cc00";
        } else if(character.health >= 4){
            ctx.fillStyle = "orange";
        } else {
            ctx.fillStyle = "red";
        }
        
        ctx.fillRect(character.x + character.size + 10, character.y + character.size - 30, - character.health*(character.size + 20)/10, -5);
        ctx.fillStyle = "white";
		for(var m=0; m <= mob.length - 1; m++){
            ctx.rect(mob[m].x, mob[m].y, mob[m].size, mob[m].size);
        }
		for(var i=0; i <= ground.length - 1; i++){
            ctx.rect(ground[i].x,ground[i].y, ground[i].w, ground[i].h);
        }
		for(var s=0; s <= shoots.length - 1; s++){
			ctx.rect(shoots[s].x, shoots[s].y, shoots[s].size, shoots[s].size);
        }
        ctx.stroke();

        if(kl){    		                                            // Elements du déplacement du joueur
            character.x -= character.xv;
        } else if(kr){
            character.x += character.xv;
        }

        if(ku && jump){                                             // Elements pour le saut
            char_jump = character.y - character.jump;               // Si la touche et l'option sont activés alors le saut a lieu
            gravity = false;
            jump = false;
        }

        if(character.y > char_jump && !gravity){                    // Permet de pouvoir relacher la touche HAUT sans arrêter le saut
            character.yv += 9.81/100;
            character.y -= 7 - character.yv;
        } else {
            if(!gravity){
                character.yv = 0;
            }
            gravity = true;
        }

        if(!ku && jump){
            character.yv = 0;
        }


        if(character.x <= 0){                               // Retour du joueur de l'autre coté du canva
            character.x = canvas.width;
        } else if(character.x >= canvas.width){
            character.x = 0;
        } 

        if(character.y < ground[0].y - character.size && gravity){                     // Creation des éléments solides
            character.yv += 9.81/100;
            character.y += character.yv;
            jump = false;
        }
        for(var i=0; i <= ground.length - 1; i++){
            if(character.x >= ground[i].x - character.size && character.x <= ground[i].x + ground[i].w){
                if(character.y >= ground[i].y - character.size && character.y < ground[i].y){
                    character.y = ground[i].y - character.size;
                    jump = true;
                    character.yv = 0;
                } else if(character.y <= ground[i].y + ground[i].h && character.y > ground[i].y){
                    character.y = ground[i].y + ground[i].h;
                    char_jump = ground[i].y + ground[i].h;
                }
            }
        }
        
        for( var m=0; m <= mob.length - 1; m++){
			for( var i=0; i <= ground.length -1; i++){						// Gravité pour les mobs
				if(mob[m].x >= ground[i].x - mob[m].size && mob[m].x <= ground[i].x + ground[i].w && mob[m].y >= ground[i].y - mob[m].size && mob[m].y < ground[i].y){
					mob[m].y = ground[i].y - mob[m].size;
					mob[m].yv=0;					
				}
				else {
					mob[m].yv += 9.81/500;
					mob[m].y += mob[m].yv;
				}

				if (mob[m].x >= ground[i].x - mob[m].size && mob[m].x <= ground[i].x + ground[i].w && mob[m].y == ground[i].y - mob[m].size){		// Détecte sur quel plateau est le mob
					if (character.x >= ground[i].x - character.size && character.x <= ground[i].x + ground[i].w && character.y <= ground[i].y - character.size && character.y >= ground[i].y - character.size - 200){     // Détecte sur quel plateau est le joueur
						if(character.x - mob[m].x > 0){
							mob[m].goRight = 2;
						}
						else{
							mob[m].goRight = -2;
						}
					}
					
					else if (ground[i].x + ground[i].w - mob[m].x < mob[m].size) {			// Mob va à droite
						mob[m].goRight = -1;
					}
					else if (ground[i].x + mob[m].xv > mob[m].x) {							// Mob va à gauche
						mob[m].goRight = 1;
					}
					if (mob[m].goRight == 1){
						mob[m].x += mob[m].xv;
					}
					else if(mob[m].goRight == -1){
						mob[m].x -= mob[m].xv;
					}
					else if(mob[m].goRight == 2){
						mob[m].x += 2*mob[m].xv;
					}
					else if(mob[m].goRight == -2){
						mob[m].x -= 2*mob[m].xv;
					}
				}
			}
			
			
			
			
            if(character.x + character.size >= mob[m].x && character.x <= mob[m].x + mob[m].size){					// Interaction
                if(character.y + character.size > mob[m].y && character.y < mob[m].y + mob[m].size){
                    character.health--;
                    mob[m].health--;
                    if(mob[m].health <= 0){
                        mob.splice(m,1);
                    }
                }
            }
			if(mob[m].y > canvas.height){					// Si un mob tombe dans le vide il disparait
				mob.splice(m,1);
			}
		}
		
		if( mob.length > 10){								// Fin de jeu
			alert("GAME OVER! There are more than 10 square. Let's refresh! ");
			clearInterval(interval);
			clearTimeout(timeout);
		} else if(character.health <= 0){
            alert("GAME OVER!");
            clearInterval(interval);
            clearTimeout(timeout);
        }
    }
}