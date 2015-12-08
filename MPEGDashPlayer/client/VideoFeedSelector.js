var mapOfFeeds = {};
VideoFeedHelper = {
	addFeed: function(feedName, hostName){
		mapOfFeeds[feedName] = hostName;
	},
	getFeed: function(feedName){
		return mapOfFeeds[feedName];
	}
}

Template.videoFeedSelector.events({
	'click #newFeed': function () {
     	Modal.show('videoFeedModal')
    },
    'click #feedButton': function (event) {
		var feedName = event.currentTarget.innerText;
		var hostName = VideoFeedHelper.getFeed(feedName);

		var player = document.getElementById("mpegdashplayer");
		var video = document.getElementById("videoPlayer");
		var newVideo = video;
		//remove new video
		//player.removeChild(video);

		//create new video
		
		var context = new Dash.di.DashContext();
   	   	var player = new MediaPlayer(context);
   		player.startup();
	   	player.attachView(newVideo);
	   	player.attachSource(hostName);
	    player.appendChild(newVideo); 
	    ButtonHelper.resetButton();
    }
});


Template.videoFeedModal.events({
	'click #addingFeed': function () {
		var feedName = document.getElementById("feedName").value;
		var hostname = document.getElementById("hostName").value;
		//adding feednames and hostname to a map

		VideoFeedHelper.addFeed(feedName,hostname);
     	
     	// create button

     	var button = document.createElement('button');
     	var newContent = document.createTextNode(feedName);
     	button.appendChild(newContent);
     	button.id = "feedButton";
     	document.getElementById("videoFeed").appendChild(button); 

    }
});