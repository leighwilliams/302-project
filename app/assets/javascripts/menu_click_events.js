// == menu click events ==

// Display Modes
$("#BS").click(function() {
  $(this).addClass("success");
  $("#SF").removeClass("success");
  $("#WF").removeClass("success");
  viewer.specs.set3DRepresentation('Ball and Stick');
  viewer.updateScene()
});

$("#SF").click(function() {
  $(this).addClass("success");
  $("#BS").removeClass("success");
  $("#WF").removeClass("success");
  viewer.specs.set3DRepresentation('van der Waals Spheres');
  viewer.updateScene()
});

$("#WF").click(function() {
  $(this).addClass("success");
  $("#BS").removeClass("success");
  $("#SF").removeClass("success");
  viewer.specs.set3DRepresentation('Wireframe');
  viewer.updateScene()
});

// Labels
$("#Labs").click(function() {
  viewer.specs.atoms_displayLabels_3D =! viewer.specs.atoms_displayLabels_3D;
  viewer.updateScene()
});

// Load models
$("#PS").change(function() {
  var model = $("#PS").val();

  switch(model) {
    case "4F5S":
      molFile = pdb_4F5S;
      viewer.loadMolecule(molFile);
      break;
    case "1BEB":
      molFile = pdb_1BEB;
      viewer.loadMolecule(molFile);
      break;
    case "1BLF":
      molFile = pdb_1BLF;
      viewer.loadMolecule(molFile);
      break;
    case "1B8E":
      molFile = pdb_1B8E;
      viewer.loadMolecule(molFile);
      break;
    case "1F6S":
      molFile = pdb_1F6S;
      viewer.loadMolecule(molFile);
      break;
  }

});
