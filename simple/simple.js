(()=>{var C=w=>{let o,t,x="elab-drop",g="elab-dropup",H="elab-dropdown",L="data-value",d="data-selected",A="data-disabled",D="data-placeholder",m=".elab",a="input[type=checkbox]",E="li.elab-option",f=document.createElement("li");f.className="elab-option",f.innerHTML=w.template;let O=e=>e?.nextElementSibling,S=e=>e?.previousElementSibling,v=e=>{let n=[];for(let s of e.firstElementChild.children){let l=s.getAttribute(L);l&&s.hasAttribute(d)&&n.push(l)}return n},R=e=>e.dispatchEvent(new CustomEvent("change",{bubbles:!0,detail:{values:v(e)}})),b=()=>{if(o&&t){let e=o.getBoundingClientRect();t.style.left=o.offsetLeft+"px",t.style.width=o.offsetWidth+"px",t.classList.contains(g)?(t.style.maxHeight=e.top-8+"px",t.style.top=o.offsetTop-t.offsetHeight+"px"):(t.style.maxHeight=window.innerHeight-e.bottom-20+"px",t.style.top=o.offsetTop+o.offsetHeight+"px")}},r=()=>{o&&!o.dispatchEvent(new CustomEvent("close",{bubbles:!0,cancelable:!0,detail:{values:v(o)}}))||(o?.focus(),t?.remove(),o=t=void 0)},k=e=>{let n=e.target.closest(E);n&&n.querySelector(a)?.focus()},B=e=>{let n=e.target;if(!o||!n.matches(a))return;let s=n.closest(E),l=[...e.currentTarget.children].indexOf(s),i=o.firstElementChild.children[l];n.checked?i?.setAttribute(d,""):i?.removeAttribute(d),b(),R(o),e.stopPropagation()},I=e=>{let n=e.target;if(!n.matches(a))return;let s=e.keyCode;if(s===38||s===40){e.preventDefault();let l=s===38?S:O;for(let i=l(n.closest(E));i;i=l(i)){let p=i.querySelector(a);if(!p?.disabled){p?.focus();break}}}},h=e=>{if(o===e)return;o&&r();let n=window.innerHeight,{left:s,top:l,bottom:i,width:p}=e.getBoundingClientRect();t=e.parentElement.insertBefore(document.createElement("ul"),e),o=e;for(let c of e.firstElementChild.cloneNode(!0).children){if(c.hasAttribute(D))continue;let T=t.appendChild(f.cloneNode(!0));for(let y of c.getAttributeNames())T.setAttribute(y,c.getAttribute(y));let u=T.querySelector(a);u&&(u.value=c.getAttribute(L),u.checked=c.hasAttribute(d),u.disabled=c.hasAttribute(A)),T.getElementsByTagName("slot")[0]?.replaceWith(...c.childNodes)}t.addEventListener("pointerover",k),t.addEventListener("change",B),t.addEventListener("keydown",I),t.className=x+" "+(l*1.75>n&&i+t.offsetHeight>n?g:H),b(),t.style.left=s+"px",t.style.width=p+"px",setTimeout(()=>t?.getElementsByTagName("input")[0]?.focus())};addEventListener("resize",b),addEventListener("pointerdown",e=>{let n=e.target,s=n.closest(m);s?s===o?r():h(s):t&&!t.contains(n)&&r()}),addEventListener("keydown",e=>{let n=e.target,s=e.keyCode;s===32&&n.matches(m)?(e.preventDefault(),n===t?r():h(n)):(s===38||s===40)&&n.matches(m)?(e.preventDefault(),h(n)):s===27&&t&&(e.preventDefault(),r())})};C({template:"<label class=elab-label><input class=elab-checkbox type=checkbox><div class=elab-content><slot></slot></div></label>"});})();
