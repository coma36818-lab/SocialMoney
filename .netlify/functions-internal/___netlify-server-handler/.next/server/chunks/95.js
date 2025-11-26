exports.id=95,exports.ids=[95],exports.modules={7935:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i});let i=(0,r(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/home/user/studio/src/app/likeflow/layout.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/home/user/studio/src/app/likeflow/layout.tsx","default")},27148:(e,t,r)=>{Promise.resolve().then(r.bind(r,52049))},40300:(e,t,r)=>{Promise.resolve().then(r.bind(r,7935))},40880:(e,t,r)=>{"use strict";r.d(t,{BH:()=>u,AU:()=>m,wu:()=>d,pt:()=>p});let i={projectId:"studio-8742723834-1421e",appId:"1:665625375719:web:d680c46b80cd64e3578342",apiKey:"AIzaSyAX1j0On74HzyDrwRIrnRIcZPHDICBN-M0",authDomain:"studio-8742723834-1421e.firebaseapp.com",measurementId:"",messagingSenderId:"665625375719"};var a=r(67989),o=r(57782),n=r(75535),s=r(70146);r(60687),r(43210);let l=function(){let e={};return{on(t,r){e[t]||(e[t]=[]),e[t]?.push(r)},off(t,r){e[t]&&(e[t]=e[t]?.filter(e=>e!==r))},emit(t,r){e[t]&&e[t]?.forEach(e=>e(r))}}}();class c extends Error{constructor(e){let t=function(e){let t=null;try{let e=(0,o.xI)().currentUser;e&&(t=function(e){if(!e)return null;let t={name:e.displayName,email:e.email,email_verified:e.emailVerified,phone_number:e.phoneNumber,sub:e.uid,firebase:{identities:e.providerData.reduce((e,t)=>(t.providerId&&(e[t.providerId]=[t.uid]),e),{}),sign_in_provider:e.providerData[0]?.providerId||"custom",tenant:e.tenantId}};return{uid:e.uid,token:t}}(e))}catch{}return{auth:t,method:e.operation,path:`/databases/(default)/documents/${e.path}`,resource:e.requestResourceData?{data:e.requestResourceData}:void 0}}(e);super(`Missing or insufficient permissions: The following request was denied by Firestore Security Rules:
${JSON.stringify(t,null,2)}`),this.name="FirebaseError",this.request=t}}function d(e,t,r){(0,n.BN)(e,t,r).catch(r=>{l.emit("permission-error",new c({path:e.path,operation:"write",requestResourceData:t}))})}function u(e,t){return(0,n.gS)(e,t).catch(r=>{l.emit("permission-error",new c({path:e.path,operation:"create",requestResourceData:t}))})}function p(e,t){(0,n.mZ)(e,t).catch(r=>{l.emit("permission-error",new c({path:e.path,operation:"update",requestResourceData:t}))})}function m(){if(!(0,a.Dk)().length){let e;try{e=(0,a.Wp)(i)}catch(t){console.warn("Automatic initialization failed. Falling back to firebase config object.",t),e=(0,a.Wp)(i)}return f(e)}return f((0,a.Sx)())}function f(e){return{firebaseApp:e,auth:(0,o.xI)(e),firestore:(0,n.aU)(e),storage:(0,s.c7)(e)}}},52049:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>w});var i=r(60687);r(43210);var a=r(85814),o=r.n(a),n=r(24026),s=r(83729),l=r(52831),c=r(53098),d=r(83113),u=r(97905),p=r(9623),m=r(16189),f=r(39091),h=r(8693),x=r(77034);let b=[{name:"Feed",icon:n.A,page:"/likeflow/feed"},{name:"Crea",icon:s.A,page:"/likeflow/upload"},{name:"Shop",icon:l.A,page:"/likeflow/purchase"},{name:"Top",icon:c.A,page:"/likeflow/top"}],g=new f.E;function w({children:e}){let{wallet:t}=(0,p.v)(),r=(0,m.usePathname)();return(0,i.jsx)(h.Ht,{client:g,children:(0,i.jsxs)("div",{className:"min-h-[100dvh] bg-black",children:[(0,i.jsx)("style",{children:`
            :root {
              --background: 0 0% 0%;
              --foreground: 0 0% 100%;
              --primary: 51 100% 50%;
              --primary-foreground: 0 0% 0%;
              --muted: 0 0% 15%;
              --muted-foreground: 0 0% 65%;
              --border: 51 100% 50%;
              --input: 0 0% 15%;
              --ring: 51 100% 50%;
            }
            
            * {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            *::-webkit-scrollbar {
              display: none;
            }
            
            html, body {
              background-color: #000;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              overscroll-behavior: none;
            }

            .mirror-text {
              display: flex;
              flex-direction: column;
              line-height: 1;
            }
            
            .mirror-reflection {
              transform: scaleY(-1);
              background: linear-gradient(to bottom, rgba(255,215,0,0.6) 0%, transparent 80%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              opacity: 0.4;
              filter: blur(0.5px);
            }
          `}),(0,i.jsx)(x.j,{}),(0,i.jsx)("main",{className:"h-[100dvh]",children:e}),(0,i.jsxs)("nav",{className:"fixed bottom-0 left-0 right-0 z-50",children:[(0,i.jsx)("div",{className:"absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"}),(0,i.jsxs)("div",{className:"relative flex items-center justify-around h-20 max-w-md mx-auto px-4 pb-4",children:[b.map(e=>{let t=e.icon,a=r===e.page;return(0,i.jsxs)(o(),{href:e.page,className:"relative flex flex-col items-center justify-center group",children:[(0,i.jsxs)(u.P.div,{whileTap:{scale:.85},className:"relative",children:[a&&(0,i.jsx)(u.P.div,{layoutId:"activeGlow",className:"absolute -inset-3 bg-[#FFD700]/20 rounded-2xl blur-lg"}),(0,i.jsx)("div",{className:`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${a?"bg-gradient-to-br from-[#FFD700] to-[#B8860B]":"bg-white/5 hover:bg-white/10"}`,children:(0,i.jsx)(t,{className:`w-6 h-6 transition-all ${a?"text-black":"text-white"}`,strokeWidth:a?2.5:1.5})})]}),(0,i.jsx)("span",{className:`text-[10px] mt-1.5 font-medium transition-colors ${a?"text-[#FFD700]":"text-gray-400"}`,children:e.name})]},e.page)}),(0,i.jsxs)(o(),{href:"/likeflow/wallet",className:"relative flex flex-col items-center justify-center group",children:[(0,i.jsx)(u.P.div,{whileTap:{scale:.85},children:(0,i.jsx)("div",{className:`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${"/likeflow/wallet"===r?"bg-gradient-to-br from-purple-500 to-purple-600":"bg-white/5 hover:bg-white/10"}`,children:(0,i.jsx)(d.A,{className:`w-6 h-6 transition-all ${"/likeflow/wallet"===r?"text-white":"text-purple-400"}`,strokeWidth:"/likeflow/wallet"===r?2.5:1.5})})}),(0,i.jsx)("span",{className:`text-[10px] mt-1.5 font-medium transition-colors ${"/likeflow/wallet"===r?"text-purple-400":"text-gray-400"}`,children:"Wallet"})]})]})]})]})})}},70440:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>a});var i=r(31658);let a=async e=>[{type:"image/x-icon",sizes:"500x500",url:(0,i.fillMetadataSegment)(".",await e.params,"favicon.ico")+""}]}};