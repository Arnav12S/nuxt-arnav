import{d,x as m,D as b,S as f,H as g,c as x,L as v,w as s,i as n,a9 as e,n as o,f as _,t as i,bu as y,bv as C,bw as h,I as S,E as w}from"./M65vgERd.js";import{r as k}from"./8ciQTZXT.js";import"./CxYJgpPD.js";const I=d({__name:"Collapsible",props:{name:{type:String,default:"properties"},openText:{type:String,default:"Show"},closeText:{type:String,default:"Hide"}},setup(a){const l=m(),c=b(()=>({button:{base:"flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",icon:{name:l.ui.icons.chevron,base:"w-4 h-4 transform transition-transform duration-200",active:"",inactive:"-rotate-90"}},panel:"mt-4 ml-2 py-2.5 pl-4 border-l border-gray-200 dark:border-gray-800 [&>div]:!mt-0"})),{ui:t}=f("content.collapsible",void 0,c,void 0,!0);return g(()=>S()),(p,T)=>{const u=w;return x(),v(e(h),{as:"div"},{default:s(({open:r})=>[n(e(y),{class:o(e(t).button.base)},{default:s(()=>[n(u,{name:e(t).button.icon.name,class:o([e(t).button.icon.base,r?e(t).button.icon.active:e(t).button.icon.inactive])},null,8,["name","class"]),_("span",null,i(r?a.closeText:a.openText)+" "+i(a.name),1)]),_:2},1032,["class"]),n(e(C),{class:o(e(t).panel)},{default:s(()=>[k(p.$slots,"default",{unwrap:"p"})]),_:3},8,["class"])]),_:3})}}}),D=Object.assign(I,{__name:"Collapsible"});export{D as default};
