(this["webpackJsonpklima-app"]=this["webpackJsonpklima-app"]||[]).push([[0],{102:function(e,t,a){},104:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a.n(n),c=a(15),i=a.n(c),o=(a(58),a(4)),l=a(3);a(59);function u(e){var t=Object(n.useRef)(),a=Object(n.useRef)(),c=Object(n.useRef)(),i=Object(n.useRef)(),u=m(t),h=u.width,p=u.height,E=Object(n.useState)([]),O=Object(o.a)(E,2),j=O[0],M=O[1],N=Object(n.useState)([0,0]),y=Object(o.a)(N,2),S=y[0],k=y[1],D=Object(n.useState)(null),w=Object(o.a)(D,2),C=w[0],x=w[1],A=Object(n.useState)(null),Y=Object(o.a)(A,2),R=Y[0],P=Y[1],B=Object(n.useState)(!1),z=Object(o.a)(B,2),F=z[0],J=z[1],H=Object(n.useState)(null),I=Object(o.a)(H,2),L=I[0],T=I[1];function K(t,a){T(t);var n=void 0===t[1]?"Kein Wert":function(e){var t=e.toString().split(".",2),a=0;t.length>1&&(a=t[1]);var n="00"+a,r=n.substr(n.length-2);return t[0]+"."+r}(t[1])+" "+e.unit;e.activeDot([{day:b(t[0],"day"),time:b(t[0],"minute")},n],a)}return e.margin||(e.margin={left:40,right:30,top:40,bottom:35}),Object(n.useEffect)((function(){var t=e.data.map((function(t){return[new Date(t.time),t[e.dataProperty]]}));if(M(t),x(l.e(t,(function(e){return e[0]}))),P(l.d(t,(function(e){return e[0]}))),e.minMax(l.e(e.data,(function(t){return t[e.dataProperty]}))+" "+e.unit,l.d(e.data,(function(t){return t[e.dataProperty]}))+" "+e.unit),e.defaultYRange){var a=l.e(e.data,(function(t){return t[e.dataProperty]}))<e.defaultYRange[0]?Math.floor(l.e(e.data,(function(t){return t[e.dataProperty]}))):e.defaultYRange[0],n=l.d(e.data,(function(t){return t[e.dataProperty]}))>e.defaultYRange[1]?Math.ceil(l.d(e.data,(function(t){return t[e.dataProperty]}))):e.defaultYRange[1];k([a,n])}}),[e.data,h]),Object(n.useEffect)((function(){void 0!==C&&void 0!==R&&0!==e.data.length?(!function(){var t=h-(e.margin.left+e.margin.right),n=p-(e.margin.top+e.margin.bottom),r=function(e){if(e<1)return[[],[],""];var t,a,n,r,c=0,i=0,u=0,m=0;t="minute";var h=s(e,C,R),b=Object(o.a)(h,3);if(n=b[0],a=b[1],r=b[2],a>60){a=0,t="hour";var p=d(e,C,R),E=Object(o.a)(p,3);if(n=E[0],m=E[1],r=E[2],l.i.count(n[0],n[1])>1){m=0,t="day";var O=f(e,C,R),j=Object(o.a)(O,3);if(n=j[0],u=j[1],r=j[2],u>16){u=0,t="month";var M=g(e,C,R),N=Object(o.a)(M,3);if(n=N[0],i=N[1],r=N[2],l.n.count(n[0],n[1])>1){var y=v(e,C,R),S=Object(o.a)(y,3);n=S[0],c=S[1],r=S[2]}}}}for(var k=new Array(r+1),D=0;D<=r;D++)k[D]=new Date(n[0].getFullYear()+D*c,n[0].getMonth()+D*i,n[0].getDate()+D*u,n[0].getHours()+D*m,n[0].getMinutes()+D*a);return[k,n,t]}(function(e){return Math.floor(e/60)}(t)),u=Object(o.a)(r,3),m=u[0],E=u[1],O=u[2],M=l.g().domain(E).range([0,t]),N=l.f().domain(S).range([n,0]),y=l.a(M).tickFormat((function(e){return b(e,O)})).tickPadding(10).tickSize(-n).tickValues(m),k=l.b(N).ticks(5).tickPadding(20);l.h(c.current).attr("transform","translate(".concat(0,", ",n,")")).call(y);var D=l.h(i.current).call(k);D.selectAll("line").remove(),D.select(".domain").remove();var w={x:0,y:0},x=j.filter((function(e,t){if(0===t)return!0;var a=Math.ceil(M(e[0]))-w.x,n=Math.ceil(N(e[1]))-w.y;return(a>10||n>10)&&(w.x=Math.ceil(M(e[0])),w.y=Math.ceil(N(e[1])),!0)}));if(l.h(a.current).selectAll("circle").filter((function(e,t,a){return!a[t].hasAttribute("id")||"activeDot"!==a[t].id})).data(x).join("circle").attr("cx",(function(e){return M(e[0])})).attr("cy",(function(e){return N(e[1])})).attr("r",5).classed("dot",!0).on("mouseover",(function(e){return K(e,l.c.target)})).on("click",(function(e){return K(e,l.c.target)})),L){var A=window.document.getElementById("activeDot");l.h(A).attr("cx",M(L[0])).attr("cy",N(L[1])),A&&A.parentNode&&A.parentNode.appendChild(A)}}(),J(!1)):0===e.data.length&&J(!0)}),[h,p,j,F,L]),r.a.createElement("div",{className:"svgContainer",ref:t},!1===F?r.a.createElement("svg",{height:"100%",width:"100%"},r.a.createElement("g",{transform:"translate(".concat(e.margin.left,",").concat(e.margin.top,")")},r.a.createElement("text",{x:"-30",y:"-20",textAnchor:"middle",className:"yLabel"},e.unit),r.a.createElement("g",{ref:c,className:"xAxis"}),r.a.createElement("g",{ref:i,className:"yAxis"}),r.a.createElement("g",{ref:a}))):r.a.createElement("div",{className:"dataError"},r.a.createElement("p",{className:"center"},"F\xfcr den Zeitraum liegen keine Daten vor")))}var m=function(e){var t=function(){return{width:e.current.offsetWidth,height:e.current.offsetHeight}},a=Object(n.useState)({width:0,height:0}),r=Object(o.a)(a,2),c=r[0],i=r[1];return Object(n.useEffect)((function(){var a=function(){return i(t())};return e.current&&i(t()),window.addEventListener("resize",a),function(){return window.removeEventListener("resize",a)}}),[e]),c};var s=function(e,t,a){for(var n=0;(a.getMinutes()+n)%5!==0;)n++;var r=new Date(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes()+n);for(n=0;(t.getMinutes()-n)%5!==0;)n++;var c=new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes()-n),i=l.l.count(c,r);for(n=1;5*n*e<i;)n++;var o=5*n;return[[c,r],o,Math.floor(i/o)]},d=function(e,t,a){var n=[l.k.floor(t),l.k.ceil(a)],r=l.k.count(n[0],n[1]),c=Math.ceil(r/e);return[n,c,Math.floor(r/c)]},f=function(e,t,a){var n=[l.i.floor(t),l.i.ceil(a)],r=l.i.count(n[0],n[1]),c=Math.ceil(r/e);return[n,c,Math.floor(r/c)]},g=function(e,t,a){var n=[l.m.floor(t),l.m.ceil(a)],r=l.m.count(n[0],n[1]),c=Math.ceil(r/e);return[n,c,Math.floor(r/c)]},v=function(e,t,a){var n=[l.n.floor(t),l.n.ceil(a)],r=l.n.count(n[0],n[1]),c=Math.ceil(r/e);return[n,c,Math.floor(r/c)]},h=l.j({dateTime:"%A, der %e. %B %Y, %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["am","pm"],days:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],shortDays:["So","Mo","Di","Mi","Do","Fr","Sa"],months:["Januar","Februar","M\xe4rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],shortMonths:["Jan","Feb","Mrz","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"]}),b=function(e,t){return"minute"===t||"hour"===t?h.format("%-H:%M")(e):"day"===t?h.format("%-d. %b")(e):"month"===t?h.format("%b")(e):"year"===t?h.format("%Y")(e):void 0};a(60);function p(e){var t=e.entries,a=e.active,n=e.select;return r.a.createElement("div",{className:"menu"},r.a.createElement("ul",{className:"menuList"},t.map((function(e){return r.a.createElement("li",{key:e.name,className:a===e?"activeEntry":null,onClick:function(){return n(e)}},r.a.createElement("img",{className:"modeImg",src:e.icon,alt:e.id}))}))))}a(61);function E(e){var t=Object(n.useState)(!1),a=Object(o.a)(t,2),c=a[0],i=a[1];return r.a.createElement("div",{className:"refreshButton",onClick:function(){i(!0),"function"===typeof e.clicked&&e.clicked()}},r.a.createElement("div",{className:"refresh-icon"+(c?" anim":""),onAnimationEnd:function(){return i(!1)}}))}var O=a(39),j=a(34),M=a.n(j),N=a(35),y=a.n(N),S=(a(102),a(103),a(36)),k=a.n(S),D=a(37),w=a.n(D),C=a(38),x=a.n(C);var A=function(){var e=Object(n.useState)([{id:0,name:"Kohlenstoffmonoxid",icon:k.a},{id:1,name:"Temperatur",icon:w.a},{id:2,name:"Luftfeuchtigkeit",icon:x.a}]),t=Object(o.a)(e,1)[0],a=Object(n.useState)(t[0]),c=Object(o.a)(a,2),i=c[0],l=c[1],m=Object(n.useState)(null),s=Object(o.a)(m,2),d=s[0],f=s[1],g=Object(n.useState)([new Date,new Date]),v=Object(o.a)(g,2),h=v[0],b=v[1],j=Object(n.useState)([null,null]),N=Object(o.a)(j,2),S=N[0],D=N[1],C=Object(n.useState)(["-","-"]),A=Object(o.a)(C,2),Y=A[0],R=A[1],P=Object(n.useState)(null),B=Object(o.a)(P,2),z=B[0],F=B[1],J=Object(n.useState)(!1),H=Object(o.a)(J,2),I=H[0],L=H[1];function T(e,t){var a=null===t||null===t[0]?"00:00":t[0],n=null===t||null===t[1]?"23:59":t[1],r={from:K(e[0],a),to:K(e[1],n)};try{y.a.get("http://campus-klima-app.mi.medien.hs-duesseldorf.de/datapoints/",{headers:r}).then((function(e){f(e.data.datapoints)}))}catch(c){console.log(c)}L(!1)}function K(e,t){var a=e.getFullYear(),n=e.getMonth()+1,r=e.getDate(),c=-e.getTimezoneOffset()/60,i=c<0?"-":"+";return"".concat(a,"-").concat(U(n),"-").concat(U(r),"T").concat(t).concat(i).concat(U(c),":00")}function U(e){var t="00"+e;return t.substr(t.length-2)}function V(e,t){F((function(a){return a&&a.element.removeAttribute("id"),t.id="activeDot",{data:e,element:t}}))}function _(e,t){R([e,t])}return Object(n.useEffect)((function(){T(h,S),setInterval((function(){T(h,S)}),3e5)}),[]),r.a.createElement("div",{className:"app"},r.a.createElement(p,{entries:t,active:i,select:function(e){return function(e){l(e),F(null)}(e)}}),r.a.createElement("div",{id:"content"},r.a.createElement("div",{id:"wrapper"},r.a.createElement("div",{id:"section1"},r.a.createElement("div",{id:"logoBar"},r.a.createElement("div",{id:"logo"})),r.a.createElement("div",{id:"timeBar"},r.a.createElement("div",{className:"timeBar-items"},r.a.createElement("div",{className:"timeBar-item-group"},r.a.createElement("span",{className:"timeBar-item-label"},"Datum"),r.a.createElement("div",{className:"dateSelect"},r.a.createElement("div",{className:"dateSelect-button light-border",onClick:function(){L((function(e){return!e}))}},r.a.createElement("span",null,h[0].toLocaleDateString()," -"," ",h[1].toLocaleDateString()),r.a.createElement("div",{className:"triangle"})),r.a.createElement(O.a,{onChange:function(e){b(e),T(e,S)},value:h,returnValue:"range",selectRange:!0,className:I?null:"hidden"}))),r.a.createElement("div",{className:"timeBar-item-group"},r.a.createElement("span",{className:"timeBar-item-label"},"Uhrzeit"),r.a.createElement(M.a,{onChange:function(e){D(e),T(h,e)},value:S,disableClock:!0})))),r.a.createElement("div",{className:"bar"},r.a.createElement(E,{clicked:function(){return T(h,S)}}))),r.a.createElement("div",{className:"dataView-wrapper"},i&&d?function(){var e={key:i.name,data:d,activeDot:V,minMax:_};return 0===i.id?r.a.createElement(u,Object.assign({},e,{dataProperty:"co",unit:"ppm",defaultYRange:[0,300],margin:{left:60,right:20,top:40,bottom:35}})):1===i.id?r.a.createElement(u,Object.assign({},e,{dataProperty:"temperature",unit:"\xb0C",defaultYRange:[0,30],margin:{left:50,right:20,top:40,bottom:35}})):2===i.id?r.a.createElement(u,Object.assign({},e,{dataProperty:"humidity",unit:"%",defaultYRange:[0,100],margin:{left:50,right:20,top:40,bottom:35}})):null}():null),r.a.createElement("div",{className:"infoArea"},r.a.createElement("div",{className:"infoCard light-border"},r.a.createElement("table",null,r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("td",{className:"infoCard-header"},"Datum"),r.a.createElement("td",{className:"infoCard-value space-l-20"},z?z.data[0].day:"Keine Auswahl")),r.a.createElement("tr",null,r.a.createElement("td",{className:"infoCard-header"},"Uhrzeit"),r.a.createElement("td",{className:"infoCard-value space-l-20"},z?z.data[0].time+" Uhr":"Keine Auswahl")),r.a.createElement("tr",{className:"infoCard-value-big"},r.a.createElement("td",{colSpan:"2"},z?z.data[1]:"--"))))),r.a.createElement("div",{className:"infoCard infoCard-2 light-border"},r.a.createElement("div",{className:"infoCard-group"},r.a.createElement("span",{className:"infoCard-header"},"Minimum"),r.a.createElement("span",{className:"infoCard-value"},Y[0]),r.a.createElement("span",{className:"infoCard-header"},"Maximum"),r.a.createElement("span",{className:"infoCard-value"},Y[1])))))))};i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(A,null)),document.getElementById("root"))},36:function(e,t,a){e.exports=a.p+"static/media/CO_Icon.b9917a75.svg"},37:function(e,t,a){e.exports=a.p+"static/media/Temp_Icon.8d100e2d.svg"},38:function(e,t,a){e.exports=a.p+"static/media/Humid_Icon.c53cbaf9.svg"},53:function(e,t,a){e.exports=a(104)},58:function(e,t,a){},59:function(e,t,a){},60:function(e,t,a){},61:function(e,t,a){}},[[53,1,2]]]);
//# sourceMappingURL=main.b30c7441.chunk.js.map