(this["webpackJsonpklima-app"]=this["webpackJsonpklima-app"]||[]).push([[0],{104:function(e,t,a){},106:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(15),i=a.n(c),l=(a(60),a(4)),o=a(3);a(61);function u(e){var t=Object(n.useRef)(),a=Object(n.useRef)(),c=Object(n.useRef)(),i=Object(n.useRef)(),u=m(t),h=u.width,b=u.height,E=Object(n.useState)([]),j=Object(l.a)(E,2),O=j[0],M=j[1],N=Object(n.useState)([0,0]),y=Object(l.a)(N,2),S=y[0],k=y[1],D=Object(n.useState)(null),w=Object(l.a)(D,2),x=w[0],C=w[1],A=Object(n.useState)(null),R=Object(l.a)(A,2),F=R[0],P=R[1],Y=Object(n.useState)(!1),z=Object(l.a)(Y,2),B=z[0],I=z[1],J=Object(n.useState)(null),H=Object(l.a)(J,2),L=H[0],T=H[1];function _(t,a){T(t);var n=t[1]?t[1].toFixed(1)+" "+e.unit:"Kein Wert";e.activeDot([{day:p(t[0],"day"),time:p(t[0],"minute")},n],a)}return e.margin||(e.margin={left:40,right:30,top:40,bottom:35}),Object(n.useEffect)((function(){var t=e.data.map((function(t){return[new Date(t.time),t[e.dataProperty]]}));M(t),C(o.f(t,(function(e){return e[0]}))),P(o.d(t,(function(e){return e[0]})));try{e.minMaxAvg(o.f(e.data,(function(t){return t[e.dataProperty]})).toFixed(1)+" "+e.unit,o.d(e.data,(function(t){return t[e.dataProperty]})).toFixed(1)+" "+e.unit,o.e(e.data,(function(t){return t[e.dataProperty]})).toFixed(1)+" "+e.unit)}catch(r){e.minMaxAvg("-","-","-")}if(e.defaultYRange){var a=o.f(e.data,(function(t){return t[e.dataProperty]}))<e.defaultYRange[0]?Math.floor(o.f(e.data,(function(t){return t[e.dataProperty]}))):e.defaultYRange[0],n=o.d(e.data,(function(t){return t[e.dataProperty]}))>e.defaultYRange[1]?Math.ceil(o.d(e.data,(function(t){return t[e.dataProperty]}))):e.defaultYRange[1];k([a,n])}}),[e.data,h]),Object(n.useEffect)((function(){void 0!==x&&void 0!==F&&0!==e.data.length?(!function(){var t=h-(e.margin.left+e.margin.right),n=b-(e.margin.top+e.margin.bottom),r=function(e){if(e<1)return[[],[],""];var t,a,n,r,c=0,i=0,u=0,m=0;t="minute";var h=s(e,x,F),p=Object(l.a)(h,3);if(n=p[0],a=p[1],r=p[2],a>60){a=0,t="hour";var b=d(e,x,F),E=Object(l.a)(b,3);if(n=E[0],m=E[1],r=E[2],o.j.count(n[0],n[1])>1){m=0,t="day";var j=f(e,x,F),O=Object(l.a)(j,3);if(n=O[0],u=O[1],r=O[2],u>16){u=0,t="month";var M=g(e,x,F),N=Object(l.a)(M,3);if(n=N[0],i=N[1],r=N[2],o.o.count(n[0],n[1])>1){var y=v(e,x,F),S=Object(l.a)(y,3);n=S[0],c=S[1],r=S[2]}}}}for(var k=new Array(r+1),D=0;D<=r;D++)k[D]=new Date(n[0].getFullYear()+D*c,n[0].getMonth()+D*i,n[0].getDate()+D*u,n[0].getHours()+D*m,n[0].getMinutes()+D*a);return[k,n,t]}(function(e){return Math.floor(e/60)}(t)),u=Object(l.a)(r,3),m=u[0],E=u[1],j=u[2],M=o.h().domain(E).range([0,t]),N=o.g().domain(S).range([n,0]),y=o.a(M).tickFormat((function(e){return p(e,j)})).tickPadding(10).tickSize(-n).tickValues(m),k=o.b(N).ticks(5).tickPadding(20);o.i(c.current).attr("transform","translate(".concat(0,", ",n,")")).call(y);var D=o.i(i.current).call(k);D.selectAll("line").remove(),D.select(".domain").remove();var w={x:0,y:0},C=O.filter((function(e,t){if(0===t)return!0;var a=Math.ceil(M(e[0]))-w.x,n=Math.ceil(N(e[1]))-w.y;return(a>10||n>10)&&(w.x=Math.ceil(M(e[0])),w.y=Math.ceil(N(e[1])),!0)}));if(o.i(a.current).selectAll("circle").filter((function(e,t,a){return!a[t].hasAttribute("id")||"activeDot"!==a[t].id})).data(C).join("circle").attr("cx",(function(e){return M(e[0])})).attr("cy",(function(e){return N(e[1])})).attr("r",5).classed("dot",!0).on("mouseover",(function(e){return _(e,o.c.target)})).on("click",(function(e){return _(e,o.c.target)})),L){var A=window.document.getElementById("activeDot");o.i(A).attr("cx",M(L[0])).attr("cy",N(L[1])),A&&A.parentNode&&A.parentNode.appendChild(A)}}(),I(!1)):0===e.data.length&&I(!0)}),[h,b,O,B,L]),r.a.createElement("div",{className:"svgContainer",ref:t},!1===B?r.a.createElement("svg",{height:"100%",width:"100%"},r.a.createElement("g",{transform:"translate(".concat(e.margin.left,",").concat(e.margin.top,")")},r.a.createElement("text",{x:"-30",y:"-20",textAnchor:"middle",className:"yLabel"},e.unit),r.a.createElement("g",{ref:c,className:"xAxis"}),r.a.createElement("g",{ref:i,className:"yAxis"}),r.a.createElement("g",{ref:a}))):r.a.createElement("div",{className:"dataError"},r.a.createElement("p",{className:"center"},"F\xfcr den Zeitraum liegen keine Daten vor")))}var m=function(e){var t=function(){return{width:e.current.offsetWidth,height:e.current.offsetHeight}},a=Object(n.useState)({width:0,height:0}),r=Object(l.a)(a,2),c=r[0],i=r[1];return Object(n.useEffect)((function(){var a=function(){return i(t())};return e.current&&i(t()),window.addEventListener("resize",a),function(){return window.removeEventListener("resize",a)}}),[e]),c};var s=function(e,t,a){for(var n=0;(a.getMinutes()+n)%5!==0;)n++;var r=new Date(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes()+n);for(n=0;(t.getMinutes()-n)%5!==0;)n++;var c=new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),t.getMinutes()-n),i=o.m.count(c,r);for(n=1;5*n*e<i;)n++;var l=5*n;return[[c,r],l,Math.floor(i/l)]},d=function(e,t,a){var n=[o.l.floor(t),o.l.ceil(a)],r=o.l.count(n[0],n[1]),c=Math.ceil(r/e);return[n,c,Math.floor(r/c)]},f=function(e,t,a){var n=[o.j.floor(t),o.j.ceil(a)],r=o.j.count(n[0],n[1]),c=Math.ceil(r/e);return[n,c,Math.floor(r/c)]},g=function(e,t,a){var n=[o.n.floor(t),o.n.ceil(a)],r=o.n.count(n[0],n[1]),c=Math.ceil(r/e);return[n,c,Math.floor(r/c)]},v=function(e,t,a){var n=[o.o.floor(t),o.o.ceil(a)],r=o.o.count(n[0],n[1]),c=Math.ceil(r/e);return[n,c,Math.floor(r/c)]},h=o.k({dateTime:"%A, der %e. %B %Y, %X",date:"%d.%m.%Y",time:"%H:%M:%S",periods:["am","pm"],days:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],shortDays:["So","Mo","Di","Mi","Do","Fr","Sa"],months:["Januar","Februar","M\xe4rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],shortMonths:["Jan","Feb","Mrz","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"]}),p=function(e,t){return"minute"===t||"hour"===t?h.format("%-H:%M")(e):"day"===t?h.format("%-d. %b")(e):"month"===t?h.format("%b")(e):"year"===t?h.format("%Y")(e):void 0};a(62);function b(e){var t=e.entries,a=e.active,n=e.select;return r.a.createElement("div",{className:"menu"},r.a.createElement("ul",{className:"menuList"},t.map((function(e){return r.a.createElement("li",{key:e.name,className:a===e?"activeEntry":null,onClick:function(){return n(e)}},r.a.createElement("img",{className:"modeImg",src:e.icon,alt:e.id}))}))))}a(63);function E(e){var t=Object(n.useState)(!1),a=Object(l.a)(t,2),c=a[0],i=a[1];return r.a.createElement("div",{className:"button",onClick:function(){i(!0),"function"===typeof e.clicked&&e.clicked(),e.rotate||i(!1)}},r.a.createElement("img",{src:e.icon,className:"button-icon"+(c&&e.rotate?" anim":""),onAnimationEnd:function(){return i(!1)},alt:""}))}var j=a(41),O=a(34),M=a.n(O),N=a(35),y=a.n(N),S=(a(104),a(105),a(36)),k=a.n(S),D=a(37),w=a.n(D),x=a(38),C=a.n(x),A=a(39),R=a.n(A),F=a(40),P=a.n(F);var Y=function(){var e=Object(n.useState)([{id:0,name:"Kohlenstoffmonoxid",icon:k.a},{id:1,name:"Temperatur",icon:w.a},{id:2,name:"Luftfeuchtigkeit",icon:C.a}]),t=Object(l.a)(e,1)[0],a=Object(n.useState)(t[0]),c=Object(l.a)(a,2),i=c[0],o=c[1],m=Object(n.useState)(null),s=Object(l.a)(m,2),d=s[0],f=s[1],g=Object(n.useState)([new Date,new Date]),v=Object(l.a)(g,2),h=v[0],p=v[1],O=Object(n.useState)([null,null]),N=Object(l.a)(O,2),S=N[0],D=N[1],x=Object(n.useState)({min:"-",max:"-",avg:"-"}),A=Object(l.a)(x,2),F=A[0],Y=A[1],z=Object(n.useState)(null),B=Object(l.a)(z,2),I=B[0],J=B[1],H=Object(n.useState)(!1),L=Object(l.a)(H,2),T=L[0],_=L[1],K=Object(n.useState)(!1),U=Object(l.a)(K,2),W=U[0],V=U[1];function G(e,t){var a=null===t||null===t[0]?"00:00":t[0],n=null===t||null===t[1]?"23:59":t[1],r={from:X(e[0],a),to:X(e[1],n)};try{y.a.get("http://campus-klima-app.mi.medien.hs-duesseldorf.de/datapoints/",{headers:r}).then((function(e){f(e.data.datapoints)}))}catch(c){}_(!1)}function X(e,t){var a=e.getFullYear(),n=e.getMonth()+1,r=e.getDate(),c=-e.getTimezoneOffset()/60,i=c<0?"-":"+";return"".concat(a,"-").concat(Z(n),"-").concat(Z(r),"T").concat(t).concat(i).concat(Z(c),":00")}function Z(e){var t="00"+e;return t.substr(t.length-2)}function q(e,t){J((function(a){return a&&a.element.removeAttribute("id"),t.id="activeDot",{data:e,element:t}}))}function Q(e,t,a){Y({min:e,max:t,avg:a})}function $(e){o(e),J(null),V(!1)}return Object(n.useEffect)((function(){G(h,S),setInterval((function(){G(h,S)}),3e5)}),[]),W?r.a.createElement("div",{className:"app"},r.a.createElement(b,{entries:t,active:i,select:function(e){return $(e)}}),r.a.createElement("div",{id:"content"},r.a.createElement("div",{id:"wrapper"},r.a.createElement("span",{id:"impress-text"},r.a.createElement("h3",null,"Impressum"),r.a.createElement("p",null,"Diese Applikation ist im Rahmen einer Projektarbeit im Sommersemester 2020 unter Leitung von Frau Prof. Dr. Gundula D\xf6rries an der Hochschule D\xfcsseldorf entstanden.",r.a.createElement("br",null)),r.a.createElement("h4",null,"Technische Umsetzung"),r.a.createElement("p",null,r.a.createElement("i",null,"Front-End:")," ",r.a.createElement("br",null),"Jakob Weirich (jakob.weirich@study.hs-duesseldorf.de)"),r.a.createElement("p",null,r.a.createElement("i",null,"Back-End:")," ",r.a.createElement("br",null),"Robert Deppe (robert.deppe@study.hs-duesseldorf.de)",r.a.createElement("br",null),"Michel Schwarz (michel.schwarz@study.hs-duesseldorf.de)"),r.a.createElement("p",null,r.a.createElement("i",null,"Hardware:")," ",r.a.createElement("br",null),"Michel Schwarz ",r.a.createElement("br",null),"Robert Deppe ",r.a.createElement("br",null),"Jakob Weirich"))))):r.a.createElement("div",{className:"app"},r.a.createElement(b,{entries:t,active:i,select:function(e){return $(e)}}),r.a.createElement("div",{id:"content"},r.a.createElement("div",{id:"wrapper"},r.a.createElement("div",{id:"section1"},r.a.createElement("div",{id:"logoBar"},r.a.createElement("div",{id:"logo"})),r.a.createElement("div",{id:"timeBar"},r.a.createElement("div",{className:"timeBar-items"},r.a.createElement("div",{className:"timeBar-item-group"},r.a.createElement("span",{className:"timeBar-item-label"},"Datum"),r.a.createElement("div",{className:"dateSelect"},r.a.createElement("div",{className:"dateSelect-button light-border",onClick:function(){_((function(e){return!e}))}},r.a.createElement("span",null,h[0].toLocaleDateString()," -"," ",h[1].toLocaleDateString()),r.a.createElement("div",{className:"triangle"})),r.a.createElement(j.a,{onChange:function(e){p(e),G(e,S)},value:h,returnValue:"range",selectRange:!0,className:T?null:"hidden"}))),r.a.createElement("div",{className:"timeBar-item-group"},r.a.createElement("span",{className:"timeBar-item-label"},"Uhrzeit"),r.a.createElement(M.a,{onChange:function(e){D(e),G(h,e)},value:S,disableClock:!0})))),r.a.createElement("div",{className:"bar"},r.a.createElement(E,{clicked:function(){return G(h,S)},icon:R.a,rotate:!0}),r.a.createElement(E,{clicked:function(){V(!0),o(null)},icon:P.a}))),r.a.createElement("div",{className:"dataView-wrapper"},i&&d?function(){var e={key:i.name,data:d,activeDot:q,minMaxAvg:Q};return 0===i.id?r.a.createElement(u,Object.assign({},e,{dataProperty:"co",unit:"ppm",defaultYRange:[0,300],margin:{left:60,right:25,top:40,bottom:35}})):1===i.id?r.a.createElement(u,Object.assign({},e,{dataProperty:"temperature",unit:"\xb0C",defaultYRange:[0,30],margin:{left:50,right:25,top:40,bottom:35}})):2===i.id?r.a.createElement(u,Object.assign({},e,{dataProperty:"humidity",unit:"%",defaultYRange:[0,100],margin:{left:50,right:25,top:40,bottom:35}})):null}():null),r.a.createElement("div",{id:"section2"},r.a.createElement("div",{className:"infoCard light-border"},r.a.createElement("table",null,r.a.createElement("tbody",null,r.a.createElement("tr",null,r.a.createElement("td",{className:"infoCard-header"},"Datum"),r.a.createElement("td",{className:"infoCard-value space-l-20"},I?I.data[0].day:"Keine Auswahl")),r.a.createElement("tr",null,r.a.createElement("td",{className:"infoCard-header"},"Uhrzeit"),r.a.createElement("td",{className:"infoCard-value space-l-20"},I?I.data[0].time+" Uhr":"Keine Auswahl")),r.a.createElement("tr",{className:"infoCard-value-big"},r.a.createElement("td",{colSpan:"2"},I?I.data[1]:"--"))))),r.a.createElement("div",{className:"infoCard infoCard-2 light-border"},r.a.createElement("div",{className:"infoCard-group"},r.a.createElement("span",{className:"infoCard-header"},"Minimum"),r.a.createElement("span",{className:"infoCard-value"},F.min),r.a.createElement("span",{className:"infoCard-header"},"Maximum"),r.a.createElement("span",{className:"infoCard-value"},F.max),r.a.createElement("span",{className:"infoCard-header"},"Mittelwert"),r.a.createElement("span",{className:"infoCard-value"},F.avg)))))))};i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(Y,null)),document.getElementById("root"))},36:function(e,t,a){e.exports=a.p+"static/media/CO_Icon.b9917a75.svg"},37:function(e,t,a){e.exports=a.p+"static/media/Temp_Icon.8d100e2d.svg"},38:function(e,t,a){e.exports=a.p+"static/media/Humid_Icon.c53cbaf9.svg"},39:function(e,t,a){e.exports=a.p+"static/media/Refresh_Icon.d21f57b3.svg"},40:function(e,t,a){e.exports=a.p+"static/media/Imprint_Icon.806b3374.svg"},55:function(e,t,a){e.exports=a(106)},60:function(e,t,a){},61:function(e,t,a){},62:function(e,t,a){},63:function(e,t,a){}},[[55,1,2]]]);
//# sourceMappingURL=main.989b0b8e.chunk.js.map