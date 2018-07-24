
// Add Modal tag in the html body.

document.head.innerHTML += '<link rel="stylesheet" href="modal.css">';
document.body.innerHTML += ` <!-- The Modal -->
  <div id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <span class="modal-close">&times;</span>
      </div>
      <div class="modal-body">
        <div id="modal-message"></div>
      </div>
      <div class="modal-footer">
      </div>
    </div>
  </div>`;

// --------------------------- For Modal -------------------------------
// Get the modal
var modal = document.querySelector('#myModal');

// Get the <span> element that closes the modal
var modalSpan = document.querySelector(".modal-close");

// When the user clicks on <span> (x), close the modal
modalSpan.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

window.addEventListener('keydown', function(e){
	e = e || window.event;
  if((e.key=='Escape'||e.key=='Esc'||e.keyCode==27||e.which==13||e.keyCode==13)){
  	if (modal.style.display == "block") {
      	modal.style.display = "none";
        e.preventDefault();
  	    return false;
      }
  }
}, true);
// ---------------------------------------------------------------------

function showModalMsg(msg, isError = false) {
  var msgModal = document.querySelector('#myModal');
  var modalMsgField = document.querySelector("#modal-message");
  modalMsgField.style.color = (isError ? "red" : "green");
  modalMsgField.innerHTML = msg;
  msgModal.style.display = "block";
}

function hideModalMsg() {
  var msgModal = document.querySelector('#myModal');
  msgModal.style.display = "none";
}
