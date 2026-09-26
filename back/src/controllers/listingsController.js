import {listingsStore} from '../store/listingsStore.js'

// Valeurs acceptées pour une annonce de récolte (les mêmes listes sont proposées dans le formulaire du frontend).
export const CATEGORIES=['Céréales','Tubercules','Légumineuses','Fruits','Légumes','Cultures de rente','Épices','Autre']
export const UNITS=['kg','tonne','sac','daba','kapoaka','pièce','litre']
export const REGIONS=['Alaotra-Mangoro','Amoron\'i Mania','Analamanga','Analanjirofo','Androy','Anosy','Atsimo-Andrefana','Atsimo-Atsinanana','Atsinanana','Ambatosoa','Betsiboka','Boeny','Bongolava','Diana','Fitovinany','Haute Matsiatra','Ihorombe','Itasy','Melaky','Menabe','SAVA','Sofia','Vakinankaratra','Vatovavy']

const text=(value,max)=>typeof value==='string'?value.replace(/\s+/g,' ').trim().slice(0,max):''
// Numéro malgache : 03X XX XXX XX, ou +261 3X XX XXX XX. Enregistré au format 03X XX XXX XX.
export function normalizePhone(value){
 const digits=String(value??'').replace(/[\s.\-()]/g,'')
 const m=digits.match(/^(?:\+261|00261|0)?(3[2-9]\d{7})$/)
 if(!m)return null
 const n=`0${m[1]}`
 return `${n.slice(0,3)} ${n.slice(3,5)} ${n.slice(5,8)} ${n.slice(8)}`
}

export function validateListing(body={}){
 const errors=[]
 const listing={
  crop:text(body.crop,60),
  category:CATEGORIES.includes(body.category)?body.category:'',
  quantity:Number(body.quantity),
  unit:UNITS.includes(body.unit)?body.unit:'',
  price:Number(body.price),
  region:REGIONS.includes(body.region)?body.region:'',
  phone:normalizePhone(body.phone),
  description:text(body.description,400),
 }
 if(listing.crop.length<2)errors.push('Indiquez le produit récolté.')
 if(!listing.category)errors.push('Choisissez une catégorie.')
 if(!Number.isFinite(listing.quantity)||listing.quantity<=0||listing.quantity>1e6)errors.push('La quantité doit être un nombre positif.')
 if(!listing.unit)errors.push('Choisissez une unité.')
 if(!Number.isFinite(listing.price)||listing.price<=0||listing.price>1e9)errors.push('Le prix doit être un nombre positif (en Ariary).')
 if(!listing.region)errors.push('Choisissez une région.')
 if(!listing.phone)errors.push('Numéro de téléphone malgache invalide (ex. 034 12 345 67).')
 listing.price=Math.round(listing.price);listing.quantity=Math.round(listing.quantity*100)/100
 return {errors,listing}
}

export const list=(_req,res)=>res.json(listingsStore.all())
export const create=(req,res)=>{
 const {errors,listing}=validateListing(req.body)
 if(errors.length)return res.status(400).json({message:errors[0],errors})
 const saved=listingsStore.add(listing)
 res.status(201).json(saved)
}
export const remove=(req,res)=>{
 const result=listingsStore.remove(req.params.id,req.get('X-Delete-Token'))
 if(result==='not-found')return res.status(404).json({message:'Annonce introuvable'})
 if(result==='forbidden')return res.status(403).json({message:'Seul l’auteur de l’annonce peut la retirer'})
 res.status(204).end()
}
export const options=(_req,res)=>res.json({categories:CATEGORIES,units:UNITS,regions:REGIONS})
