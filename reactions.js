// Shared rules for player spells, rival spells, and unit attacks.
globalThis.AlchemyReactions={
 resolve(target,element,base){
  const pair=[target.aura,element].sort().join('+');
  const rules={'fire+water':['Vaporize',1.5],'lightning+water':['Electrocharge',1.5],'fire+poison':['Combustion',1.6],'earth+wind':['Shatter',1.35],'water+wind':['Freeze',1.2],'earth+fire':['Molten',1.3]};
  const reaction=target.aura!==element?rules[pair]:null;
  target.aura=element;target.auraTurns=2;
  if(element==='fire')target.burn=2;
  if(element==='poison')target.poison=2;
  if(reaction?.[0]==='Freeze')target.frozen=1;
  if(reaction?.[0]==='Combustion'){target.poison=0;target.burn=2}
  return {damage:Math.round(base*(reaction?.[1]||1)),name:reaction?.[0]||null};
 },
 tick(target){let damage=0;if(target.burn>0){damage+=2;target.burn--}if(target.poison>0){damage+=3;target.poison--}if(target.auraTurns>0&&--target.auraTurns===0)target.aura=null;return damage}
};
