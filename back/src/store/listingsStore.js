import {randomUUID} from 'node:crypto'
import {mkdirSync,readFileSync,renameSync,writeFileSync} from 'node:fs'
import {dirname} from 'node:path'
import {env} from '../config/env.js'

// Annonces de récoltes publiées par les producteurs, enregistrées dans un fichier JSON (aucun nom de personne, seulement un numéro de téléphone).
// Chaque annonce garde un jeton secret, remis uniquement à son auteur, qui permet de la retirer.
const MAX_LISTINGS=500
let cache=null

function load(){
 if(cache)return cache
 try{cache=JSON.parse(readFileSync(env.listingsFile,'utf8'))}catch{cache=[]}
 if(!Array.isArray(cache))cache=[]
 return cache
}
function save(){
 mkdirSync(dirname(env.listingsFile),{recursive:true})
 const tmp=`${env.listingsFile}.tmp`
 writeFileSync(tmp,JSON.stringify(cache,null,1))
 renameSync(tmp,env.listingsFile)
}
const publicView=({deleteToken,...listing})=>listing

export const listingsStore={
 all:()=>load().map(publicView),
 add(data){
  const list=load()
  const listing={id:randomUUID(),...data,createdAt:new Date().toISOString(),deleteToken:randomUUID()}
  list.unshift(listing)
  if(list.length>MAX_LISTINGS)list.length=MAX_LISTINGS
  save()
  return listing
 },
 remove(id,token){
  const list=load(),index=list.findIndex(l=>l.id===id)
  if(index<0)return 'not-found'
  if(!token||list[index].deleteToken!==token)return 'forbidden'
  list.splice(index,1);save()
  return 'removed'
 },
 reset(){cache=null},
}
