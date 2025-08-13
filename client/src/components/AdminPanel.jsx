import React, { useEffect, useState } from 'react';
import { adminListCharacters, adminCreateCharacter, adminUpdateCharacter, adminDeleteCharacter } from '../api.js';

export default function AdminPanel(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({name:'', system_prompt:'', color:'#ffffff', avatar:'🙂'});
  const [msg,setMsg] = useState('');

  async function load(){
    const r = await adminListCharacters();
    if(Array.isArray(r)) setItems(r);
    else setMsg(r.error || '權限不足？請用 root 登入');
  }

  useEffect(()=>{ load(); },[]);

  async function create(){
    const r = await adminCreateCharacter(form);
    if(r.id){ setMsg('新增成功'); setForm({name:'', system_prompt:'', color:'#ffffff', avatar:'🙂'}); load(); }
    else setMsg(r.error || '新增失敗');
  }

  async function update(it){
    const r = await adminUpdateCharacter(it.id, it);
    if(r.id){ setMsg('更新成功'); load(); } else setMsg(r.error||'更新失敗');
  }

  async function remove(id){
    const r = await adminDeleteCharacter(id);
    if(r.ok){ setMsg('刪除成功'); load(); } else setMsg(r.error||'刪除失敗');
  }

  return (
    <div className="col">
      <h2>系統提示管理（需 root / admin）</h2>
      <div style={{color:'#666'}}>{msg}</div>
      <div className="card">
        <h3>新增角色</h3>
        <div className="row">
          <input className="input" placeholder="角色名稱" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
          <input className="input" placeholder="顏色" value={form.color} onChange={e=>setForm({...form, color:e.target.value})} />
          <input className="input" placeholder="頭像 Emoji" value={form.avatar} onChange={e=>setForm({...form, avatar:e.target.value})}/>
        </div>
        <textarea className="input" rows="4" placeholder="System Prompt" value={form.system_prompt} onChange={e=>setForm({...form, system_prompt:e.target.value})}/>
        <div className="row"><button className="button" onClick={create}>新增</button></div>
      </div>
      <hr/>
      <h3>角色列表</h3>
      <div className="col">
        {items.map(it => (
          <div key={it.id} className="card">
            <div className="row">
              <input className="input" value={it.name} onChange={e=>setItems(items.map(x=>x.id===it.id?{...x,name:e.target.value}:x))}/>
              <input className="input" value={it.color} onChange={e=>setItems(items.map(x=>x.id===it.id?{...x,color:e.target.value}:x))}/>
              <input className="input" value={it.avatar} onChange={e=>setItems(items.map(x=>x.id===it.id?{...x,avatar:e.target.value}:x))}/>
            </div>
            <textarea className="input" rows="3" value={it.system_prompt} onChange={e=>setItems(items.map(x=>x.id===it.id?{...x,system_prompt:e.target.value}:x))}/>
            <div className="row">
              <button className="button" onClick={()=>update(items.find(x=>x.id===it.id))}>儲存</button>
              <button className="button" onClick={()=>remove(it.id)}>刪除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
