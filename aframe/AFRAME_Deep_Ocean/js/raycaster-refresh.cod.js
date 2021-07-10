AFRAME.registerComponent('raycaster-refresh', {
  init: function () {
    var sceneEl = this.el.sceneEl;
    sceneEl.addEventListener('object3dset', function () {
      var raycasterEl = sceneEl.querySelector('[raycaster]');
      raycasterEl.components.raycaster.refreshObjects();
	  console.log('activé')
    });
  }
});