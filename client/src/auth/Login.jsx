import React, { useState } from 'react';
import { login, setToken } from '../api.js';

export default function Login({ onLoggedIn }){
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');

  const submit = async () => {
    setErr('');
    const r = await login(username,password);
    if(r.token){
      setToken(r.token);
      onLoggedIn?.();
    } else {
      setErr(r.error || '登入失敗');
    }
  }

  return (
    <div className="col">
      <h2>登入</h2>
      <input className="input" placeholder="帳號" value={username} onChange={e=>setUsername(e.target.value)} />
      <input className="input" placeholder="密碼" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {err && <div style={{color:'crimson'}}>{err}</div>}
      <div className="row">
        <button className="button" onClick={submit}>登入</button>
        <button className="button" onClick={()=>{
          setUsername('root'); setPassword('root');
        }}>填入 root/root</button>
        <button className="button" onClick={()=>{
          localStorage.removeItem('token'); location.reload();
        }}>登出</button>
      </div>
    </div>
  );
}
