Dashplayers = new Mongo.Collection("dashplayers");
Template.body.helpers({
	dashplayers: function() {
		return Dashplayers.find({});
	}
});

Template.body.events({
    'submit .new-feed': function (event) {
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
		console.log(text);
      // Insert a task into the collection
      Dashplayers.insert({
        host: text
      });
 
      // Clear form
      event.target.text.value = "";
    }
  });
/*
DashPlayerHelpers = {
  skipTotheBegining: function(rewindSpeed) { 
      var video = document.getElementById('videoPlayer');   
      clearInterval(intervalRewind);
      var startSystemTime = new Date().getTime();
      var startVideoTime = video.currentTime;
       
      var intervalRewind = setInterval(function(){
        video.playbackRate = 1.0;
        if(video.currentTime == 0){
          clearInterval(intervalRewind);
          video.pause();
        } else {
          var elapsed = new Date().getTime()-startSystemTime;
          video.currentTime = Math.max(startVideoTime - elapsed*rewindSpeed/1000.0, 0);
        }
      }, 30);
    }
}
*/
  Template.dashplayer.helpers({
    startVideo: function (url) {
	$('#videoPlayer').ready(function() {
	//$('#'.concat(videoID)).ready(function() {
        var video = document.getElementById("videoPlayer");
		//var video = document.getElementById(videoID);
        //var url = "http://dashas.castlabs.com/videos/files/bbb/Manifest.mpd";
        // var url = "http://137.112.104.147:8008/output/dashcast.mpd";
        VideoPlayBackHelper.createVideo(video, url);
      });
     
    },
    updateBar: function(){
      var video = document.getElementById('videoPlayer');
      var outer = document.createElement("div");
      outer.class = "progress";
      var bar = document.createElement("div");
      bar.class = "progress-bar progress-bar-striped active";
      bar.id = "progressBar";
      bar.style = "color:black"
      var time = video.currentTime;
      bar.text = time + "seconds";      
      outer.appendChild(bar); 
      document.body.appendChild(outer);
    },
    isRunning: function(){
      return document.getElementById("toggleRunning") === "Play";
    }
  });

  Template.dashplayer.events({
  
    "click .toggle-checked": function () {
      Dashplayers.update(this._id, {
        $set: {checked: ! this.checked}
      });
    },
    "click .delete": function () {
      Dashplayers.remove(this._id);
    },
  
    'click #skipBack': function () {
      var video = document.getElementById('videoPlayer');
      video.currentTime -= 10;
    },
    'click #rewind': function (event) {
        $("#rewind").mousehold(300, function(){
          var video = document.getElementById('videoPlayer');
          video.currentTime -= .5;
        });   
    },
    'click #expand': function(){
        var video = document.getElementById('videoPlayer');
          if(document.getElementById("expand").innerHTML == "Expand"){
              video.height = 1000;
              video.width = 1200;
              document.getElementById("expand").innerHTML = "Shrink";
          }else{
              video.height = 400
              video.width = 520;
              document.getElementById("expand").innerHTML = "Expand";
          }
    },
    'click #toggleRunning':function(){
       var video = document.getElementById('videoPlayer');
        if(document.getElementById('toggleRunning').innerHTML == "Pause"){
            document.getElementById('toggleRunning').innerHTML = "Play";
            video.pause();
            Session.set('isRunning', 'false');
        }else if(document.getElementById('toggleRunning').innerHTML == "Play"){
            document.getElementById('toggleRunning').innerHTML = "Pause";
            video.play();
            Session.set('isRunning', 'true');
        }
      },
      'click #fastForward':function(){
        var video = document.getElementById('videoPlayer');
          if(video.playbackRate == 20.0){
              video.playbackRate = 1.0;
          }else{
               video.playbackRate = 20.0;
          }
      },
      'click #skipForward':function(){
         var video = document.getElementById('videoPlayer');
          video.currentTime += 10;
      },
      'click #expand':function(){
        var video = document.getElementById('videoPlayer');
          if(document.getElementById("expand").innerHTML == "Expand"){
              video.height = 1000;
              video.width = 1200;
              document.getElementById("expand").innerHTML = "Shrink";
          }else{
              video.height = 400
              video.width = 520;
              document.getElementById("expand").innerHTML = "Expand";
          }
      },
  });
