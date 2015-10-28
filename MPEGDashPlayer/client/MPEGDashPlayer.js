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
  Template.dashplayer.helpers({
    startVideo: function () {
      var video = document.createElement('video');
      video.id = "videoPlayer";
      video.width = 520; 
      video.height = 400;
      var url = "http://dashas.castlabs.com/videos/files/bbb/Manifest.mpd";
      // var url = "http://172.17.0.5:7997/output/dashcast.mpd";
      var context = new Dash.di.DashContext();
      var player = new MediaPlayer(context);
      player.startup();
      player.attachView(video);
      player.attachSource(url);
      document.body.appendChild(video); 
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
    'click #skipBack': function () {
      var video = document.getElementById('videoPlayer');
                video.currentTime -= 10;
    },
    'click #skipTotheBegining': function () {
      var video = document.getElementById('videoPlayer');
        if(video.playbackRate == -20.0){
           DashPlayerHelpers.skipTotheBegining(0);
        }else{
            DashPlayerHelpers.skipTotheBegining(20);
        }
        
    },
    'click #expand': function(){
        var video = document.getElementById('videoPlayer');
          if(document.getElementById("expand").innerHTML == "Expand"){
              video.height = 1000;
              video.width = 1200;
              document.getElementById("expand").innerHTML = "Skrink";
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
              document.getElementById("expand").innerHTML = "Skrink";
          }else{
              video.height = 400
              video.width = 520;
              document.getElementById("expand").innerHTML = "Expand";
          }
      },
  });
