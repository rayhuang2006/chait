import React, { useEffect, useState } from 'react';
import { listCharacters, createConversation, listConversations, getMessages, sendMessage } from '../api.js';
import CharacterPicker from './CharacterPicker.jsx';

export default function Chat(){
  const [characters,setCharacters] = useState([]);
  const [selected,setSelected] = useState(null);
  const [convos,setConvos] = useState([]);
  const [currentId,setCurrentId] = useState(null);
  const [messages,setMessages] = useState([]);
  const [text,setText] = useState('');
  const [loading,setLoading] = useState(false);

  useEffect(()=>{
    (async ()=>{
      const chars = await listCharacters();
      setCharacters(chars || []);
      const c = await listConversations();
      setConvos(c || []);
      if(c && c.length){
        setCurrentId(c[0].id);
      }
    })();
  },[]);

  useEffect(()=>{
    (async ()=>{
      if(currentId){
        const m = await getMessages(currentId);
        setMessages(m || []);
      }
    })();
  },[currentId]);

  async function startConversation(){
    if(!selected) return;
    const conv = await createConversation(selected);
    setConvos([{...conv, character_name: characters.find(x=>x.id===selected)?.name}, ...convos]);
    setCurrentId(conv.id);
    setMessages([]);
  }

  async function send(){
    if(!text.trim()) return;
    const my = text;
    setText('');
    setMessages([...messages, { role:'user', content:my }]);
    setLoading(true);
    const r = await sendMessage(currentId, my);
    setLoading(false);
    if(r.reply){
      setMessages(m => [...m, { role:'assistant', content:r.reply }]);
    }
  }

  return (
    <div className="chat">
      <div className="sidebar">
        <h3>角色</h3>
        <CharacterPicker characters={characters} selectedId={selected} onSelect={setSelected}/>
        <div className="row" style={{marginTop:10}}>
          <button className="button" onClick={startConversation}>建立新對話</button>
        </div>
        <hr/>
        <h3>我的對話</h3>
        <div className="col">
          {convos.map(c => (
            <div key={c.id} className="chip" onClick={()=>setCurrentId(c.id)}>
              <span className="avatar">{c.avatar || '💬'}</span>
              <div><b>{c.character_name || '對話'}</b><div style={{fontSize:12, color:'#666'}}>{c.created_at}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="main">
        <div className="card" style={{minHeight:400}}>
          <h3>對話</h3>
          <div>
            {messages.map((m,idx) => (
              <div key={idx} className={`msg ${m.role}`}>
                <div className="avatar">{m.role==='user' ? '🧑' : m.role==='assistant' ? '🤖' : '🔧'}</div>
                <div className="bubble">{m.content}</div>
              </div>
            ))}
            {loading && <div className="msg assistant"><div className="avatar">🤖</div><div className="bubble">思考中...</div></div>}
          </div>
        </div>
        <div className="row" style={{marginTop:10}}>
          <textarea className="input" rows="3" placeholder="輸入訊息..." value={text} onChange={e=>setText(e.target.value)} style={{flex:1}}/>
          <button className="button" onClick={send} disabled={!currentId}>送出</button>
        </div>
      </div>
    </div>
  );
}

