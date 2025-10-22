const NODE_RED = process.env.REACT_APP_NODE_RED || "http://127.0.0.1:1880";
const API_BASE  = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";

async function toJson(res){
  if(!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
function errMsg(e){ return e?.message || "Erro de rede"; }

export async function sendSimInputs({ dsnu, dsbc }){
  try{
    const res = await fetch(`${NODE_RED}/sim/input`, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ dsnu, dsbc })
    });
    return await toJson(res);
  }catch(e){ throw new Error(errMsg(e)); }
}

export async function getCylinderStatus(){
  try{
    const res = await fetch(`${API_BASE}/api/cylinder/status`);
    return await toJson(res);
  }catch(e){ throw new Error(errMsg(e)); }
}

export async function getHistoryByTag(tag){
  try{
    const u = new URL(`${API_BASE}/api/cylinder/history`);
    u.searchParams.set("tag", tag);
    const res = await fetch(u.toString());
    return await toJson(res);
  }catch(e){ throw new Error(errMsg(e)); }
}