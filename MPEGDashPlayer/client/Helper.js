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

CanvasHelper = {
	createCanvas: function(){
		var canvas = document.createElement('canvas');
      	canvas.width = 640;
      	canvas.height = 365;
      	return canvas;
	},
	downloadCanvas: function(link, dataURL, filename){
		link.href = dataURL;
		link.download = filename;
		link.click();
		console.log(link);
	},
	getDataURL: function(video){
		var canvas = CanvasHelper.createCanvas();
	     var ctx = canvas.getContext('2d');
	      var w = video.width;
	      var h = video.height;

	      ctx.drawImage(video, 0, 0, w,h);
	      var idata = ctx.getImageData(0,0,w,h);
	      var data = idata.data;
	       //Background
	      ctx.fillStyle = '#ffffaa';
	      ctx.fillRect(0, 0, w, h);
	      //Box
	      ctx.strokeStyle = '#000000';
	      // w = w - 10;
	      // h = h - 10;
	      ctx.strokeRect(5,  5, w, h);
	      // Text
	      
	     
	      idata.data = data;

	      ctx.putImageData(idata,0,0);

	      ctx.fillStyle = "#000000";
	      ctx.fillText  ("Duration:" + video.duration,  10 ,280);
	      ctx.fillText  ("Current time:" + video.currentTime,  260 ,280);

	      return canvas.toDataURL();
	}
}