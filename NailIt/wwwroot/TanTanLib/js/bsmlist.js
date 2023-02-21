// openCity>bsmlist, cityName>manageobj
//  後臺管理列清單切換-----------------------------------------------------------------------------  
function bsmlist(evt, manageobj) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace("active", "");
    }
  
  document.getElementById(manageobj).style.display = "block";
  evt.currentTarget.className += "active";
  
}



// 檢舉項目Modal審核表 ----------------------------------------------------------------------
$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
})


