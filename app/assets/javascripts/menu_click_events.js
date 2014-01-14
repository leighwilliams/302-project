// == menu click events ==
$(function() { // jQuery document ready

  // Display Modes.
  // Set 'Ball and Stick'.
  $("#BS").click(function() {
    $(this).addClass("success");
    $("#SF").removeClass("success");
    $("#WF").removeClass("success");
    viewer.specs.set3DRepresentation('Ball and Stick');
    viewer.updateScene()
  });

  // Set 'Space Filling'.
  $("#SF").click(function() {
    $(this).addClass("success");
    $("#BS").removeClass("success");
    $("#WF").removeClass("success");
    viewer.specs.set3DRepresentation('van der Waals Spheres');
    viewer.updateScene()
  });

  // Set 'Wireframe'.
  $("#WF").click(function() {
    $(this).addClass("success");
    $("#BS").removeClass("success");
    $("#SF").removeClass("success");
    viewer.specs.set3DRepresentation('Wireframe');
    viewer.updateScene()
  });

  // Togle amino acid labels.
  $("#Labs").click(function() {
    viewer.specs.atoms_displayLabels_3D =! viewer.specs.atoms_displayLabels_3D;
    viewer.updateScene()
  }); // End display modes.

  // // Count nitrogen atoms test.
  // $("#test").click(function() {
  //   alert(ChemDoodle.countNitrogens(file));
  // });

  // Load models
  var model;
  $("#PS").change(function() {
    model = $("#PS").val();
    switch(model) {
      case "4F5S":
        file = pdb_4F5S;
        viewer.loadMolecule(file);
        break;
      case "1BEB":
        file = pdb_1BEB;
        viewer.loadMolecule(file);
        break;
      case "1BLF":
        file = pdb_1BLF;
        viewer.loadMolecule(file);
        break;
      case "1B8E":
        file = pdb_1B8E;
        viewer.loadMolecule(file);
        break;
      case "1F6S":
        file = pdb_1F6S;
        viewer.loadMolecule(file);
        break;
    }
  });

  // Right click canvas popup.
  $("#viewer").bind('contextmenu', function(e) {
    // $("#header").css("background-color", "#F49AC2");
    // $("#header").text("Testing.");
    $("#popup").css({
      top: e.pageY - 19,
      left: e.pageX + 6
    }).fadeIn('fast');

    //popupViewer.startAnimation();
    return false;
  });

  // Close popup.
  // Click.
  $("#close").click(function() {
    $("#popup").fadeOut("fast");
    //popupViewer.stopAnimation();
  });
  // Escape key.
  $(document).keydown(function(e) {
    if (e.keyCode == 27) {
      $("#popup").fadeOut("fast");
      //popupViewer.stopAnimation();
    };
  });

});
