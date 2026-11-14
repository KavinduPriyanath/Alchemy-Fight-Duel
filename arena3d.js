import * as THREE from './three.module.js';
const host=document.getElementById('battlefield'), scene=new THREE.Scene();scene.background=new THREE.Color('#49cef5');scene.fog=new THREE.Fog('#bdeeff',18,45);
const camera=new THREE.PerspectiveCamera(55,1,.1,80);camera.position.set(0,6.5,9);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));host.prepend(renderer.domElement);renderer.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
scene.add(new THREE.HemisphereLight(0xffffff,0x80ba75,2.5));const sun=new THREE.DirectionalLight(0xffefcf,3);sun.position.set(5,12,7);scene.add(sun);
function mesh(geo,color,x,y,z,parent=scene){const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,roughness:.65}));m.position.set(x,y,z);parent.add(m);return m}
mesh(new THREE.BoxGeometry(60,.3,60),0xcfa87b,0,-.3,0);
const tiles=[];for(let row=0;row<3;row++)for(let col=0;col<3;col++){const tile=mesh(new THREE.BoxGeometry(1.85,.2,1.85),row===2?0x86e3f3:((row+col)%2?0x454951:0x343941),(col-1)*2,0,(row-1)*2);tile.userData={row,col};tiles.push(tile)}
const rival=new THREE.Group();scene.add(rival);rival.position.set(0,0,-5);
mesh(new THREE.CylinderGeometry(.43,.55,1.1,12),0xe94b50,0,1.15,0,rival);mesh(new THREE.SphereGeometry(.4,20,16),0xf1bd91,0,2,0,rival);mesh(new THREE.SphereGeometry(.41,16,12,0,Math.PI*2,0,Math.PI/2),0x53342d,0,2.12,0,rival);
for(const s of [-1,1]){mesh(new THREE.CylinderGeometry(.16,.18,.8,10),0x365ba5,s*.24,.4,0,rival);mesh(new THREE.CylinderGeometry(.13,.14,.9,10),0xf1bd91,s*.6,1.15,0,rival);mesh(new THREE.SphereGeometry(.045,8,8),0x302c40,s*.14,2.03,.36,rival)}
rival.scale.set(1.12,1.55,1.12);
scene.background.set('#bdd8ef');scene.fog.color.set('#c8d5e5');
mesh(new THREE.BoxGeometry(24,.5,35),0xd1ad83,0,-.55,-5);
for(const side of [-1,1]){
 mesh(new THREE.BoxGeometry(.6,12,30),0xb6bfd1,side*9,5,-5);
 for(let z=5;z>=-13;z-=6){mesh(new THREE.CylinderGeometry(.48,.65,9,12),0xe1d4bb,side*7,4,z);mesh(new THREE.BoxGeometry(1.4,.4,1.4),0xe5c58b,side*7,8.5,z);
 mesh(new THREE.BoxGeometry(.12,2.8,1.6),side<0?0x8964d5:0xe87d67,side*8.6,5,z);
 const flame=mesh(new THREE.SphereGeometry(.2,12,12),0xffbd43,side*6.8,3,z);flame.scale.y=1.6;scene.add(new THREE.PointLight(0xffc66b,5,7));scene.children[scene.children.length-1].position.copy(flame.position);
 }
}
mesh(new THREE.BoxGeometry(18,11,.6),0xb7c3d8,0,5,-15);
mesh(new THREE.BoxGeometry(3,5,.2),0x68bde8,0,5,-14.6);
for(let x=-1;x<=1;x++)mesh(new THREE.BoxGeometry(.1,5,.25),0xe8d6a6,x,5,-14.4);
for(let z=4;z>=-14;z-=6){const arch=new THREE.Mesh(new THREE.TorusGeometry(7,.23,8,40,Math.PI),new THREE.MeshStandardMaterial({color:0xe7d7b5}));arch.position.set(0,5,z);scene.add(arch)}
mesh(new THREE.BoxGeometry(18,11,.6),0xb7c3d8,0,5,13);
const playerAvatar=rival.clone();playerAvatar.traverse(o=>{if(o.material){o.material=o.material.clone();if(o.material.color.getHex()===0xe94b50)o.material.color.setHex(0x287de0)}});playerAvatar.position.set(0,0,7);playerAvatar.rotation.y=Math.PI;scene.add(playerAvatar);
const focus=new THREE.Vector3(0,1,-1),desiredPosition=new THREE.Vector3();
const hands=new THREE.Group();camera.add(hands);scene.add(camera);
for(const side of [-1,1]){const hand=new THREE.Group();hands.add(hand);hand.position.set(side*.57,-.57,-1.55);hand.rotation.z=side*-.25;hand.rotation.x=.25;
mesh(new THREE.BoxGeometry(.23,.18,.64),0x287de0,0,-.08,.30,hand).userData.teamTint=true;
mesh(new THREE.SphereGeometry(1,24,16),0xffcf9f,0,0,-.13,hand).scale.set(.16,.065,.19);
for(let finger=0;finger<4;finger++){const len=.23+(finger===1||finger===2?.06:0);mesh(new THREE.CapsuleGeometry(.031,len-.062,6,12),0xffd6a9,(finger-1.5)*.073,.015,-.30-len/2,hand).rotation.x=Math.PI/2;}
const thumb=mesh(new THREE.CapsuleGeometry(.045,.14,6,12),0xffcf9f,-side*.19,.025,-.13,hand);thumb.rotation.x=Math.PI/2;thumb.rotation.z=side*.65;
mesh(new THREE.TorusGeometry(.13,.025,8,24),0xe9bd62,0,-.06,.06,hand).rotation.x=Math.PI/2;
}
const units=new THREE.Group();scene.add(units);const ray=new THREE.Raycaster();let last='';
window.arena3D={target(){ray.setFromCamera(new THREE.Vector2(0,.28),camera);const hits=ray.intersectObjects([...tiles,...units.children,...rival.children],false);for(const h of hits){if(h.object.userData.side==='ai')return {point:h.point.clone(),lane:h.object.userData.col,hit:true,label:'ENEMY UNIT'};if(h.object.parent===rival)return {point:h.point.clone(),lane:null,hit:true,label:'RIVAL'};if(h.object.userData.row!==undefined)return {point:h.point.clone(),lane:h.object.userData.row===2?h.object.userData.col:null,hit:false,row:h.object.userData.row,label:h.object.userData.row===2?'SUMMON TILE':'AIM'}}return {point:ray.ray.at(25,new THREE.Vector3()),lane:null,hit:false,label:'AIM'}}};
const palette={fire:0xff713b,water:0x35c9ff,earth:0xc99562,wind:0xc4f4ff,lightning:0xffe64d,poison:0x95f547};
const charges=hands.children.map(hand=>{const group=new THREE.Group();hand.add(group);group.position.set(0,.24,-.23);const core=mesh(new THREE.IcosahedronGeometry(.085,2),0xffffff,0,0,0,group);core.material.emissiveIntensity=1.5;for(let i=0;i<9;i++)mesh(new THREE.SphereGeometry(.012,6,6),0xffffff,Math.cos(i)*.14,Math.sin(i*2)*.08,Math.sin(i)*.14,group);return group});
window.arena3D.launch=(enemy=false)=>new Promise(resolve=>{const g=window.readDuelState?.(),intent=g?.aiIntent;const target=enemy?(intent?.kind==='unit'?new THREE.Vector3((intent.lane-1)*2,.5,-2):intent?.lane>=0?new THREE.Vector3((intent.lane-1)*2,.7,2-(g.playerUnits[intent.lane]?.distance||0)*2):new THREE.Vector3(0,1.8,7)):window.arena3D.target().point;const start=camera.localToWorld(new THREE.Vector3(0,-.4,-1.5));const ball=mesh(new THREE.SphereGeometry(.13,16,12),enemy?0xff6455:0x8c5cff,start.x,start.y,start.z);ball.material.emissive.setHex(enemy?0xff3322:0x7144ff);const began=performance.now();function fly(){const t=Math.min(1,(performance.now()-began)/650);ball.position.lerpVectors(start,target,t);if(enemy)rival.rotation.z=Math.sin(t*Math.PI)*.12;if(t<1)requestAnimationFrame(fly);else{scene.remove(ball);ball.geometry.dispose();ball.material.dispose();rival.rotation.z=0;resolve()}}fly()});
function makeUnit(u,side){
 const color=palette[u.element]||0x8a9dc4,name=u.name.toLowerCase();let geometry=new THREE.BoxGeometry(.6,.65,.4);
 if(name.includes('slime'))geometry=new THREE.SphereGeometry(.4,18,10,0,Math.PI*2,0,Math.PI*.65);
 else if(name.includes('serpent'))geometry=new THREE.TorusGeometry(.29,.13,10,22,Math.PI*1.7);
 else if(name.includes('sentinel'))geometry=new THREE.OctahedronGeometry(.47);
 else if(name.includes('guardian'))geometry=new THREE.ConeGeometry(.42,.85,6);
 else if(name.includes('turret'))geometry=new THREE.CylinderGeometry(.27,.4,.6,8);
 else if(name.includes('monster'))geometry=new THREE.CapsuleGeometry(.32,.22,6,12);
 else if(name.includes('imp'))geometry=new THREE.ConeGeometry(.32,.65,8);
 const body=mesh(geometry,side==='player'?0x287de0:0xe94b50,0,0,0,new THREE.Group());body.material.roughness=.4;
 const part=(geo,c,x,y,z)=>mesh(geo,c,x,y,z,body);
 if(name.includes('golem')){for(const side of [-1,1]){part(new THREE.BoxGeometry(.22,.4,.3),color,side*.43,-.02,0);part(new THREE.BoxGeometry(.22,.22,.28),0x485369,side*.18,-.43,0)}part(new THREE.BoxGeometry(.43,.3,.38),color,0,.43,0)}
 if(name.includes('turret')){const barrel=part(new THREE.CylinderGeometry(.1,.1,.65,8),0x325a46,0,.3,.25);barrel.rotation.x=Math.PI/2;for(const side of [-1,1])part(new THREE.ConeGeometry(.1,.4,5),0xa5ed6c,side*.3,.28,0)}
 if(name.includes('guardian')||name.includes('sentinel')){for(const side of [-1,1]){const shard=part(new THREE.ConeGeometry(.12,.6,5),0xa4e6ff,side*.35,.25,0);shard.rotation.z=-side*.4}}
 if(name.includes('monster')||name.includes('imp')){for(const side of [-1,1]){part(new THREE.ConeGeometry(.1,.32,6),0xffdf9e,side*.21,.43,0);part(new THREE.CapsuleGeometry(.09,.24,4,8),color,side*.39,-.1,0)}}
 if(name.includes('serpent')){part(new THREE.SphereGeometry(.21,12,10),color,.28,.26,.06);part(new THREE.ConeGeometry(.09,.35,5),0xe7db9d,-.3,-.3,0)}
 if(name.includes('slime'))body.scale.y=.8;
 const teamRing=part(new THREE.TorusGeometry(.46,.045,8,28),side==='player'?0x287de0:0xe94b50,0,-.5,0);teamRing.rotation.x=Math.PI/2;return body;
}
function frame(){requestAnimationFrame(frame);const g=window.readDuelState?.();const l=g?.look||{x:0,y:0};const enemyPOV=g?.phase==='ai';desiredPosition.set(0,enemyPOV?3.6:6.5,enemyPOV?-6.3:9);camera.position.lerp(desiredPosition,.075);const intent=g?.aiIntent;const aimFocus=enemyPOV&&intent?(intent.kind==='unit'?new THREE.Vector3((intent.lane-1)*2,.5,-2):intent.lane>=0?new THREE.Vector3((intent.lane-1)*2,.7,2-(g.playerUnits[intent.lane]?.distance||0)*2):new THREE.Vector3(0,1.8,7)):new THREE.Vector3(enemyPOV?0:l.x*.018,enemyPOV?.8:1-l.y*.045,enemyPOV?3:-1);if(!enemyPOV&&camera.position.distanceTo(desiredPosition)<.05)focus.copy(aimFocus);else focus.lerp(aimFocus,.09);camera.lookAt(focus);if(enemyPOV&&intent)camera.rotateX(-Math.atan(.28*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))));hands.traverse(o=>{if(o.userData.teamTint)o.material.color.setHex(enemyPOV?0xe94b50:0x287de0)});rival.visible=!enemyPOV;playerAvatar.visible=enemyPOV;const w=host.clientWidth,h=host.clientHeight;if(renderer.domElement.width!==Math.round(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(h*renderer.getPixelRatio())){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}if(g){charges.forEach((charge,i)=>{const key=g.phase==='ai'?g.aiIntent?.element:g.slots[i];charge.visible=!!key&&(g.phase==='ai'||g.slots.length<3);if(key){charge.rotation.y=performance.now()*.002;charge.children.forEach((m,j)=>{m.material.color.setHex(palette[key]);m.material.emissive.setHex(palette[key]);m.position.y=j?Math.sin(performance.now()*.004+j)*.07:0});charge.children[0].scale.set(1,key==='fire'?1.7:key==='earth'?.8:1,1)}});hands.children.forEach((hand,i)=>{const side=i===0?-1:1;const mixed=g.slots.length===3||g.phase==='aim'||g.phase==='projectile'||g.phase==='ai';hand.rotation.y=THREE.MathUtils.lerp(hand.rotation.y,mixed?-side*.85:0,.15);hand.rotation.x=THREE.MathUtils.lerp(hand.rotation.x,mixed?1.12:.25,.15);hand.rotation.z=THREE.MathUtils.lerp(hand.rotation.z,side*(mixed?-.4:-.25),.15);hand.position.x=THREE.MathUtils.lerp(hand.position.x,side*(mixed?.37:.57),.15)});const key=JSON.stringify([g.playerUnits,g.aiUnits]);if(key!==last){last=key;for(const m of [...units.children]){units.remove(m);m.traverse(o=>{o.geometry?.dispose();if(o.material){o.material.map?.dispose();o.material.dispose()}})}for(const side of ['player','ai'])g[side+'Units'].forEach((u,col)=>{if(!u)return;const row=side==='player'?2-u.distance:u.distance;const m=makeUnit(u,side);m.position.set((col-1)*2,.6,(row-1)*2);units.add(m);m.userData={side,col};
for(const sign of [-1,1]){const eye=mesh(new THREE.SphereGeometry(.09,12,12),0xffffff,sign*.14,.08,.34,m);mesh(new THREE.SphereGeometry(.045,10,10),0x182132,0,0,.075,eye)}
const canvas=document.createElement('canvas');canvas.width=384;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle=side==='player'?'#1754a1':'#a32935';ctx.fillRect(0,0,384,96);ctx.fillStyle='#ffffff';ctx.font='bold 29px sans-serif';ctx.textAlign='center';ctx.fillText((u.type||'attack').toUpperCase(),192,36);ctx.font='24px sans-serif';ctx.fillText(u.name+' | '+Math.max(0,u.hp)+' HP',192,73);const label=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),depthTest:false}));label.position.set(0,.82,0);label.scale.set(1.8,.45,1);m.add(label)})}tiles.forEach(t=>{const enemyTile=enemyPOV&&intent?.kind==='unit'&&t.userData.row===0&&t.userData.col===intent.lane;t.material.emissive.setHex(enemyTile?0xa52d35:g.phase==='aim'&&g.pending?.kind==='unit'&&t.userData.row===2?0x165d51:0);t.material.emissiveIntensity=enemyTile?.65+Math.sin(performance.now()*.008)*.25:1})}renderer.render(scene,camera)}frame();

