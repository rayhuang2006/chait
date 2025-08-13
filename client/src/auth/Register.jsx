import React, { useState } from 'react';
import { register } from '../api.js';

export default function Register({ onRegistered }){
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [msg,setMsg] = useState('');

  const submit = async () => {
    setMsg('');
    const r = await register(username,password);
    if(r.id){
      setMsg('註冊成功，請返回登入');
      onRegistered?.();
    } else {
      setMsg(r.error || '註冊失敗');
    }
  }

  return (
    <div className="col">
      <h2>註冊</h2>
      <input className="input" placeholder="帳號" value={username} onChange={e=>setUsername(e.target.value)} />
      <input className="input" placeholder="密碼" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <div className="row">
        <button className="button" onClick={submit}>註冊</button>
        <span style={{color:'#666'}}>{msg}</span>
      </div>
    </div>
  );
}
