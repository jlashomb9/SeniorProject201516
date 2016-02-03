

 Router.map(function(){
    this.route('videoManager', {
        path: '/videoManager'
    ,
      action: function() {
      if (this.ready()) {
        this.render();
      }
    },
  });
    this.route('listOfVideos', {
        path: '/listOfVideos'
    ,
      data: function () {
        return {Dashplayers: Dashplayers.find()};
      }
    ,
      action: function() {
      if (this.ready()) {
        this.render();
      }
    },
  });
});