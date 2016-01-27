var videos = [];

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
TilingHelper = {
  getWidthForVideo: function(w,numVideos){
    return w/numVideos;
  },
  getHeightForVideo: function(h,numVideos){
    return h/numVideos;
  },
  toggleTiling: function(playerWidth, playerHeight){
    Dashplayers.find({}).forEach(
      function (u){
        console.log(u.parentData);
        var div_id = "#draggable"+u.parentData;
        var draggable_div = document.getElementById(div_id);
        console.log(playerWidth);
        $(div_id).width(playerWidth);
        $(div_id).height(playerHeight);
        // draggable_div.width = playerWidth;
        // draggable_div.height = playerHeight;
        // console.log(draggable_div.width);

      });
  },
  addingParentData: function(parentData,url){  
      var player = Dashplayers.findOne({_id: parentData});
      Dashplayers.update({_id: parentData},
        {
          host: url,
          parentData: parentData
      });
      console.log(player);
  }

}

Template.tiling.events({
  'click #tile': function(){
    // for(var i = 0; i < videos.length; i++){
    //   $(videos[i]).remove();
    // }

    for(var i = 0; i < videos.length; i++) {
      $(videos[i]).css({
        'top':'0',
        'left':'0'
      });
      // $(videos[i]).appendTo($("#display"));
    }


    // var numVideos = Dashplayers.find().count();
    // var w = window.innerWidth;
    // var h = window.innerHeight;
    // var playerWidth = TilingHelper.getWidthForVideo(w,numVideos);
    // var playerHeight = TilingHelper.getHeightForVideo(h,numVideos);
    // TilingHelper.toggleTiling(playerWidth,playerHeight);
  }
});
Template.tiling.helpers({
 
});

Template.dashplayer.helpers({

  });
  Template.dashplayer.onRendered(function () {
    var span_id = "span"+Template.parentData(0)._id;
    var video_id = "videoPlayer"+Template.parentData(0)._id;
    var url = document.getElementById(span_id).innerText;  //$( span_id + ' span').text();
    
    // $("#videoPlayer"+Template.parentData(0)._id).ready(function() {
        var video = document.getElementById(video_id);

        //play-pause
        var playButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("ll");       // Create a text node
        playButton.appendChild(t);                
        playButton.class = "btn btn-default";
        playButton.id = "play-pause"+ Template.parentData(0)._id;
        playButton.addEventListener("click", function() {
          if (video.paused == true) {
            // Play the video
            video.play();

            // Update the button text to 'Pause'
            playButton.innerHTML = "ll";
          } else {
            // Pause the video
            video.pause();

            // Update the button text to 'Play'
            playButton.innerHTML = "►";
          }
        });
        //rewind
        var rewindButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("<<");       // Create a text node
        rewindButton.appendChild(t);                
        rewindButton.class = "btn btn-default";
        rewindButton.id = "rewind"+ Template.parentData(0)._id;
        var rewindJquery = $("#rewind"+Template.parentData(0)._id); 
        rewindButton.addEventListener("click", function() {
            rewindJquery.mousehold(300, function(){
              video.currentTime -= .5;
          });   
        });
        //skip backwards
        var skipBackButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("|<");       // Create a text node
        skipBackButton.appendChild(t);                
        skipBackButton.class = "btn btn-default";
        skipBackButton.id = "skipBack"+ Template.parentData(0)._id;
        skipBackButton.addEventListener("click", function() {
          video.currentTime -= 1;
        });
        //skip forward
        var skipForwardButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode(">|");       // Create a text node
        skipForwardButton.appendChild(t);                
        skipForwardButton.class = "btn btn-default";
        skipForwardButton.id = "skipForward"+ Template.parentData(0)._id;
        skipForwardButton.addEventListener("click", function() {
          video.currentTime += 1;
        });
        //fast forward
        var fastForwardButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode(">>");       // Create a text node
        fastForwardButton.appendChild(t);                
        fastForwardButton.class = "btn btn-default";
        fastForwardButton.id = "fastForward"+ Template.parentData(0)._id;
        fastForwardButton.addEventListener("click", function() {
          if(video.playbackRate == 20.0){
              video.playbackRate = 1.0;
          }else{
               video.playbackRate = 20.0;
          }
        });
        //full screen
        var fullScreenButton = document.createElement("BUTTON");        // Create a <button> element
        var t = document.createTextNode("Full Screen");       // Create a text node
        fullScreenButton.appendChild(t);                
        fullScreenButton.class = "btn btn-default";
        fullScreenButton.id = "fullScreen"+ Template.parentData(0)._id;
        fullScreenButton.addEventListener("click", function() {
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen(); // Firefox
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen(); // Chrome and Safari
          }
        });
        //seekbar
        var seekBar = document.createElement("INPUT");
        seekBar.style.width = "300px";
        seekBar.id = "seekbar"+Template.parentData(0)._id;
        seekBar.type = "range";
        seekBar.value =0;
        seekBar.style.display="inline-block";
        // $("#seekbar"+Template.parentData(0)._id).css({"max-width": "360px"});
        // Event listener for the seek bar
        seekBar.addEventListener("change", function() {
          // Calculate the new time
          var time = video.duration * (seekBar.value / 100);

          // Update the video time
          video.currentTime = time;
        });

        
        // Update the seek bar as the video plays
        video.addEventListener("timeupdate", function() {
          // Calculate the slider value
          var value = (100 / video.duration) * video.currentTime;

          // Update the slider value
          seekBar.value = value;
        });

        // Pause the video when the seek handle is being dragged
        seekBar.addEventListener("mousedown", function() {
          video.pause();
        });

        // Play the video when the seek handle is dropped
        seekBar.addEventListener("mouseup", function() {
          video.play();
        });
        //volume bar
        var volumeBar = document.createElement("INPUT");
        volumeBar.style.width = "60px";
        volumeBar.id = "volumeBar"+Template.parentData(0)._id;
        volumeBar.type = "range";
        volumeBar.min = 0;
        volumeBar.value = 1;
        volumeBar.max =1;
        volumeBar.step = 0.1;
        volumeBar.style.display = "inline-block";
        // $("#volumeBar"+Template.parentData(0)._id).css({"max-width": "60px"});
        // Event listener for the volume bar
        volumeBar.addEventListener("change", function() {
          // Update the video volume
          video.volume = volumeBar.value;
        });

        var buttonList = document.getElementById("playerButtons"+Template.parentData(0)._id);
        //Appending all buttons
        buttonList.appendChild(skipBackButton);
        buttonList.appendChild(rewindButton);
        buttonList.appendChild(playButton);
        buttonList.appendChild(fastForwardButton);
        buttonList.appendChild(skipForwardButton);
        buttonList.appendChild(seekBar);
        buttonList.appendChild(fullScreenButton);
        buttonList.appendChild(volumeBar);
        

        $("#playerButtons"+Template.parentData(0)._id).css({
          "position": "absolute",
          "bottom": 0,
          "left": 0,
          "right": 0,
          "padding": "5px",
          "opacity": 0,
          "-webkit-transition": "opacity .3s",
          "-moz-transition": "opacity .3s",
          "-o-transition": "opacity .3s",
          "-ms-transition": "opacity .3s",
          "transition": "opacity .3s",
          "background-image": "linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-o-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-moz-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-webkit-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-ms-linear-gradient(bottom, rgb(3,113,168) 13%, rgb(0,136,204) 100%)",
          "background-image": "-webkit-gradient(linear,left bottom, left top,color-stop(0.13, rgb(3,113,168)),color-stop(1, rgb(0,136,204)))"
        });
        // $("#"+video_id+":hover "+"#playerButtons"+Template.parentData(0)._id).css({"opacity": .9});
        var jqueryVideo = $("#draggable"+Template.parentData(0)._id);
        var jqueryPlayerButtons = $("#playerButtons"+Template.parentData(0)._id);
        jqueryVideo.hover(
          function() {
            jqueryPlayerButtons.css({"opacity": .9});
          },function() {
            jqueryPlayerButtons.css({"opacity": 0});
        });


        VideoPlayBackHelper.createVideo(video, url);
        VideoPlayBackHelper.videoStartup(video);
      // });
     $("#draggable"+Template.parentData(0)._id).draggable({stack: "div", distance:0, containment:"parent"});
     $("#resizable"+Template.parentData(0)._id).resizable({aspectRatio:true, minHeight:100});
     $("#resizable"+Template.parentData(0)._id).css({"font-size":0});

    //adding id to the mongodb entry
    TilingHelper.addingParentData(Template.parentData(0)._id, url);
    videos.push("#draggable"+Template.parentData(0)._id);
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
      videos.splice(array.indexOf("#resizable"+Template.parentData(0)._id));
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
