import cfg from './config.js';
const $=s=>document.querySelector(s);
const ok=cfg&&cfg.apiKey&&!cfg.apiKey.startsWith('YOUR');
if(!ok){window.cloud={on:false}}else{
const A='https://www.gstatic.com/firebasejs/10.14.1/';
const [{initializeApp},{getAuth,GoogleAuthProvider,signInWithPopup,signInWithRedirect,getRedirectResult,onAuthStateChanged,signOut},{initializeFirestore,persistentLocalCache,doc,getDoc,setDoc}]=await Promise.all([import(A+'firebase-app.js'),import(A+'firebase-auth.js'),import(A+'firebase-firestore.js')]);
const app=initializeApp(cfg),auth=getAuth(app),db=initializeFirestore(app,{localCache:persistentLocalCache()});
let ref=null,ready=false,timer,cur=null;
const cloud=window.cloud={on:true,user:null,status:''};
const st=t=>{cloud.status=t;if(document.querySelector('.card .sm.x'))render()};
const prov=new GoogleAuthProvider();
cloud.login=async()=>{$('#gerr').textContent='';
  try{await signInWithPopup(auth,prov)}
  catch(e){if(e.code=='auth/popup-blocked'){signInWithRedirect(auth,prov)}else if(e.code!='auth/cancelled-popup-request'&&e.code!='auth/popup-closed-by-user'){$('#gerr').textContent='লগইন হয়নি। নেট দেখে আবার চেষ্টা করুন।'}}};
cloud.logout=()=>signOut(auth);
getRedirectResult(auth).catch(()=>{});
async function load(){
  try{const s=await getDoc(ref);
    if(s.exists())hs.set(JSON.parse(s.data().d));else await setDoc(ref,{d:JSON.stringify(hs.get()),u:Date.now()});
    ready=true;st('সেভ আছে ✓')}
  catch(e){ready=false;st('অফলাইন: নেট এলে ডেটা লোড হবে')}
}
window.addEventListener('online',()=>{if(cur&&!ready)load()});
window.onSave=()=>{if(!ready)return;clearTimeout(timer);st('সেভ হচ্ছে…');
  timer=setTimeout(async()=>{try{await setDoc(ref,{d:JSON.stringify(hs.get()),u:Date.now()});st('সেভ আছে ✓')}catch(e){st('নেট এলে সেভ হবে')}},700)};
onAuthStateChanged(auth,async u=>{cur=u;cloud.user=u;
  if(!u){ref=null;ready=false;$('#gate').hidden=false;render();return}
  ref=doc(db,'users',u.uid);await load();$('#gate').hidden=true;render()});
}
