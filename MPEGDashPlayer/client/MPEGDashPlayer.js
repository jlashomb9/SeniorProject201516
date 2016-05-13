var videos = [];
var videoURLS = [];
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
    for(var j = 0; j < videoURLS.length; j++){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://" + videoURLS[j] + ":8088/serverlist.xml?=".concat(new Date().dateString), true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        var xmlDoc = xhttp.responseXML;
        for (i = 0; i < xmlDoc.getElementsByTagName("Name").length; i++) {
          var name = xmlDoc.getElementsByTagName("Name")[i].childNodes[0].nodeValue;
          var address = xmlDoc.getElementsByTagName("Address")[i].childNodes[0].nodeValue;
          var videoFile = xmlDoc.getElementsByTagName("VideoFile")[i].childNodes[0].nodeValue;
          var status = xmlDoc.getElementsByTagName("Status")[i].childNodes[0].nodeValue;
          //console.log(address);
          videoModalData.push({name: name, url: address, file: videoFile, status: status});
        }
        var table = document.getElementById("videoTable");
        for (var i = 0; i < videoModalData.length; i++) {
          var row = table.insertRow(-1);
          var name = row.insertCell(0);
          var status = row.insertCell(1);
          var launchCell = row.insertCell(2);
          var playCell = row.insertCell(3);

          name.innerHTML = videoModalData[i].name;
          status.innerHTML = videoModalData[i].status;

          // Create play button.
          var playButton = document.createElement("BUTTON");
          playButton.setAttribute("class", "btn btn-default");
          playButton.innerHTML = "Play"
          playButton.setAttribute("value", videoModalData[i].url);
          playButton.onclick = function() {
            handlePlay($(this));
          }

          // Set up the button.
          var launchButton = document.createElement("BUTTON");
          launchButton.style.width = "90px"
          launchButton.setAttribute("class", "btn btn-default");
          launchButton.setAttribute("id", "launch_" + i);
          launchButton.setAttribute("url", videoModalData[i].url);
          launchButton.innerHTML = "Shutdown"
          launchButton.setAttribute("value", "shutdown ".concat(videoModalData[i].name));

          // Handie if video is disabled.
          if(videoModalData[i].status == "DISABLED") {
            //launchButton.setAttribute('disabled', true);
            launchButton.setAttribute("value", "launch ".concat(videoModalData[i].name));
            launchButton.innerHTML = "Launch"
            playButton.setAttribute("disabled", true);
          }

          launchButton.onclick = function() {
            handleLaunchClick($(this));
          }
          
          playCell.appendChild(playButton);
          launchCell.appendChild(launchButton);

        }
      }
    };
}
  }
});
// Handles launch/shutdown event.
function handleLaunchClick(button) {
  var command = button[0].value;
  var url = button[0].getAttribute("url");
  console.log(url);
  var l = document.createElement("a");
  l.href = url;
  $.ajax({
    type: "POST",
    url: "http://" + l.hostname + ":8088/",
    data: command,
    success: function() {
      $("[data-dismiss=modal]").trigger({ type: "click" });
    }
  });
}
// Handles play event.
function handlePlay(button) {
  var url = button[0].value;
  Dashplayers.insert({
    host: url
  });
  $("[data-dismiss=modal]").trigger({ type: "click" });
}

Template.LaunchVideo.events({
  'click #launchVideo': function(){
    $("#LaunchButton").click(function () {

      var val = $("input:radio[name=uploadType]:checked").val();

      // For URLs
      if(val == "Stream") {
      	serverURL = $("#serverUrlInput").val();
        vidURL = $("#urlInput").val();
        vidName = $("#vidName").val();
        parameters = $("#parameters").val();
        if(vidURL == "" || vidName == "") {
          alert("Not all required fields have been filled out.");
          return
        }
        dataString = "AddConfig '" + vidURL +"' '" + vidName + "' '" + parameters + "'"


        $.ajax({
          type: "POST",
          url: "http://" + serverURL + ":8088/",

          data: dataString,
          cache: false,
          contentType: false,
          processData: false,
          success: function() {
            $("[data-dismiss=modal]").trigger({ type: "click" });
          },
          error: function(xhr, status, err) {
            alert("Upload failed.");
          }
        });
      }


    // For videos
    else if(val == "File") {

      var formData = new FormData(),
      myFile = document.getElementById("videoFile").files[0];

      serverURL = $("#serverUrlInput").val();
      formData.append('file', myFile);
      var filename = $('#videoFile').val().split('\\').pop().split(' ').join('_');
      vidName = $("#vidName").val();
      parameters = $("#parameters").val();

      if(filename == "" || vidName == "") {
        alert("Not all required fields have been filled out.");
        return
      }

      var dataString = "AddConfig '" + filename +"' '" + vidName + "' '" + parameters + "'"
      
      $.ajax({
        type: "POST",
        url: "http://" + serverURL + ":8088/" + filename,
        enctype: "multipart/form-data",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function() {
          $.ajax({
            type: "POST",
            url: "http://" + serverURL + ":8088/",

            data: dataString,
            cache: false,
            contentType: false,
            processData: false,
            success: function() {
              $("[data-dismiss=modal]").trigger({ type: "click" });
            },
            error: function(xhr, status, err) {
              alert("Upload failed.");
            }
          });
        },
        error: function(xhr, status, err) {
          alert("Upload failed.")
        }
      });
    }
  });
$("input:radio[name=uploadType]").on("change", function() {
  var val = $("input:radio[name=uploadType]:checked").val();
  if(val == "Stream") {
    $("#FileDiv").css("display", "none");
    $("#StreamDiv").css("display", "block");
  } else if(val == "File") {
    $("#FileDiv").css("display", "block");
    $("#StreamDiv").css("display", "none");
  }
});
$("input:radio[name=radioParams]").on("change", function() {
  var val = $("input:radio[name=radioParams]:checked").val();
  if(val == "eDash") {
    $("#parameters").val(" ");
  } else if(val == "GPAC") {
    $("#parameters").val("-seg-dur 1000 -frag-dur 200 -mpd-refresh 1 -low-delay");
  }
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
    var l = document.createElement("a");
    l.href = url;
    console.log(l.hostname);
    videoURLS.push(l.hostname);
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