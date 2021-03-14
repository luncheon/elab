import{mdiCheckboxBlankOffOutline as _,mdiCheckboxBlankOutline as U,mdiCheckboxMarked as N,mdiMinusBox as q}from"@mdi/js";import P from"ripplet.js/es/ripplet-declarative";var C=(s,l)=>{let m=document.createElement("template");m.innerHTML=s;let E=m.content.firstElementChild;return E.classList.add(l),()=>E.cloneNode(!0)},M=s=>s.map(l=>l.checkbox.checked&&l.barItem.getAttribute("data-value")).filter(Boolean),A=s=>{let l,m="elab-popup-dropup",E="elab-popup-dropdown",T="data-selected",S="data-disabled",w="data-selected-all",B="data-placeholder",L=".elab",u="input[type=checkbox]",I=".elab-popup-item",O=C(s.popupTemplate,"elab-popup"),R=C(s.popupItemTemplate,"elab-popup-item"),y=(e,n)=>{e.checkbox.disabled||(e.checkbox.checked=n,e.barItem.toggleAttribute(T,n),e.popupItem.toggleAttribute(T,n))},H=(e,n)=>{if(e){let t=n.every(({checkbox:c})=>c.disabled||!c.checked);e.checkbox.checked=!t,e.checkbox.indeterminate=!t&&!n.every(({checkbox:c})=>c.disabled||c.checked)}},g=(e,n)=>{let t=n.getBoundingClientRect();e.style.left=n.offsetLeft+"px",e.style.width=n.offsetWidth+"px",e.classList.contains(m)?(e.style.maxHeight=t.top-8+"px",e.style.top=n.offsetTop-e.offsetHeight+"px"):(e.style.maxHeight=window.innerHeight-t.bottom-20+"px",e.style.top=n.offsetTop+n.offsetHeight+"px")},b=()=>{l?.bar.dispatchEvent(new CustomEvent("close",{bubbles:!0,cancelable:!0,detail:{values:M(l.items)}}))&&(l.bar.focus(),l.popup.remove(),l=void 0)},D=(e,n)=>{let t=[],c;for(let o of e.firstElementChild.children){if(o.hasAttribute(B))continue;let p=n.appendChild(R());for(let a of o.getAttributeNames())p.setAttribute(a,o.getAttribute(a));p.querySelector("slot").replaceWith(...o.cloneNode(!0).childNodes);let d=p.querySelector(u);d&&(o.hasAttribute(w)?c={barItem:o,popupItem:p,checkbox:d}:(d.checked=o.hasAttribute(T),d.disabled=o.hasAttribute(S),t.push({barItem:o,popupItem:p,checkbox:d})))}return H(c,t),[t,c]},k=e=>{if(l?.bar===e)return;l&&b();let n=e.getBoundingClientRect(),t=O(),c=t.querySelector("slot"),[o,p]=D(e,c.parentElement);c.remove(),l={bar:e,popup:t,items:o,itemSelectedAll:p},e.parentElement.insertBefore(t,e),t.classList.add(n.top*1.75>window.innerHeight&&n.bottom+t.offsetHeight>window.innerHeight?m:E),g(t,e),t.style.left=n.left+"px",t.style.width=n.width+"px";let d=(a,i)=>{if(a===p?.checkbox){for(let r of o)y(r,i);p.checkbox.checked=i,p.checkbox.indeterminate=!1}else{let r=o.find(f=>f.checkbox===a);if(!r)return;y(r,i),H(p,o)}g(t,e),e.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{values:M(o)}}))};t.addEventListener("pointerover",a=>a.target.closest(I)?.querySelector(u)?.focus()),t.addEventListener("change",a=>{let i=a.target;i.matches(u)&&(d(i,i.checked),a.stopPropagation())}),t.addEventListener("keydown",a=>{let i=a.target;if(!i.matches(u))return;let r=a.keyCode;if(r===38||r===40){a.preventDefault();let f=r===38?"previousElementSibling":"nextElementSibling";for(let h=i.closest(I)?.[f];h;h=h[f]){let v=h.querySelector(u);if(!v?.disabled){v?.focus();break}}}else r===13&&(a.preventDefault(),d(i,!i.checked))}),setTimeout(()=>t.getElementsByTagName("input")[0]?.focus())};addEventListener("resize",()=>l&&g(l.popup,l.bar)),addEventListener("pointerdown",e=>{let n=e.target,t=n.closest(L);t?t===l?.bar?b():k(t):l&&(l.popup.contains(n)?e.preventDefault():b())}),addEventListener("keydown",e=>{let n=e.target,t=e.keyCode;t===27&&l?(e.preventDefault(),b()):t===32&&n.matches(L)?(e.preventDefault(),n===l?.popup?b():k(n)):(t===38||t===40)&&n.matches(L)&&(e.preventDefault(),k(n))})};A({popupTemplate:"<ul><slot></slot></ul>",popupItemTemplate:`<li><label class=elab-label data-ripplet="append-to: parent; color: var(--elab-color);">
<div class=elab-label-background></div>
<input class=elab-checkbox type=checkbox>
<svg class=elab-checkbox-icon viewBox="0 0 24 24" data-ripplet="append-to: parent; opacity: .2; centered: true;">
  <path class=elab-checkbox-icon-unchecked d="${U}" />
  <path class=elab-checkbox-icon-disabled d="${_}" />
  <path class=elab-checkbox-icon-checked d="${N}" />
  <path class=elab-checkbox-icon-indeterminate d="${q}" />
</svg>
<div class=elab-content><slot></slot></div>
</label></li>`});var x=s=>{let l=s.target.closest(".elab");l&&P.clear(l)};addEventListener("pointerup",x);addEventListener("pointerout",x);addEventListener("pointercancel",x);addEventListener("pointerdown",s=>{let l=s.target.closest(".elab");l&&P({currentTarget:l,clientX:s.clientX,clientY:s.clientY},{appendTo:"parent",clearing:!1,color:"var(--elab-color)"})});