import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Dashboard } from './pages/Dashboard'
import { Learn } from './pages/Learn'
import { Sensors } from './pages/Sensors'
import { PlantLab } from './components/PlantLab'
import { MadagascarMap } from './components/MadagascarMap'
import { api } from './services/api'
import { Diagnosis } from './pages/Diagnosis'
import { Insights } from './pages/Insights'

export default function App(){const[page,setPage]=useState('dashboard');const[data,setData]=useState(null);const[toast,setToast]=useState('');
 useEffect(()=>{let active=true;const refresh=()=>api.dashboard().then(value=>active&&setData(value)).catch(()=>active&&setData(current=>({sensors:current?.sensors||{soilMoisture:42,temperature:26,fertility:78},device:{online:false,lastSeen:null}})));refresh();const timer=setInterval(refresh,5000);return()=>{active=false;clearInterval(timer)}},[])
 let content=page==='dashboard'?<Dashboard data={data} onNavigate={setPage}/>:page==='learn'?<Learn/>:page==='lab'?<PlantLab full/>:page==='map'?<MadagascarMap full/>:page==='insights'?<Insights/>:page==='diagnosis'?<Diagnosis/>:<Sensors data={data}/>
 return <div className="app-shell top-layout"><Navbar page={page} setPage={setPage}/><main><div className="page">{content}</div><footer>Conçu pour les agriculteurs de Madagascar · Tanimboly 2026</footer></main>{toast&&<div className="toast">✓ {toast}</div>}</div>}
