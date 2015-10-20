
  Template.dashplayer.helpers({
    
    startVideo: function () {
      var video = document.createElement('video');
      video.id = "videoPlayer";
      video.width = 520;
      video.height = 400;
      var url = "http://dashas.castlabs.com/videos/files/bbb/Manifest.mpd";
      // var url = "http://137.112.104.147:8000/SampleVideo_720x480_50mb_dash.mpd";
      var context = new Dash.di.DashContext();
      var player = new MediaPlayer(context);
      player.startup();
      player.attachView(video);
      player.attachSource(url);
      document.body.appendChild(video); 
    },
    updateBar: function(){
      var video = document.getElementById('videoPlayer');
      console.log("hello");
      var bar = document.getElementsByClassName('progress-bar')[0];
       if(document.getElementById('toggleRunning').innerHTML == 'Pause'){
          var time = video.currentTime;
          bar.style.width= time  + "%";
          bar.innerText = time.toFixed(2) + " seconds";
       }
    },
    rewindBack: function(rewindSpeed) { 
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
  });

  Template.dashplayer.events({
    'click #skipBack': function () {
      var video = document.getElementById('videoPlayer');
                video.currentTime -= 10;
    },
    'click #rewind': function () {
      var video = document.getElementById('videoPlayer');
        if(video.playbackRate == -20.0){
            video.playbackRate = 1.0;
            Template.dashplayer.rewindBack(0);
        }else{
             video.playbackRate = -20.0;
             Template.dashplayer.rewindBack(20);
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
        }else if(document.getElementById('toggleRunning').innerHTML == "Play"){
            document.getElementById('toggleRunning').innerHTML = "Pause";
            video.play();
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
