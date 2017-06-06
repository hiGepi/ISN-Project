function main(){
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext('2d');
    
    var kl = false;                     // Variable pour les touches
    var ku = false;
    var kr = false;
    var esc = false;
    var gravity = true;
    var jump = true;
    var char_jump = 0;
    var score = 0;
    var mouse = {x:0, y:0, down:false};
	var gun = {delay: 6, delay_recharge: 125, balles: 30, ballesmax: 30, recharge: false, speed_norme: 5};		// caractèristique de l'arme
	var boss_gun = {delay: 6, delay_recharge: 125, balles: 12, ballesmax: 12, recharge: false, speed_norme: 8};
    var character = [];
	character[0]={x:canvas.width/2, y:canvas.height/2, xv:5, yv:0, w:15, h:26, jump:200, health:10};       // Elements à créer  
    var shoots = [];
	var boss_shoots = [];
    var mob = [];
    var mob_hp;
    var mob_v;
    var mob_w;
    var mob_h;
    var boss_w = 50;
    var boss_h = 50;
    var mob_dmg;
	var boss = [];
    var a = 1500;
    var tps = 0;
    var timemob = 0;
    var timebonus = 8000;
    var bonus = [];
	var sl= 0;
	var dx = 0;
	var dy = 0;
	var hypo = 0;  // hypoténus *
	var pop = true;
	var popb = true;
	var stage_one = true;
	var stage_two = true;
	var coef_one = 1;
	var coef_two = 1;
    var pause = true;        
    var play = true;
    
    var img_menu = new Image();                             //Design Zied
    img_menu.src = 'menu.png';
    var img_ground = new Image();
    img_ground.src = 'plat.png';
    var img_heal = new Image();
    img_heal.src = 'heal.png';
    var img_mob_easy = new Image();
    img_mob_easy.src = 'mob_easy.png';
    var img_mob_mid = new Image();
    img_mob_mid.src = 'mob_mid.png';
    var img_mob_insane = new Image();
    img_mob_insane.src = 'mob_insane.png';
    var img_boss_right = new Image();
    img_boss_right.src = 'boss_right.png';
    var img_boss_left = new Image();
    img_boss_left.src = 'boss_left.png';
    var img_char_right = new Image();
    img_char_right.src = 'char_right.png';
    var img_char_left = new Image();
    img_char_left.src = 'char_left.png';
    
    var img_boss = img_boss_left;
    var img_char = img_char_right;
    var img_mob;
    var interval_draw;
    var interval_pause;
    var interval_start = setInterval(start, 16);
	var bloc = 5;
    
	var ground = [];
		ground[0] = [];
        ground[0].push({x:5, y:canvas.height - 30, w:canvas.width - 10, h:25, v:100});							 //ground du bas      
		ground[1] = [];                                                                                          // ground, tableaux bidimensionnels Saša
        for(var i = 0; i < canvas.width/20; i++){
            for(var m = 0; m < 5; m++){
                ground[1].push({x:5+i*bloc, y:2.5*canvas.height/3.9 + m*bloc, w:bloc, h:bloc,v:3, img:img_ground});
            }
        }              //ground de gauche  
		ground[2] = [];
        for(var i = 0; i <= canvas.width/20; i++){
            for(m = 0; m < 5; m++){
                ground[2].push({x: canvas.width -10 - canvas.width/4 + i*bloc, y:2.5*canvas.height/3.9 + m*bloc, w:bloc, h:bloc,v:3, img:img_ground});           //ground de droite
            }
        }
        ground[3] = [];					 //ground du haut
        for(var i = 0; i <= canvas.width/15.5; i++){
            for(var m = 0; m < 7; m++){
                ground[3].push({x:canvas.width/3 + i*bloc,y: 2*canvas.height/5 + m*bloc,w:bloc,h:bloc,v:2});
            }
        }
    document.body.onkeydown = key_down;                     //evenements clavier Saša
    document.body.onkeyup = key_up;
    document.body.onmousedown = mouse_down;
    document.body.onmouseup = mouse_up;
    document.body.onmousemove = mouse_move;

    function start(){                                           //Menu Daniel
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img_menu,0,0);
        ctx.beginPath();
        ctx.rect(canvas.width/3, canvas.height/5 - 30, canvas.width/3, canvas.height/6);
        ctx.rect(canvas.width/3, 2*canvas.height/5 , canvas.width/3, canvas.height/6);
        ctx.rect(canvas.width/3, 3*canvas.height/5 + 30, canvas.width/3, canvas.height/6);
        ctx.textAlign='center';
        ctx.fillText("EASY",canvas.width/2, canvas.height/5 - 30 + canvas.height/12 + 10);
        ctx.fillText("MEDIUM", canvas.width/2, 2*canvas.height/5 + canvas.height/12 + 10);
        ctx.fillText("INSANE", canvas.width/2, 3*canvas.height/5 + 30 + canvas.height/12 + 10);
        ctx.stroke();
        ctx.textAlign='start';
        
        if(mouse.x > canvas.width/3 && mouse.x < 2*canvas.width/3 && mouse.down){
            mouse.press = false;
            if(mouse.y > canvas.height/5 - 30 && mouse.y < canvas.height/5 - 30 + canvas.height/6){
                mob_hp = 2;
                mob_v = 1;
                mob_w = 11;
                mob_h = 20;
                mob_dmg = 1;
                img_mob = img_mob_easy;                
                interval_draw = setInterval(background, 16);
                interval_pause = setInterval(game_pause, 16);
                clearInterval(interval_start);
            } else if(mouse.y > 2*canvas.height/5 && mouse.y < 2*canvas.height/5 + canvas.height/6){
                mob_hp = 3;
                mob_v = 1.5;
                mob_w = 11;
                mob_h = 17;
                mob_dmg = 3;
                img_mob = img_mob_mid;
                interval_draw = setInterval(background, 16);
                interval_pause = setInterval(game_pause, 16);
                clearInterval(interval_start);
            } else if(mouse.y > 3*canvas.height/5 + 30 && mouse.y < 3*canvas.height/5 + 30 + canvas.height/6){
                mob_hp = 5;
                mob_v = 2;
                mob_w = 11;
                mob_h = 15;
                mob_dmg = 5;
                img_mob = img_mob_insane;
                interval_draw = setInterval(background, 16);
                interval_pause = setInterval(game_pause, 16);
                clearInterval(interval_start);
            }
        }  
    }
    
    function game_pause(){
        if(esc && pause && play){
            clearInterval(interval_draw);
            clearInterval(interval_back);
            console.log(interval_draw);
            play = false;
            pause = false;
        } else if(!esc && !pause && !play){
            play = true;
        } else if(esc && !pause && play){
            var interval_back = setInterval(background, 16);
            pause = true;
            play = false;
        } else if(!esc && pause && !play){
            play = true;
        }
    }

    function key_down(ev){             // fonction active à l'appui d'une touche
        switch(ev.keyCode){            // ev clavier Saša
            case 81:kl = true;
                img_char = img_char_left;
                break;
            case 90:ku = true;
                break;
            case 68:kr = true;
                img_char = img_char_right;
                break;
			case 82:gun.recharge = true;
                break;
            case 27:esc = true;
                break;
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
            case 27:esc = false;
                break;
        }
            
    }
    
    function mouse_down(ev){
        mouse.down = 1;
    }
    
    function mouse_up(ev){              //Souris Saša
        mouse.down = 0;
    }
    
    function mouse_move(ev){
	mouse.x = ev.clientX - canvas.offsetLeft + document.body.scrollLeft;   //Merci M George
        mouse.y = ev.clientY - canvas.offsetTop + document.body.scrollTop;
    }
    
	function fshoots(whos_shoots,xx,yy, arme){
		sl= whos_shoots.length-1;
		dx = xx - whos_shoots[sl].x;
		dy = whos_shoots[sl].y - yy;
		hypo = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));  // hypoténus         Kévin
		whos_shoots[sl].xv = dx/hypo * arme.speed_norme;
		whos_shoots[sl].yv = dy/hypo * arme.speed_norme;
	} 
        
    function background(){
		tps = tps + 16;
		if(tps > timemob){
			timemob += a;
			if(pop){
				mob.push( {x: Math.floor((canvas.width-10)*Math.random())+5, y: Math.floor((canvas.height-100)*Math.random())+50, xv:mob_v, yv:0, w:mob_w, h:mob_h , goRight:0, health:mob_hp, dmg:mob_dmg, point:1, img:img_mob});
				if(a>1000)a-=50;        //Kévin
			}

			if(score >= 10 * coef_one){
				for( var i = 0; i < 10; i++){
					mob.push({x: Math.floor((canvas.width-10)*Math.random())+5, y: Math.floor((canvas.height-200)*Math.random())+100, xv:mob_v, yv:0, w:mob_w, h:mob_h, goRight:0, health:mob_hp, dmg:mob_dmg, point:1, img:img_mob});
					coef_one++;
					pop = false;
				}
			}
			else if(score >= 20 * coef_two){
				boss.push({x: Math.floor((canvas.width-10)*Math.random())+5, y: Math.floor((canvas.height-100)*Math.random())+50, xv:1.75, yv:0, w:boss_w, h:boss_h, goRight:0, health:25, dmg:2.5, point:5, img:img_boss, boss:true});
				pop = false;	       
				coef_two++;
			}
			else if(mob.length < 1 && boss.length < 1){
				pop = true;
                
                for(g = 1; g <= ground.length-1; g++){                  // Zied
                    ground[g].splice(0,ground[g].length);
                }
                var gx = Math.floor(Math.random()*(canvas.width/2-150));
                var gy = Math.floor(Math.random()*(50));
                for(var i = 0; i <= 29; i++){
                    for(var m = 0; m <= 4; m++){
                        ground[1].push({x:gx+i*bloc, y:(3*canvas.height/4)-gy + m*bloc, w:bloc, h:bloc,v:3, img:img_ground});
                        ground[2].push({x:(3*canvas.width/4) - gx +i*bloc, y:(3*canvas.height/4) - gy + m*bloc, w:bloc, h:bloc, v:3, img:img_ground});   //Spawn de 4 plateformes aléatoires.
                    }
                }
                gx = Math.floor(Math.random()*(canvas.width-200));
                gy = Math.floor(Math.random()*50);
                for(var i = 0; i <= 39; i++){
                    for(var m = 0; m <= 7; m++){
                        ground[3].push({x:gx + i*bloc,y:canvas.height/2 - gy + m*bloc,w:bloc,h:bloc,v:2, img:img_ground});   //Zied
                    }
                }
			}
		}
		else if(tps > timebonus && popb){
			timebonus += 8000;
			bonus.push( {x: Math.floor((canvas.width-10)*Math.random())+5, y: Math.floor((canvas.height-100)*Math.random())+50, size:9, yv:0, img:img_heal});  //Kévin
		}

		
		fshoots_(mouse.down, gun, shoots, character, mouse, 2);
		fshoots_(boss.length, boss_gun, boss_shoots, boss, character[0], 2);
		

        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.beginPath();                                                   // Dessin des éléments Saša
        ctx.font="20px Arial";
        ctx.fillText("Score: " + score, 10, 40);
        ctx.drawImage(img_char, character[0].x, character[0].y);
        var grd = ctx.createLinearGradient(0, 0, 160, 0);
        ctx.fillStyle="#cca300";
		ctx.fillRect(character[0].x + character[0].w + 10, character[0].y + character[0].w +10, -gun.delay_recharge*(character[0].h + 20)/125, 3.5);
        
        if(character[0].health >=7){
            ctx.fillStyle = "#00cc00";
        } else if(character[0].health >= 4){
            ctx.fillStyle = "orange";
        } else {
            ctx.fillStyle = "red";
        }
        
        ctx.fillRect(character[0].x + character[0].w + 10, character[0].y + character[0].w - 30, - character[0].health*(character[0].h + 20)/10, -5);
        ctx.fillStyle = "white";
		
		draw(mob);
		draw(bonus);    //function draw Kévin
		draw_s(shoots);
		draw_s(boss_shoots);
		draw(boss);
        
        ctx.rect(ground[0][0].x, ground[0][0].y, ground[0][0].w, ground[0][0].h);
        for(var i=1; i < ground.length; i++){
            for(var l=0; l < ground[i].length; l++){
                if(ground[i][l].v > 0){
                    ctx.drawImage(img_ground, ground[i][l].x, ground[i][l].y);
                } else {
                    ground[i].splice(l,1);                                                  //Saša
                }
            }
        }
        ctx.stroke();
		
        if(kl){    		                                            // Elements du déplacement du joueur. Saša
            character[0].x -= character[0].xv;
        } else if(kr){
            character[0].x += character[0].xv;
        }
		
        if(ku && jump){                                             // Elements pour le saut
            char_jump = character[0].y - character[0].jump;               // Si la touche et l'option sont activés alors le saut a lieu
            gravity = false;
            jump = false;                                           //Gravité et saut. 
        }

        if(character[0].y > char_jump && !gravity){                    // Permet de pouvoir relacher la touche HAUT sans arrêter le saut
            character[0].yv += 9.81/100;
            character[0].y -= 7 - character[0].yv;
        } else {
            if(!gravity){
                character[0].yv = 0;
            }
            gravity = true;
        }

        if(!ku && jump){
            character[0].yv = 0;
        }


        if(character[0].x <= 0){                               // Retour du joueur de l'autre coté du canva
            character[0].x = canvas.width;
        } else if(character[0].x >= canvas.width){
            character[0].x = 0;
        } 
        if(character[0].y < ground[0][0].y - character[0].h && gravity){                     // Creation des éléments solides
            character[0].yv += 9.81/100;
            character[0].y += character[0].yv;
            jump = false;
        }
        for(var i=0; i < ground.length; i++){
            for(m=0; m < ground[i].length; m++){
                if(character[0].x + character[0].w >= ground[i][m].x && character[0].x <= ground[i][m].x + ground[i][m].w){
                    if(character[0].y + character[0].h >= ground[i][m].y && character[0].y < ground[i][m].y){
                        character[0].y = ground[i][m].y - character[0].h;
                        jump = true;
                        character[0].yv = 0;
                    } else if(character[0].y <= ground[i][m].y + ground[i][m].h && character[0].y > ground[i][m].y){
                        character[0].y = ground[i][m].y+ground[i][m].h;
                        char_jump = ground[i][m].y + ground[i][m].h;
                    }
                }
            }
        }                                                                       //Saša
		
        for( var b=0; b <= bonus.length-1; b++){                //Kévin
			for( var i=0; i <= ground.length-1; i++){
                for(var m=0; m <= ground[i].length-1; m++){
                    if(bonus[b].x + bonus[b].size >= ground[i][m].x && bonus[b].x <= ground[i][m].x + ground[i][m].w && bonus[b].y >= ground[i][m].y - bonus[b].size && bonus[b].y < ground[i][m].y){
                        bonus[b].y = ground[i][m].y - bonus[b].size;                    
                        bonus[b].yv=0;					
                    }
                }
			}
			bonus[b].yv += 9.81/125;
			bonus[b].y += bonus[b].yv;
			if(character[0].x + character[0].w >= bonus[b].x && character[0].x <= bonus[b].x + bonus[b].size){					// Interaction
				if(character[0].y + character[0].h > bonus[b].y && character[0].y < bonus[b].y + bonus[b].size){
					character[0].health++;
					bonus.splice(b,1);
                }
            }
        }
		
		tomber(mob);
		tomber(boss);

		if( mob.length > 25 || character[0].health <1 ){								// Fin de jeu
			alert("GAME OVER! You died or there are more than 25 square.");
			clearInterval(interval_draw);
            location.reload();
        }
    }										
										
	function draw(object){
		for(var m=0; m < object.length; m++){
			ctx.drawImage(object[m].img, object[m].x, object[m].y);
		}
	}                                                                                      //Kévin
    
    function draw_s(object){
		for(var m=0; m < object.length; m++){
			ctx.rect(object[m].x, object[m].y, object[m].size, object[m].size);
		}
	}       
    
	function tomber(object){                                       //Kévin
		for(m=0; m < object.length; m++){
			for(i=0; i < ground.length; i++){
                for(var l=0; l < ground[i].length; l++){
					if(object[m].x >= ground[i][l].x - object[m].w && object[m].x <= ground[i][l].x + ground[i][l].w && object[m].y >= ground[i][l].y - object[m].h && object[m].y < ground[i][l].y){                        
                        object[m].y = ground[i][l].y - object[m].h;
                        object[m].yv=0;
						
						if(object[m].goRight==0)object[m].goRight=1;
						
                        if(character[0].x >= ground[i][0].x - character[0].w && character[0].x <= ground[i][ground[i].length-1].x + ground[i][l].w && character[0].y < ground[i][l].y && character[0].y >= ground[i][l].y - canvas.height/4){     // Détecte sur quel plateau est le joueur
                            if(character[0].x - object[m].x > 0){
                                object[m].goRight = 2;
                                if(object[m].boss){
                                    img_boss = img_boss_right;
                                }
                            }
                            else{
                                object[m].goRight = -2;
                                if(object[m].boss){
                                    img_boss = img_boss_left;
                                }
                            }
                        }else if (i==0 && (ground[0][0].x + ground[0][0].w - object[m].x < object[m].w) ){
							object[m].goRight = -1;
						}else if (i==0 && (ground[0][0].x + object[m].w > object[m].x)){
							object[m].goRight = 1;
						}else if (i!=0&&ground[i][ground[i].length-1].x + bloc - object[m].w < object[m].x) {			// object va à droite
                            object[m].goRight = -1;
                        } else if (i!=0&&ground[i][0].x + object[m].xv > object[m].x) {							// object va à gauche
                            object[m].goRight = 1;
                        }
					}
                }
            }
			object[m].yv += 9.81/100;
            object[m].y += object[m].yv;
			if (object[m].goRight == 1){
				object[m].x += object[m].xv;
			}else if(object[m].goRight == -1){
				object[m].x -= object[m].xv;
			}else if(object[m].goRight == 2){
				object[m].x += 2*object[m].xv;
			}else if(object[m].goRight == -2){
				object[m].x -= 2*object[m].xv;                      //Kévin
			}
			
			if(character[0].x + character[0].w >= object[m].x && character[0].x <= object[m].x + object[m].w){					// Interaction   Saša
				if(character[0].y + character[0].h > object[m].y && character[0].y < object[m].y + object[m].h){
					character[0].health-=object[m].dmg;
					object[m].health--;
					if(object[m].health <= 0){ 
						object.splice(m,1);
					}
				}
			}
			if(object[m].y > canvas.height){					// Si un object tombe dans le vide il disparait
				object.splice(m,1);
			}
        }
	}
	
	function shoots_interaction(target,whos_shoots,s){                      //Kévin
	    for(var m=0; m <= target.length -1; m++){
            if(whos_shoots[s].x + whos_shoots[s].size >= target[m].x && whos_shoots[s].x <= target[m].x + target[m].w && whos_shoots[s].y + whos_shoots[s].size >= target[m].y && whos_shoots[s].y <= target[m].y + target[m].h){
                target[m].health--;
                whos_shoots.splice(s,1);
				if(target[m].health <= 0){
					score+= target[m].point;
                    target.splice(m,1);
				}
			}
		}
	}
	
	function fshoots_(condition, arme, whos_shoots, start_point, target, size){          //Kévin
		if (condition>0 && arme.delay >= 6 && arme.recharge == false){
			whos_shoots.push( {x: start_point[0].x + start_point[0].w/2, y: start_point[0].y + start_point[0].h/2, xv: 0, yv: 0, size:size}) ;
			fshoots(whos_shoots,target.x, target.y, arme);
			arme.delay = 0;
			arme.balles--;
			arme.delay_recharge -= 125/arme.ballesmax;
			if (arme.balles == 0) arme.recharge = true;
		}

		if (arme.delay < 6) arme.delay++;
		if (arme.delay_recharge < 125 && arme.recharge){
			arme.delay_recharge ++;
		}
		if (arme.delay_recharge >= 125){
			arme.balles = arme.ballesmax;
			arme.recharge = false;
		}
		
		for(var s=0; s < whos_shoots.length; s++){
			whos_shoots[s].x += whos_shoots[s].xv;
			whos_shoots[s].y -= whos_shoots[s].yv;
			for(var g=0; g <= ground.length-1; g++){
                for(var l=0; l <= ground[g].length-1; l++){
                    if(whos_shoots[s].x + whos_shoots[s].size >= ground[g][l].x && whos_shoots[s].x <= ground[g][l].x + ground[g][l].w && whos_shoots[s].y + whos_shoots[s].size >= ground[g][l].y && whos_shoots[s].y <= ground[g][l].y + ground[g][l].h){
                        whos_shoots.splice(s,1);
                        ground[g][l].v--;
                    }
                }
            }
            if(whos_shoots[s].y > canvas.height || whos_shoots[s].y < 0 || whos_shoots[s].x > canvas.width || whos_shoots[s].x < 0){
                whos_shoots.splice(s,1);
            }
			if (start_point === character){
				shoots_interaction(mob,shoots,s);
				shoots_interaction(boss,shoots,s);
			}
			if (start_point === boss){
				shoots_interaction(character, boss_shoots,s);
			}
		}
	}
}
