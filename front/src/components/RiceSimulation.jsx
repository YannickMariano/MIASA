import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { useMemo, useRef } from 'react'

// Simulation du riz irrigué : du repiquage (jour 0) à la récolte (jour 120, cycle affiché sur 150 jours).
export const RICE_STAGES=[{min:0,name:'Reprise',hint:'Les jeunes plants repiqués reprennent racine.'},{min:10,name:'Tallage',hint:'Les talles se multiplient : gardez une lame d’eau et désherbez.'},{min:55,name:'Montaison',hint:'Les tiges s’allongent : c’est le bon moment pour un apport d’azote.'},{min:75,name:'Floraison',hint:'Les panicules sortent : l’eau ne doit surtout pas manquer.'},{min:90,name:'Grain laiteux',hint:'Les grains se remplissent : maintenez une lame d’eau légère.'},{min:105,name:'Maturation',hint:'Les grains dorent : drainez la rizière avant la récolte.'},{min:120,name:'Récolte',hint:'Le riz est mûr : récoltez sans tarder.'}]
export const RICE_CYCLE_END=150
const PREPARATION={name:'Préparation',hint:'Labourez la parcelle, mettez-la en eau puis repiquez les plants.'}
const HARVESTED={name:'Récolté',hint:'La récolte est terminée. Recommencez pour une nouvelle saison.'}
const clamp=n=>Math.max(0,Math.min(100,n))
const riceStageAt=day=>[...RICE_STAGES].reverse().find(s=>day>=s.min)

export const riceInitial={day:0,prepared:false,planted:false,water:0,nutrients:55,health:90,weeds:30,harvested:0,stats:{dry:0,weedy:0,hungry:0,flooded:0},log:['Jour 0 — Parcelle de riz non travaillée. Préparez la terre avant le repiquage.']}

export function riceStage(sim){return sim.harvested>0?HARVESTED:sim.planted?riceStageAt(sim.day):PREPARATION}

export function riceBlocked(sim){if(sim.harvested>0)return'Récolte terminée : lancez une nouvelle simulation pour une nouvelle saison.';if(sim.planted)return null;return!sim.prepared?'Labourez la parcelle, irriguez-la puis repiquez le riz pour pouvoir avancer dans le temps.':sim.water<20?'Irriguez la rizière puis repiquez le riz pour pouvoir avancer dans le temps.':'Repiquez le riz pour pouvoir avancer dans le temps.'}
export function riceReport(sim){if(!sim.harvested)return null;const{dry,weedy,hungry,flooded}=sim.stats,kg=sim.harvested;return{tag:`RÉCOLTE · JOUR ${sim.day}`,title:`${kg} kg de paddy${kg>=400?' : excellente saison !':kg>=250?' : bonne saison.':' : saison difficile.'}`,kpis:[['Production',`${kg} kg`],['Santé à la récolte',`${Math.round(sim.health)} %`],['Jour de récolte',`J${sim.day}`],['Jours de stress',String(dry+weedy+hungry+flooded)]],notes:[dry?['cancel',`La rizière a manqué d’eau pendant ${dry} jour${dry>1?'s':''} : irriguez plus tôt.`]:['check_circle','Bonne gestion de l’eau tout au long du cycle.'],weedy?['cancel',`Les mauvaises herbes ont concurrencé le riz pendant ${weedy} jour${weedy>1?'s':''} : désherbez dès le tallage.`]:['check_circle','Parcelle bien désherbée.'],hungry?['cancel',`Le sol a manqué d’azote pendant ${hungry} jour${hungry>1?'s':''} : fertilisez au tallage et à la montaison.`]:['check_circle','Fertilisation suffisante.'],...(flooded?[['cancel',`Trop d’eau pendant la maturation (${flooded} jour${flooded>1?'s':''}) : drainez 10 à 15 jours avant la récolte.`]]:[]),sim.day<120?['info','Récolte un peu précoce : attendez le jour 120 pour des grains bien mûrs.']:['check_circle','Récolte au bon moment.']]}}
export function riceLab(sim,setSim){
 const update=(message,changes)=>setSim(s=>({...s,...changes,log:[`Jour ${s.day} — ${message}`,...s.log].slice(0,6)}))
 const advance=days=>setSim(s=>{
  if(!s.planted)return{...s,log:['Jour 0 — Repiquez d’abord le riz avant d’avancer le temps.',...s.log].slice(0,6)}
  if(s.harvested>0)return{...s,log:[`Jour ${s.day} — La récolte est terminée. Recommencez pour une nouvelle saison.`,...s.log].slice(0,6)}
  let{water,nutrients,health,weeds,day}=s;const stress={dry:0,weedy:0,hungry:0,flooded:0},startStage=riceStageAt(day).name,end=Math.min(RICE_CYCLE_END,day+days)
  while(day<end){day++
   water=clamp(water-2.2);weeds=clamp(weeds+(water>30?.15:.6));nutrients=clamp(nutrients-.35)
   let penalty=0
   if(water<15&&day<105){penalty+=.9;stress.dry++}
   if(weeds>40){penalty+=.4;stress.weedy++}
   if(nutrients<20){penalty+=.4;stress.hungry++}
   if(day>=105&&water>50){penalty+=.3;stress.flooded++}
   health=clamp(health-penalty+(penalty?0:.4))}
  const worst=Object.entries(stress).sort((a,b)=>b[1]-a[1])[0],messages={dry:'La rizière manque d’eau : les plants subissent un stress.',weedy:'Les mauvaises herbes concurrencent le riz.',hungry:'Le sol manque d’azote : les feuilles pâlissent.',flooded:'Trop d’eau pendant la maturation : drainez la rizière.'}
  const entries=[`Jour ${day} — ${worst[1]?messages[worst[0]]:'La croissance se poursuit normalement.'}`],newStage=riceStageAt(day).name
  if(newStage!==startStage)entries.unshift(`Jour ${day} — Nouveau stade : ${newStage.toLowerCase()}.`)
  const stats=Object.fromEntries(Object.keys(stress).map(k=>[k,s.stats[k]+stress[k]]));return{...s,day,water,nutrients,health,weeds,stats,log:[...entries,...s.log].slice(0,6)}})
 const actions=[
  {id:'plough',icon:'landscape',label:'Labourer',disabled:sim.prepared||sim.planted,on:()=>update('Parcelle labourée et mise en boue.',{prepared:true,weeds:5})},
  {id:'irrigate',icon:'water_drop',label:'Irriguer',disabled:sim.water>=95||sim.harvested>0,on:()=>update('Rizière irriguée : lame d’eau rétablie.',{water:clamp(sim.water+30)})},
  {id:'transplant',icon:'potted_plant',label:'Repiquer',disabled:sim.planted||!sim.prepared||sim.water<20,on:()=>update('Plants de 12 jours repiqués, espacés de 25 × 25 cm.',{planted:true})},
  {id:'weed',icon:'grass',label:'Désherber',disabled:sim.weeds<=5||sim.harvested>0,on:()=>update('Désherbage manuel effectué.',{weeds:3})},
  {id:'fertilize',icon:'compost',label:'Fertiliser',disabled:sim.harvested>0,on:()=>update('Compost apporté dans la rizière.',{nutrients:clamp(sim.nutrients+25)})},
  {id:'drain',icon:'water_damage',label:'Drainer',disabled:sim.water<5,on:()=>update('Rizière drainée.',{water:0})},
  {id:'treat',icon:'health_and_safety',label:'Traiter',disabled:!sim.planted||sim.harvested>0,on:()=>update('Traitement au neem pulvérisé.',{health:clamp(sim.health+10)})},
  {id:'harvest',icon:'agriculture',label:'Récolter',disabled:!sim.planted||sim.day<110||sim.harvested>0,on:()=>{const kg=Math.round(sim.health*5);update(`Récolte : ${kg} kg de paddy.`,{harvested:kg})}},
 ]
 return{advance,actions}
}

const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16))
const mix=(a,b,t)=>{t=Math.max(0,Math.min(1,t));const A=hex(a),B=hex(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
const rnd=i=>{const x=Math.sin(i*12.9898+78.233)*43758.5453;return x-Math.floor(x)}
const HILLS=[];for(let j=0;j<5;j++)for(let i=0;i<5;i++)HILLS.push({k:j*5+i,x:-1.1+i*.55+(rnd(i+j*9)-.5)*.05,z:-1.1+j*.55+(rnd(i*3+j)-.5)*.05})
const WEEDS=Array.from({length:14},(_,i)=>({x:(rnd(i*4.1)-.5)*2.8,z:(rnd(i*7.3)-.5)*2.8}))

function RiceHill({hill,day,growth,leaf,panicle,cut}){const ref=useRef();const blades=useMemo(()=>Array.from({length:7},(_,i)=>{const f=i/6*2-1;return{yaw:rnd(hill.k*5+i)*Math.PI*2,tilt:f*.32+(rnd(hill.k*7+i)-.5)*.12,h:.9+rnd(hill.k*13+i)*.25}}),[hill.k]);useFrame(({clock})=>{if(ref.current)ref.current.rotation.z=Math.sin(clock.elapsedTime*.9+hill.k)*.025});const scale=cut?.12:growth*(.9+rnd(hill.k)*.2);return <group ref={ref} position={[hill.x,.2,hill.z]} scale={[1,scale,1]}>{blades.map((b,i)=><group key={i} rotation={[0,b.yaw,b.tilt]}><mesh position={[0,b.h/2,0]} castShadow><boxGeometry args={[.035,b.h,.012]}/><meshStandardMaterial color={mix(leaf,'#CDB673',Math.abs(b.tilt)*.8*Math.max(0,(day-60)/60))} roughness={.8}/></mesh>{panicle&&!cut&&i%2===0&&<mesh position={[.06,b.h-.02,0]} rotation={[0,0,1.1]} scale={[1,3,1]}><sphereGeometry args={[.028,8,6]}/><meshStandardMaterial color={panicle} roughness={.6}/></mesh>}</group>)}</group>}

function RicePaddy({sim}){const{day,planted,prepared,water,health,nutrients,weeds,harvested}=sim;const cut=harvested>0,growth=planted?Math.min(1,.18+day/85*.82):0;let leaf=mix('#86B84E','#4E8A32',day/40);leaf=mix(leaf,'#C4BE68',(1-nutrients/60)*.6);leaf=mix(leaf,'#8E7B4E',(1-health/100)*.6);leaf=mix(leaf,'#CDB673',Math.max(0,(day-100)/20)*.85);const panicle=day>=75?(day<90?'#A9C660':mix('#D9C66C','#D2A036',(day-90)/30)):null;const soil=prepared?(water>5?'#5E4A36':'#7A5A3E'):mix('#B8966A','#9C7A52',.3);const weedCount=cut?0:Math.round(weeds/8)
 return <group position={[0,-1.1,0]}>
  <mesh position={[0,0,0]} receiveShadow><boxGeometry args={[3.2,.36,3.2]}/><meshStandardMaterial color={soil} roughness={1}/></mesh>
  <mesh position={[0,-.4,0]}><boxGeometry args={[3.2,.45,3.2]}/><meshStandardMaterial color="#8E5034" roughness={.9}/></mesh>
  {[[0,1.55,3.3,.1],[0,-1.55,3.3,.1],[1.55,0,.1,3.1],[-1.55,0,.1,3.1]].map(([x,z,w,d],i)=><mesh key={i} position={[x,.26,z]} castShadow><boxGeometry args={[w,.18,d]}/><meshStandardMaterial color="#7E5F40" roughness={1}/></mesh>)}
  {prepared&&!planted&&Array.from({length:9}).map((_,i)=><mesh key={i} position={[0,.185,-1.2+i*.3]}><boxGeometry args={[2.9,.01,.06]}/><meshStandardMaterial color="#4E3C2C"/></mesh>)}
  {water>2&&<mesh position={[0,.2+water/100*.06,0]}><boxGeometry args={[3,.02,3]}/><meshStandardMaterial color="#8FB3BC" transparent opacity={.25+water/100*.5} roughness={.15} metalness={.1}/></mesh>}
  {WEEDS.slice(0,weedCount).map((w,i)=><mesh key={i} position={[w.x,.28,w.z]}><coneGeometry args={[.05,.2,5]}/><meshStandardMaterial color="#9BBF4F"/></mesh>)}
  {planted&&HILLS.map(h=><RiceHill key={h.k} hill={h} day={day} growth={growth} leaf={leaf} panicle={panicle} cut={cut}/>)}
 </group>}

export function RiceScene({sim}){return <Canvas gl={{alpha:true}} shadows camera={{position:[4.2,3.2,5.2],fov:38}} dpr={[1,1.7]}><fog attach="fog" args={['#E6E9DC',7,14]}/><ambientLight intensity={1.15}/><directionalLight position={[3,6,3]} intensity={2.2} castShadow/><RicePaddy sim={sim}/><ContactShadows position={[0,-1.7,0]} opacity={.3} scale={9} blur={2.5}/><OrbitControls enablePan={false} minDistance={3.4} maxDistance={8} minPolarAngle={.45} maxPolarAngle={1.45}/></Canvas>}
