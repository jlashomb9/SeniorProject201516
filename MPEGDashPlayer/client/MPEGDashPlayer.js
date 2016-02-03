var videos = [];

Dashplayers = new Mongo.Collection("dashplayers");
Template.listOfVideos.helpers({
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
        var playButton = ButtonHelper.addPlayPause(video);
        //rewind
        var rewindButton = ButtonHelper.addRewindButton(video);
        //skip backwards
        var skipBackButton = ButtonHelper.addSkipBackButton(video);
        //skip forward
        var skipForwardButton = ButtonHelper.addSkipForwardButton(video);
        //fast forward
        var fastForwardButton = ButtonHelper.addFastForwardButton(video);
        //full screen
        var fullScreenButton = ButtonHelper.addFullScreenButton(video);
        //seekbar
        var seekBar = ButtonHelper.addSeekBar(video);
        //volume bar
        var volumeBar = ButtonHelper.addVolumeBar(video);

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
        var id = Template.parentData(0)._id;
        
       ButtonHelper.addButtonHover(id);
       ButtonHelper.addTitleHover(id);
		
		    
        // $("#"+video_id+":hover "+"#playerButtons"+Template.parentData(0)._id).css({"opacity": .9});
        var jqueryVideo = $("#draggable"+Template.parentData(0)._id);
        var jqueryPlayerButtons = $("#playerButtons"+Template.parentData(0)._id);
        jqueryVideo.hover(
          function() {
            jqueryPlayerButtons.css({"opacity": .9});
          },function() {
            jqueryPlayerButtons.css({"opacity": 0});
        });
		
		var jqueryVideoHeader = $("#videoHeader"+Template.parentData(0)._id);
        jqueryVideo.hover(
          function() {
            jqueryVideoHeader.css({"opacity": .9});
          },function() {
            jqueryVideoHeader.css({"opacity": 0});
        });


        VideoPlayBackHelper.createVideo(video, url);
        VideoPlayBackHelper.videoStartup(video);
      // });
     $("#draggable"+Template.parentData(0)._id).draggable({stack: "div", distance:0, containment:"parent"});
     $("#resizable"+Template.parentData(0)._id).resizable({aspectRatio:true, minHeight:350});
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
  
    
  });
