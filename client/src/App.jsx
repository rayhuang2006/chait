import React, { useState, useEffect } from 'react';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Chat from './components/Chat.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import { getToken } from './api.js';

export default function App(){
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'chat' | 'admin'

  useEffect(() => {
    if(getToken()) setTab('chat');
  }, []);

  return (
    <div className="app">
      <div className="header">
        <div className="badge"><span className="avatar">🫧</span><b>CHait</b> · Q彈聊天</div>
        <div className="chips">
          <div className="chip" onClick={()=>setTab('login')}>登入</div>
          <div className="chip" onClick={()=>setTab('register')}>註冊</div>
          <div className="chip" onClick={()=>setTab('chat')}>聊天</div>
          <div className="chip" onClick={()=>setTab('admin')}>系統提示管理</div>
        </div>
      </div>

      <div className="card">
        {tab==='login' && <Login onLoggedIn={()=>setTab('chat')} />}
        {tab==='register' && <Register onRegistered={()=>setTab('login')} />}
        {tab==='chat' && <Chat/>}
        {tab==='admin' && <AdminPanel/>}
      </div>
    </div>
  )
}
