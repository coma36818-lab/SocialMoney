(()=>{var e={};e.id=80,e.ids=[80],e.modules={3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},7935:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>o});let o=(0,r(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/home/user/studio/src/app/likeflow/layout.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/home/user/studio/src/app/likeflow/layout.tsx","default")},10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},24756:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>o});let o=(0,r(12907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/home/user/studio/src/app/likeflow/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/home/user/studio/src/app/likeflow/page.tsx","default")},27148:(e,t,r)=>{Promise.resolve().then(r.bind(r,52049))},28443:(e,t,r)=>{Promise.resolve().then(r.bind(r,24756))},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},40300:(e,t,r)=>{Promise.resolve().then(r.bind(r,7935))},46653:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>l.a,__next_app__:()=>u,pages:()=>c,routeModule:()=>p,tree:()=>d});var o=r(65239),s=r(48088),i=r(88170),l=r.n(i),n=r(30893),a={};for(let e in n)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(a[e]=()=>n[e]);r.d(t,a);let d={children:["",{children:["likeflow",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,24756)),"/home/user/studio/src/app/likeflow/page.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,7935)),"/home/user/studio/src/app/likeflow/layout.tsx"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,70440))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(r.bind(r,94431)),"/home/user/studio/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,57398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(r.t.bind(r,89999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(r.t.bind(r,65284,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(r.bind(r,70440))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]}.children,c=["/home/user/studio/src/app/likeflow/page.tsx"],u={require:r,loadChunk:()=>Promise.resolve()},p=new o.AppPageRouteModule({definition:{kind:s.RouteKind.APP_PAGE,page:"/likeflow/page",pathname:"/likeflow",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},52049:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>g});var o=r(60687);r(43210);var s=r(85814),i=r.n(s),l=r(24026),n=r(83729),a=r(52831),d=r(53098),c=r(83113),u=r(97905),p=r(9623),f=r(16189),m=r(39091),x=r(8693),h=r(77034);let b=[{name:"Feed",icon:l.A,page:"/likeflow/feed"},{name:"Crea",icon:n.A,page:"/likeflow/upload"},{name:"Shop",icon:a.A,page:"/likeflow/purchase"},{name:"Top",icon:d.A,page:"/likeflow/top"}],v=new m.E;function g({children:e}){let{wallet:t}=(0,p.v)(),r=(0,f.usePathname)();return(0,o.jsx)(x.Ht,{client:v,children:(0,o.jsxs)("div",{className:"min-h-[100dvh] bg-black",children:[(0,o.jsx)("style",{children:`
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
          `}),(0,o.jsx)(h.j,{}),(0,o.jsx)("main",{className:"h-[100dvh]",children:e}),(0,o.jsxs)("nav",{className:"fixed bottom-0 left-0 right-0 z-50",children:[(0,o.jsx)("div",{className:"absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"}),(0,o.jsxs)("div",{className:"relative flex items-center justify-around h-20 max-w-md mx-auto px-4 pb-4",children:[b.map(e=>{let t=e.icon,s=r===e.page;return(0,o.jsxs)(i(),{href:e.page,className:"relative flex flex-col items-center justify-center group",children:[(0,o.jsxs)(u.P.div,{whileTap:{scale:.85},className:"relative",children:[s&&(0,o.jsx)(u.P.div,{layoutId:"activeGlow",className:"absolute -inset-3 bg-[#FFD700]/20 rounded-2xl blur-lg"}),(0,o.jsx)("div",{className:`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${s?"bg-gradient-to-br from-[#FFD700] to-[#B8860B]":"bg-white/5 hover:bg-white/10"}`,children:(0,o.jsx)(t,{className:`w-6 h-6 transition-all ${s?"text-black":"text-white"}`,strokeWidth:s?2.5:1.5})})]}),(0,o.jsx)("span",{className:`text-[10px] mt-1.5 font-medium transition-colors ${s?"text-[#FFD700]":"text-gray-400"}`,children:e.name})]},e.page)}),(0,o.jsxs)(i(),{href:"/likeflow/wallet",className:"relative flex flex-col items-center justify-center group",children:[(0,o.jsx)(u.P.div,{whileTap:{scale:.85},children:(0,o.jsx)("div",{className:`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${"/likeflow/wallet"===r?"bg-gradient-to-br from-purple-500 to-purple-600":"bg-white/5 hover:bg-white/10"}`,children:(0,o.jsx)(c.A,{className:`w-6 h-6 transition-all ${"/likeflow/wallet"===r?"text-white":"text-purple-400"}`,strokeWidth:"/likeflow/wallet"===r?2.5:1.5})})}),(0,o.jsx)("span",{className:`text-[10px] mt-1.5 font-medium transition-colors ${"/likeflow/wallet"===r?"text-purple-400":"text-gray-400"}`,children:"Wallet"})]})]})]})]})})}},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},65758:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l});var o=r(60687),s=r(95282),i=r.n(s);function l(){return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(i(),{children:(0,o.jsx)("title",{children:"LikeFlow"})}),(0,o.jsx)("div",{className:"container mx-auto px-4 py-12",children:(0,o.jsx)("h1",{className:"text-4xl font-bold text-center text-white",children:"Redirecting to LikeFlow..."})})]})}r(43210)},70440:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});var o=r(31658);let s=async e=>[{type:"image/x-icon",sizes:"500x500",url:(0,o.fillMetadataSegment)(".",await e.params,"favicon.ico")+""}]},79551:e=>{"use strict";e.exports=require("url")},88531:(e,t,r)=>{Promise.resolve().then(r.bind(r,65758))},95282:(e,t)=>{"use strict";function r(){return null}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return r}}),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[447,446,658,841,993],()=>r(46653));module.exports=o})();