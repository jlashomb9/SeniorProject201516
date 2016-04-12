var videos = [];
//important for positioning videos
var top = 0;
var left = 0;
var bottomost = top;


function capture(video, scaleFactor) {
   
} 


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
        var rwinterval;
        rewindButton.addEventListener('mousedown',function(e) {
         rwinterval = setInterval(function() {
          if(video.currentTime == 0){
           clearInterval(rwinterval);
           video.pause();
         }
         else{
           video.currentTime += -1.2;
         }
       },360);
       });
        rewindButton.addEventListener('mouseup',function(e) {
         clearInterval(rwinterval);
       });
        rewindButton.addEventListener('mouseout',function(e) {
         clearInterval(rwinterval);
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
        var ffinterval;
        fastForwardButton.addEventListener('mousedown',function(e) {
         ffinterval = setInterval(function() {
          video.currentTime += 1.2;
        },360);
       });
        fastForwardButton.addEventListener('mouseup',function(e) {
         clearInterval(ffinterval);
       });
        fastForwardButton.addEventListener('mouseout',function(e) {
         clearInterval(ffinterval);
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
        // Event listener for the volume bar
        volumeBar.addEventListener("change", function() {
          // Update the video volume
          video.volume = volumeBar.value;
        });

        document.getElementById(download_id).addEventListener('click', function() {
            var dataURL = CanvasHelper.getDataURL(video);
            CanvasHelper.downloadCanvas(this, dataURL, "image.png");
        }, false);       
		var record_id = "record"+Template.parentData(0)._id;
		var scaleFactor = 0.25;
		Session.set(record_id, 0);
		document.getElementById(record_id).addEventListener('click', function() {
			var bool = Session.get(record_id);
			//var output = document.getElementById("output");
			
				//start recording
				Session.set(record_id, bool++);
			/**	var canvas = capture(video, scaleFactor);
				canvas.onclick = function(){
					window.open(this.toDataURL());
				};
				snapshots.unshift(canvas);
				output.innerHTML = '';
				for(var i=0; i<4; i++){
					output.appendChild(snapshots[i]);
				}**/
			/**var worker;
			var threadVal = Session.get("workerThread");
			var videoVal;
			var arr=[];
			if(threadVal != null){
				worker = threadVal;
				videoVal = Session.get("recordingVideo");
				arr = Session.get("arr");
			}
			var bool = Session.get("bool");
			
			if(!bool) { 
				Session.set("recordingVideo", video);
				Session.set("arr", arr);
				worker = new Worker('caputuringCanvas.js');
				Session.set("workerThread", worker);
				worker.postMessage({'cmd': 'start'});
			}else {
				worker.postMessage({'cmd': 'stop'});
				var encoder = new Whammy.Video(15);
				var i =0;
				for(i = 0; i < arr.length;i++){
					encoder.add(arr[i]);
				}
				var output = encoder.compile();
				return webkitURL.createObjectURL(output);
			}
			**/
			var arr=[];
			var scaleFactor = .5;
			var w = video.videoWidth * scaleFactor;
			var h = video.videoHeight * scaleFactor;
			var canvas = document.createElement('canvas');
				canvas.width = w;
				canvas.height = h;
			var ctx = canvas.getContext('2d');
				ctx.drawImage(video, 0, 0, w, h);
			arr.push(canvas);
			var encoder = new Whammy.Video(15);
				var i =0;
				for(i = 0; i < arr.length;i++){
					encoder.add(arr[i]);
				}
				var output = encoder.compile();
				var consoleOutput = webkitURL.createObjectURL(output);
				return consoleOutput;
		}, false);

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
        
		//adding something visible to the resizer
		var resizeId = "resizer"+Template.parentData(0)._id;
		var resizerBox = document.getElementById(resizeId);
		
		
    $("#playerButtons"+Template.parentData(0)._id).css({
      "position": "absolute",
      "z-index": 1,
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

    $("#videoHeader"+Template.parentData(0)._id).css({
      "position": "absolute",
      "z-index": 1,
      "top": 0,
      "left": 0,
      "right": 0,
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

    $("#resizer"+Template.parentData(0)._id).css({
      "position": "absolute",
      "z-index": 2,
      "bottom": 0,
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

        var jqueryresizer = $("#resizer"+Template.parentData(0)._id);
        jqueryresizer.hover(
          function() {
            jqueryresizer.css({"opacity": .9});
          },function() {
            jqueryresizer.css({"opacity": 0});
          });


        VideoPlayBackHelper.createVideo(video, url);
        VideoPlayBackHelper.videoStartup(video);
      // });
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