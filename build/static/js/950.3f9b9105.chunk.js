(self.webpackChunkavax_minting=self.webpackChunkavax_minting||[]).push([[950],{66017:(n,r,e)=>{"use strict";e.r(r),e.d(r,{getED25519Key:()=>s});var t=e(99130),a=e.n(t),f=e(30261).Buffer;const i=a().lowlevel;function s(n){let r;r="string"===typeof n?f.from(n,"hex"):n;const e=new Uint8Array(64),t=[i.gf(),i.gf(),i.gf(),i.gf()],a=new Uint8Array([...new Uint8Array(r),...new Uint8Array(32)]),s=new Uint8Array(32);i.crypto_hash(e,a,32),e[0]&=248,e[31]&=127,e[31]|=64,i.scalarbase(t,e),i.pack(s,t);for(let f=0;f<32;f+=1)a[f+32]=s[f];return{sk:f.from(a),pk:f.from(s)}}},78848:()=>{}}]);
//# sourceMappingURL=950.3f9b9105.chunk.js.map