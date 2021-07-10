var notify;
var mem = [];
(function()
{

var div = document.createElement('div');
div.setAttribute('style', '\
position:absolute;\
z-index:1000;\
bottom:0;\
left:0;\
right:0;\
max-height:20vh;\
background-color:#000;\
padding:5px 20px 20px 5px;\
white-space:nowrap;\
overflow-x:auto;\
overflow-y:auto;\
font-family:Arial;\
font-size:6px;\
color:#fff;\
');



notify = function()
{
	var args = '';
	for( var i =0, l = arguments.length; i <l; i++) args += ' ' + arguments[i];
	mem.push( args );
	if ( div && mem.length ) div.innerHTML = mem.join('<br>');
	console.log.apply( this, arguments );
}


window.onerror = function (msg, url, noLigne, noColonne, erreur )
{
	if( ! msg ) return;
	var chaine = msg.toLowerCase();
	var souschaine = "script error";
	if ( chaine.indexOf( souschaine ) > -1 )
	{
		return false;
		//notify('Script Error : voir la Console du Navigateur pour les détails' + JSON.stringify(erreur) );
	}
	else
	{
		var message = [
			'Message : ' + msg,
			'URL : ' + url.substr(url.lastIndexOf('/')),
			'Ligne : ' + noLigne,
			'Colonne : ' + noColonne
		].join(' - ');

		notify( message );
	}

	return false;
};


window.addEventListener("DOMContentLoaded", function()
{
	document.body.appendChild( div );
	//notify( 'NOTIFY IOS is ready' );
});





})();

 