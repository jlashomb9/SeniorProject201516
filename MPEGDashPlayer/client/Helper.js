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
	}
}