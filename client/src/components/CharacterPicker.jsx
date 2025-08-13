import React from 'react';

export default function CharacterPicker({ characters, selectedId, onSelect }){
  return (
    <div className="chips">
      {characters.map(c => (
        <div key={c.id} className="chip" onClick={()=>onSelect(c.id)} style={{background:c.color || '#fff'}}>
          <span className="avatar">{c.avatar || '🙂'}</span>
          <b>{c.name}</b>
          {selectedId===c.id && <span> ✅</span>}
        </div>
      ))}
    </div>
  )
}
