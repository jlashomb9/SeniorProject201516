ButtonHelper = {
	resetButton : function(){
		var toggleRunning = document.getElementById('toggleRunning');
		var shrinkExpand = document.getElementById('expand');
		console.log(toggleRunning.innerHTML + "" + shrinkExpand.innerHTML);
		if(toggleRunning.innerHTML === "Play"){
			toggleRunning.innerHTML = "Pause";
		}
		if(shrinkExpand.innerHTML === "Shrink"){
			shrinkExpand.innerHTML = "Expand";
		}

	}
}
VideoPlayBackHelper = {
	createVideo: function(video,hostName){
		var context = new Dash.di.DashContext();
   	   	var player = new MediaPlayer(context);
   		player.startup();
	   	player.attachView(video);
	   	player.attachSource(hostName);
	}, 
	videoStartup: function(video){
		//Used as a sleep for the video starting up
		//the playback rate is originally set at 0, which is paused.
		window.setTimeout(function(){
			video.playbackRate = 1;
			video.play();
		}, 500 );
		
	}
}