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
we can probably remove this

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

  });
  Template.dashplayer.onRendered(function () {
    var span_id = "span"+Template.parentData(0)._id;
    var video_id = "videoPlayer"+Template.parentData(0)._id;
    var url = document.getElementById(span_id).innerText;  //$( span_id + ' span').text();
    
    // $("#videoPlayer"+Template.parentData(0)._id).ready(function() {
        var video = document.getElementById(video_id);
        VideoPlayBackHelper.createVideo(video, url);
        VideoPlayBackHelper.videoStartup(video);
      // });
     
    },
  );

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
      var video = document.getElementById('videoPlayer'+this._id);
      video.currentTime -= 10;
    },
    'click #rewind': function (event) {
        $("#rewind").mousehold(300, function(){
          var video = document.getElementById('videoPlayer'+this._id);
          console.log(video);
          video.currentTime -= .5;
        });   
    },
    'click #toggleRunning':function(){
       var video = document.getElementById('videoPlayer'+this._id);
	     console.log(video);
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
        var video = document.getElementById('videoPlayer'+this._id);
          if(video.playbackRate == 20.0){
              video.playbackRate = 1.0;
          }else{
               video.playbackRate = 20.0;
          }
      },
      'click #skipForward':function(){
         var video = document.getElementById('videoPlayer'+this._id);
          video.currentTime += 10;
      },
      'click #expand':function(){
        var video = document.getElementById('videoPlayer'+this._id);
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
