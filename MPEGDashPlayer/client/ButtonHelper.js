ButtonHelper = {
	resetButton : function(){
		var toggleRunning = document.getElementById('toggleRunning');
		var shrinkExpand = document.getElementById('expand');
		if(toggleRunning.innerHTML === "Play"){
			toggleRunning.innerHTML = "Pause";
		}
		if(shrinkExpand.innerHTML === "Shrink"){
			shrinkExpand.innerHTML = "Expand";
		}

	}
}