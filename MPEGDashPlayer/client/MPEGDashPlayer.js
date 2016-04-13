var videos = [];
//important for positioning videos
var top = 0;
var left = 0;
var bottomost = top;

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
      // Insert a task into the collection
      Dashplayers.insert({
        host: text
      });

      // Clear form
      event.target.text.value = "";
    }
  });

Template.tiling.events({

	//this function is called while the "tile videos" button is clicked,
	//it tries to recursively lay out videos to lower the amount of blank space on screen
  'click #tile': function(){
	
	var DISPLAY_WIDTH = parseInt($("#display").css("width"), 10);
	top = 0;
	left = 0;
	bottomost = top;
	var booleanArray = [];
	for (var i = 0; i < videos.length; i++) booleanArray[i] = true;
	
    for(var i = 0; i < videos.length; i++) {
	  if(booleanArray[i] == false) {
		continue;
	 }
	  booleanArray[i] = false;
	  var currentWidth = parseInt($(videos[i]).css("width"), 10);
	  var currentHeight = parseInt($(videos[i]).css("height"), 10);
	  
	  
	  
	  if ( (left + currentWidth) > DISPLAY_WIDTH ) {
		//video cannot fit on the end of row, recursively fit the largest videos that will fit
		while(true){
			var index = TilingHelper.indexOfLargestVideo(videos, booleanArray, DISPLAY_WIDTH - left, bottomost - top);
			if (index == -1) {
				break;
			}
			booleanArray[index] = false;
			var recurWidth = parseInt($(videos[index]).css("width"), 10);
			var recurHeight = parseInt($(videos[index]).css("height"), 10);
			$(videos[index]).css({
				'top': top,
				'left':left
			});
	  
			left = left + recurWidth;
		}
	  
		left = 0;
		top = bottomost;
		bottomost = top + currentHeight;
	  } else {
		if ( (top  + currentHeight) > bottomost ) {
			bottomost = top + currentHeight;
		} else {
			//video has space below it within this row, recursively fill it
			
			var tempTop = top;
			var top = top + currentHeight;
			while(true){
				var tempval = bottomost - top;
				var index = TilingHelper.indexOfLargestVideo(videos, booleanArray, currentWidth, bottomost - top);
				if (index == -1) {
					
					break;
				}
				booleanArray[index] = false;
				var recurWidth = parseInt($(videos[index]).css("width"), 10);
				var recurHeight = parseInt($(videos[index]).css("height"), 10);
				$(videos[index]).css({
					'top': top,
					'left':left
				});
				
				top = top + recurHeight;
			}
			top = tempTop;
		}
	  }
	  
	  
      $(videos[i]).css({
        'top': top,
        'left':left
      });
	  
	  left = left + currentWidth;
    }
  }
});

Template.AddVideo.events({
  'click #addVideo': function(){

    modal = $("#addVideoModal");
    // Remove existing rows and repopulate.
    $("#videoTable").find("tr:gt(0)").remove();
    var videoModalData = [];
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://137.112.104.147:8088/serverlist.xml?=".concat(new Date().dateString), true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        var xmlDoc = xhttp.responseXML;
        for (i = 0; i < xmlDoc.getElementsByTagName("Name").length; i++) {
          var name = xmlDoc.getElementsByTagName("Name")[i].childNodes[0].nodeValue;
          var address = xmlDoc.getElementsByTagName("Address")[i].childNodes[0].nodeValue;
          var videoFile = xmlDoc.getElementsByTagName("VideoFile")[i].childNodes[0].nodeValue;
          var status = xmlDoc.getElementsByTagName("Status")[i].childNodes[0].nodeValue;
          videoModalData.push({name: name, url: address, file: videoFile, status: status});
        }
        var table = document.getElementById("videoTable");
        for (var i = 0; i < videoModalData.length; i++) {
          var row = table.insertRow(-1);
          var name = row.insertCell(0);
          var status = row.insertCell(1);
          var launchButton = row.insertCell(2);
          var playButton = row.insertCell(3);

          name.innerHTML = videoModalData[i].name;
          status.innerHTML = videoModalData[i].status;

          var play = $(document.createElement('button'));
          play.addClass("btn btn-default");
          play.html("Play");
          url = videoModalData[i].url;
          play.click(function() {
            Dashplayers.insert({
             host: url
           });
            $("[data-dismiss=modal]").trigger({ type: "click" });
          });

          // var launch = document.createElement('button');
          // launch.setAttribute("id", "launch" + i)
          // var launchID launch.getAttribute("id");
          // launch = $(launch);

          var type = "shutdown ".concat(videoModalData[i].name);
          var name = "Shutdown" + i;

          // Handie if video is disabled.
          if(videoModalData[i].status == "DISABLED") {
            play.prop('disabled', true);
            name = "Launch" + i;
            var type = "launch ".concat(videoModalData[i].name);
          }

          var launch = $('<button/>',
          {
            text: name,
            id: 'launch' + i,
            value: type,
            click: function () {
              x = this.value;
              $.ajax({
                type: "POST",
                url: "http://137.112.104.147:8088/",
                data: x,
                success: function() {
                  $("[data-dismiss=modal]").trigger({ type: "click" });
                }
              });
            }
          });

          launch.addClass("btn btn-default");
          //launch.html("Shutdown");
          
          play.appendTo(playButton);
          launch.appendTo(launchButton);
        }
      }
    };
  }
});
Template.LaunchVideo.events({
  'click #launchVideo': function(){
    $("#LaunchButton").click(function () {
      var formData = new FormData($('form')[0]);
      // console.log(this);
      // x = $("#videoFile").value;
      // console.log(x);
      $.ajax({
        type: "POST",
        url: "http://137.112.104.147:8088/",
        xhr: function() {
          var myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload) { // Check if upload property exists
                myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
              }
              return myXhr;
          },
        data: formData,
        cache: false,
        contentType: false,
        processData: false,

        success: function() {
          $("[data-dismiss=modal]").trigger({ type: "click" });
        }

      });
    });
  }
});
Template.dashplayer.onRendered(function () {
  var span_id = "span"+Template.parentData(0)._id;
  var video_id = "videoPlayer"+Template.parentData(0)._id;
  var url = document.getElementById(span_id).innerText;  //$( span_id + ' span').text();

    var download_id = "download"+Template.parentData(0)._id;
    
    // $("#videoPlayer"+Template.parentData(0)._id).ready(function() {
      var video = document.getElementById(video_id);
      var id = Template.parentData(0)._id;
      // ButtonHelper.setUpVideo(id);
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

        document.getElementById(download_id).addEventListener('click', function() {
            var dataURL = CanvasHelper.getDataURL(video);
            CanvasHelper.downloadCanvas(this, dataURL, "image.png");
        }, false);       

        var buttonList = document.getElementById("playerButtons"+id);
        //Appending all buttons
        buttonList.appendChild(skipBackButton);
        buttonList.appendChild(rewindButton);
        buttonList.appendChild(playButton);
        buttonList.appendChild(fastForwardButton);
        buttonList.appendChild(skipForwardButton);
        buttonList.appendChild(seekBar);
        buttonList.appendChild(fullScreenButton);
        buttonList.appendChild(volumeBar);
        
	     	//adding something visible to the resizer
    		var resizeId = "resizer"+id;
    		var resizerBox = document.getElementById(resizeId);
            
        ButtonHelper.addButtonHover(id);
    		ButtonHelper.addTitleHover(id);
        ButtonHelper.addResizeable(id);

        var jqueryVideo = $("#draggable"+id);
        ButtonHelper.addPlayerButtonCSS(id, jqueryVideo);
        ButtonHelper.addVideoHeaderCSS(id, jqueryVideo);
        ButtonHelper.addResizingCSS(id,jqueryVideo);
        

        VideoPlayBackHelper.createVideo(video, url);
        VideoPlayBackHelper.videoStartup(video);

	  var resize_ref = document.getElementById("draggable"+Template.parentData(0)._id);
		$("#draggable"+Template.parentData(0)._id).draggable({stack: "div", distance:0, containment:"parent"});
		$("#resizable"+Template.parentData(0)._id).resizable({aspectRatio:true, minHeight:336, minWidth: 560, handles: {'se': resizerBox},start: function( event, ui ) 
			{
				var z = $(resize_ref).css("z-index");
				$(resize_ref).css({"z-index": z+1});
			}
		});
		$("#resizable"+Template.parentData(0)._id).css({"font-size":0,'background-color':'#ABC','border': '0px solid transparent'});

	  //////////positioning the video//////////////
	  var DISPLAY_WIDTH = parseInt($("#display").css("width"), 10);
	  var currentWidth = parseInt($("#draggable"+Template.parentData(0)._id).css("width"), 10);
	  var currentHeight = parseInt($("#draggable"+Template.parentData(0)._id).css("height"), 10);
	  
	  
	  if ( (left + currentWidth) > DISPLAY_WIDTH ) {
		left = 0;
		top = bottomost;
		bottomost = top + currentHeight;
	  } else {
		if ( (top  + currentHeight) > bottomost ) {
			bottomost = top + currentHeight;
		}
	  }
	  
      $("#draggable"+Template.parentData(0)._id).css({
        'top': top,
        'left':left,
		'background-color':'#ABC',
		'border': '0px solid transparent'
      });
	  
	  left = left + currentWidth;
	  
	  
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
  //removes a video player
  "click .delete": function () {
    Dashplayers.remove(this._id);
	var location = videos.indexOf("#draggable"+Template.parentData(0)._id);
    if( location> -1) {
      videos.splice(location,1);
    }
  },
});