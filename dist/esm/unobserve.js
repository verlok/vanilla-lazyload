const e=(e,n)=>{if(!n)return;const r=n._observer;r&&r.unobserve(e)},n=e=>{e.disconnect()},r=(n,r,o)=>{r.unobserve_entered&&e(n,o)};export{n as resetObserver,e as unobserve,r as unobserveEntered};
