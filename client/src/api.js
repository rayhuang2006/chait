const API = '/api';

export function setToken(token){
  localStorage.setItem('token', token);
}
export function getToken(){
  return localStorage.getItem('token');
}
export function authHeader(){
  const t = getToken();
  return t ? { 'Authorization': `Bearer ${t}` } : {};
}

export async function register(username, password){
  const r = await fetch(`${API}/auth/register`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password})
  });
  return r.json();
}
export async function login(username, password){
  const r = await fetch(`${API}/auth/login`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password})
  });
  return r.json();
}
export async function listCharacters(){
  const r = await fetch(`${API}/chat/characters`, { headers: { ...authHeader() } });
  return r.json();
}
export async function createConversation(characterId){
  const r = await fetch(`${API}/chat/conversation`, {
    method:'POST', headers:{'Content-Type':'application/json', ...authHeader()},
    body: JSON.stringify({ characterId })
  });
  return r.json();
}
export async function listConversations(){
  const r = await fetch(`${API}/chat/conversations`, { headers: { ...authHeader() } });
  return r.json();
}
export async function getMessages(convoId){
  const r = await fetch(`${API}/chat/conversation/${convoId}/messages`, { headers: { ...authHeader() } });
  return r.json();
}
export async function sendMessage(convoId, text){
  const r = await fetch(`${API}/chat/conversation/${convoId}/send`, {
    method:'POST', headers:{'Content-Type':'application/json', ...authHeader()},
    body: JSON.stringify({ text })
  });
  return r.json();
}

// admin
export async function adminListCharacters(){
  const r = await fetch(`${API}/admin/characters`, { headers: { ...authHeader() } });
  return r.json();
}
export async function adminCreateCharacter(payload){
  const r = await fetch(`${API}/admin/characters`, {
    method:'POST', headers:{'Content-Type':'application/json', ...authHeader()},
    body: JSON.stringify(payload)
  });
  return r.json();
}
export async function adminUpdateCharacter(id, payload){
  const r = await fetch(`${API}/admin/characters/${id}`, {
    method:'PUT', headers:{'Content-Type':'application/json', ...authHeader()},
    body: JSON.stringify(payload)
  });
  return r.json();
}
export async function adminDeleteCharacter(id){
  const r = await fetch(`${API}/admin/characters/${id}`, {
    method:'DELETE', headers:{ ...authHeader() }
  });
  return r.json();
}
