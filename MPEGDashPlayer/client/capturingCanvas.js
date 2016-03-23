self.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
      //add the canvas to an arr
	    for(var i=0; i<10; i++){
		var scaleFactor = .5;
		var w = video.videoWidth * scaleFactor;
		var h = video.videoHeight * scaleFactor;
		var canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;
		var ctx = canvas.getContext('2d');
			ctx.drawImage(video, 0, 0, w, h);
		var arr = Session.get("arr");
		arr.push(canvas);
		Session.set("arr",arr);

		}
      

    case 'stop':
      console.log("WORKER STOPPED: " + data);
      self.close(); // Terminates the worker.
      break;
    default:
      console.log(data);
  };
}, false);
