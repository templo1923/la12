(function anonymous(obj,escapeExpr
) {
var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
with(obj||{}){
__p+='<div class="player-error-screen__content" data-error-screen>\n  ';
 if (icon) { 
__p+='\n  <div class="player-error-screen__icon" data-error-screen>'+
((__t=( icon ))==null?'':__t)+
'</div>\n  ';
 } 
__p+='\n  <div class="player-error-screen__title" data-error-screen>'+
((__t=( title ))==null?'':__t)+
'</div>\n  <div class="player-error-screen__message" data-error-screen>'+
((__t=( message ))==null?'':__t)+
'</div>\n  <div class="player-error-screen__code" data-error-screen>Error code: '+
((__t=( code ))==null?'':__t)+
'</div>\n  <div class="player-error-screen__reload" data-error-screen>'+
((__t=( reloadIcon ))==null?'':__t)+
'</div>\n</div>\n';
}
return __p;
//# sourceURL=/microtemplates/source[22]
})