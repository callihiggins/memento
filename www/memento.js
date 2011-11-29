
document.addEventListener("deviceready", onDeviceReady, false);

function preventBehavior(e) 
{ 
    e.preventDefault(); 
};
document.addEventListener("touchmove", preventBehavior, false);


function onDeviceReady(){
    $('#email_entry form').submit(saveSettings);
    $('#email_entry').bind('pageAnimationStart', loadSettings);
    $('#time').bind('pageAnimationStart', loadSettings);

    var email = localStorage.getItem("email");
    
    console.log(localStorage.email);
  
    if(email == null){
        alert("You need to create an account!");
    }
}

function loadSettings() { 
    $('#email').val(localStorage.email); 
    document.getElementById("date").innerHTML = localStorage.returnDate;

}

function saveSettings() { 
    localStorage.email = $('#email').val(); 
    jQT.goBack(); 
    return false;
}

function captureImage() {
    // Launch device camera application, 
    // allowing user to capture up to 2 images
    console.log(localStorage.getItem("email"));
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 2});
}

function captureSuccess(mediaFiles) {
    var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        uploadFile(mediaFiles[i]);
    }       
}

function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
    navigator.notification.alert(msg, null, 'Uh oh!');
}

// Upload files to server
function uploadFile(mediaFile) {
    console.log("upload started");
    $('#header').append('<div id="progress">Developing...</div>');
   
    path = mediaFile.fullPath,
    name = mediaFile.name;
    theEmail = localStorage.email;
    theDate = localStorage.returnDate;
    
    var options = new FileUploadOptions();
	options.fileKey="file";
    
    var params = new Object();
    params.fileName = name;
    params.email =theEmail;
    params.date = theDate;
    
    options.params = params;
   
    console.log(params);
 // console.log(options);
    
    var ft = new FileTransfer();
    
    ft.upload(path,"http://memento.heroku.com/capsules", win, fail, options);      
}

function win(r) {
    console.log('Upload success: ' + r.responseCode);
    console.log(r.bytesSent + ' bytes sent');
    $('#progress').remove();
    navigator.notification.alert('Sent to your future self', null, 'Success!');
}

function fail(message) {
    console.log('Error uploading file ' + path + ': ' + error.code);
    $('#progress').remove();
    //can i call uploadFile like this? check notifaction documentation
    navigator.notification.alert('Upload Failed', uploadFile(mediaFile), 'Try Again');
}

var cb = function(date) {
    console.log(date.toString());
    localStorage.returnDate = date.toString();
    document.getElementById("date").innerHTML = date.toString();
    
}

var show = function(mode) {
    plugins.datePicker.show({
                            date: new Date(),
                            mode: mode, //date or time or blank for both
                            allowOldDates: false
                            }, cb);
}

