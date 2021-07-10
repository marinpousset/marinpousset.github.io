window.addEventListener("DOMContentLoaded", function()
{
	var isSceneLoaded = false
	document.querySelector('a-scene').addEventListener('loaded', function()
	{
		isSceneLoaded = true
		/*setTimeout(function(){ scene.enterVR() },1000 );
		video.currentTime = 0;
		video.mute = false;
		video.play();*/
	});
	
	if( screen.width > 800 )
	{
		var asset = document.querySelector('a-assets');
		if ( asset )
		{
			asset.querySelectorAll('video[src$=".mob.mp4"]').forEach( function( video )
			{
				var type = screen.width > 1024 ? '.full.' : '.web.';
				video.src = video.src.replace(/\.mob\./, type );
			})
		}
	}
	
	document.querySelectorAll('a-entity[sound]').forEach( function( sound )
	{
		var prop = sound.getAttribute('sound');
		
		var m = prop.match(/\bloop\s*:\s*(true|false|[1-9][0-9]*)/);
		
		if( ! m ) return true;
		
		var loop = m[1];
		if( loop == 'true' || loop == 'false' ) return true;
		
		var nbloop = parseInt(loop);
		
		if( nbloop )
		{
			var newprop = prop.replace(/loop\s*:\s*[1-9][0-9]*/g, 'loop:false');
	  
			sound.setAttribute('sound', newprop );
			
			sound.iloop = 0;
	  
			var fnLoop = function( e )
			{
				this.iloop ++;
	  
				if ( this.iloop <= nbloop )
				{
					this.components.sound.playSound();
				}
				else
				{
					this.iloop = 0;
				}
			};
	  
			sound.addEventListener('sound-ended', fnLoop.bind( sound ) )
		}
	});
	
	if ( document.querySelector('[sound-sprite]') )
	{
		AFRAME.registerComponent('sound-sprite',
		{
			schema:
			{
				event: {type: 'string', default: 'mouseenter'},
				piste: {type: 'string', default: 'sprite'},
				name: {type: 'string', default: ''},
				volume: {type: 'int', default: 5},
				repeat: {type: 'int', default: 0}
			},
			init: function()
			{
				var self = this;
				console.log(self.data.event);
				self.el.addEventListener( self.data.event, function()
				{
					var piste = self.data.piste;
					var name = self.data.name;
					var repeat = self.data.repeat;
					var volume = self.data.volume;
				
					var audio = document.querySelector( 'audio[sprite]' );
			
					if ( ! audio )
					{
						console.warn( 'balise audio introuvable avec l’identifiant : '+piste );
						return;
					}
				
			
					var sound = audio.sprite;
			
					if ( repeat )
					{
						self.el.repeat = 0;
						sound.on('end', function( idint, idname )
						{
							self.el.repeat ++;
							if( idname == name )
							{
								if ( self.el.repeat < repeat ) sound.play( name );
								else
								{
									self.el.repeat = 0;
									sound.off( 'end', idint );
								}
							}
						});
					}
					if ( volume != undefined ) sound.volume( volume/10 ); 
				
					
					if ( sound.playing( name ) ) sound.stop();
					else sound.play( name );
				
					console.log('play', piste, name, sound)
					sound.play( name );
					//console.log('I was clicked at: ', evt.detail.intersection.point, "and my name is: ", name);
				});
			}
		});
	}

  	document.querySelectorAll('audio[sprite]').forEach(function(audio)
  	{
		var attr = audio.getAttribute('sprite').replace(/'/g,'"');
  		audio.sprite = new Howl(
  		{
  			src: audio.src,
  			sprite: JSON.parse( attr )
  		});
		//console.log(audio.sprite);
  	})
	
	
	var elm = document.querySelector('.click-son-video')
	if( ! elm ) return;

	
	var style = document.createElement('style')
	style.innerText = '\
.click-son-video { position:fixed; z-index:2000; top:0; bottom:0; left:0; right:0; background-color:rgba(0,0,0,0.6); display:flex; flex-wrap:wrap; justify-content:center; align-content:center; align-items:center; }\
.click-son-video button { display:inline-block; font-family:"menlo",sans-serif; font-size:1.8rem; color:#EF604D; background-color:#fff; font-weight:bold; font-style:normal; text-transform:uppercase; text-align:center; padding:10px 30px; cursor:pointer; }\
.click-son-video button:hover { color:#111; background-color:#EF604D; }\
';
	document.head.appendChild( style );
	
	var button = elm.querySelector('button');

	button.addEventListener('click', function()
	{
		if( ! isSceneLoaded ) return;
		
		elm.style.display = 'none'
		
		document.querySelectorAll('video[autoplay]').forEach( function( video )
		{
			video.currentTime = 0;
			video.muted = false;
			video.play();
		})
		
		var scene = document.querySelector('a-scene')
		scene.dispatchEvent( new Event('userclick') )
		scene.enterVR()
	})
	
	
	/*$('video[autoplay]').on('loadstart progress suspend abort error emptied stalled loadedmetadata loadeddata canplay canplaythrough playing waiting seeking seeked ended durationchange timeupdate play pause ratechange resize volumechange webkitbeginfullscreen webkitendfullscreen', function( e )
	{
		console.log( '@'+ e.type )

	})*/
	document.querySelectorAll('video[autoplay]').forEach( function( video )
	{
		document.querySelector('a-scene').addEventListener('loaded', function()
		{
			var scene = this;
			setTimeout(function(){ scene.enterVR() }, 500 );
			video.currentTime = 0;
			video.mute = true;
			video.pause();
		});
	})

	
});