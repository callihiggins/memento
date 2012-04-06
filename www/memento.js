
document.addEventListener("deviceready", onDeviceReady, false);

var theImage = new Object();
function preventBehavior(e) 
{ 
    e.preventDefault(); 
};
document.addEventListener("touchmove", preventBehavior, false);


function onDeviceReady(){
    setTimeout(function() {
               navigator.splashscreen.hide();
               }, 3000);

    if (localStorage.confirmed == "true"){
        jQT.goTo('#home');
    } else {
        jQT.goTo('#login_entry');
    }
    
 
    $('#register_entry form').submit(registerEmail);
    $('#login_entry form').submit(checkEmail);
    $('#tag_entry form').submit(saveTags);
    $('#login_entry form').submit(checkEmail);
    $('#reset form').submit(resetPassword);
    $('#caption_entry form').submit(saveCaption);
    $('#range form').submit(saveRangeSettings);
    $('#login_entry').bind('pageAnimationStart', loadSettings);
    $('#time').bind('pageAnimationStart', loadSettings);
    $('#login_email').bind('pageAnimationStart', loadSettings);  
}

function loadSettings() { 
    $('#login_email').val(localStorage.email); 
    $('#time').val(localStorage.time); 
    //  document.getElementById("date").innerHTML = localStorage.returnDate;
}

function logOut(){
    localStorage.confirmed = "false";
    jQT.goTo('#login_entry');
    
}

function registerEmail() {
    localStorage.confirmed = "false";
    console.log("registering email");
    localStorage.email = $('#register_email').val(); 
    localStorage.password = $('#register_password').val(); 
    var postTo = "http://memento.heroku.com/users/new";
    $('#register_entry').append('<div class="progress">Registering...');
    $.post(postTo, 
           {email:localStorage.email, password:localStorage.password},
           function(data) {
           if(data == "") {
           console.log(data);
           $('.progress').remove();
           console.log("email sent");
           jQT.goTo('#login_entry');
           $('.message').remove();
           navigator.notification.alert('Confirm your email address to ensure your photos return to you safely', null, 'Check your email!');
           
           } else {
           console.log(data);
           $('.progress').remove();
           $('.message').remove();
           $('#register_entry').append('<div class="message">' + data);
          // navigator.notification.alert(data, null, "Whoops!");
           }        
           });
    
}

function checkEmail() { 
    var postTo = "http://memento.heroku.com/users/check"; 
    $('#login_entry').append('<div class="progress">Logging In');
    localStorage.email = $('#login_email').val(); 
    localStorage.password = $('#login_password').val(); 
    console.log(localStorage.password);
    $.post(postTo, 
           {email: localStorage.email, password:localStorage.password},
           function(data) {
           $('.progress').remove();
           if(data == "Logging in") 
           {
           localStorage.confirmed = "true";
           console.log(localStorage.confirmed);
           jQT.goTo('#home');  
           $('.message').remove();
           } else {
           console.log(data);
           $('.message').remove();
           $('#login_entry').append('<div class="message">' + data);
          //navigator.notification.alert(data, null, "Whoops!");
           } 
           });
}

function resetPassword(){
    localStorage.email = $('#reset_email').val();  
    var postTo = "http://memento.heroku.com/users/reset";
    $('#reset').append('<div class="progress">Looking up email');
    $.post(postTo, 
           {email:localStorage.email},
           function(data) {
           if(data == "") {
           console.log(data);
           $('.progress').remove();
           console.log("email sent");
           jQT.goTo('#login_entry');
           $('.message').remove();
           navigator.notification.alert('We just sent you a link to reset your password', null, 'Check your email!');
           } else {
           console.log(data);
           $('.progress').remove();
           $('.message').remove();
         //  $('#reset').append('<div class="message">' + data);
          navigator.notification.alert(data, null, "Whoops!");
           }        
           });
    
}

function saveCaption(){
    localStorage.caption = $('#caption').val(); 
    console.log(localStorage.caption);
    jQT.goTo('#tag_entry'); 
    document.getElementById("caption_entry").reset();
    return false;
    
    
}
function saveTags(){
    localStorage.tags = $('#tag_email').val(); 
    jQT.goTo('#time');
    return false;
    
}
function saveTimeSettings() { 
    localStorage.time = $('#time').val(); 
}
function saveRangeSettings() { 
    localStorage.min = $('#minimum').val(); 
    localStorage.max = $('#maximum').val(); 
    
}

function navDate(){
    jQT.goTo('#dateEntered');
    show('date');


}

function generateDate() {
    saveRangeSettings();
    var d = new Date();
    console.log("current date:" + d.toString());
    var min = localStorage.min; 
    console.log("low range: " + min);
    var max = localStorage.max; 
    console.log("high range: " + max);
    var one_month_milli=1000*60*60*24*30;
    var min_milli = min * one_month_milli;
    var max_milli = max * one_month_milli;
    var today = d.getTime();
    console.log("today in millis" + today);
    var time_to_add= Math.floor(Math.random()*(max_milli - min_milli+1)+min_milli);
    console.log("time to add:" + time_to_add);
    var  new_date = Math.round(today) + Math.round(time_to_add);
    console.log("new time to add in millis: " + new_date);
    d.setTime(new_date);
    localStorage.returnDate = d.toDateString();
    console.log("new date to string" + d.toString());
    uploadFile();
}



function cameraButton(){
    $('#home').append('<div class="progress">Loading Camera');
    setTimeout(function() {captureImage();},100);
 //  captureImage();
}

function captureImage() {
    
    // allowing user to capture up to 2 images
   // console.log(localStorage.getItem("email"));
    //  navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 2});
    navigator.camera.getPicture(captureSuccess,
                                onFail,
                                { 
                                quality: 20, 
                                destinationType: navigator.camera.DestinationType.FILE_URI,
                                saveToPhotoAlbum: false
                                });
    $('.progress').remove();
    
    
}

function onFail(error) {
    alert("Fail when getting image. Code = " = error.code);
}


function captureSuccess(imageURI) {
    filename =  imageURI.substr(imageURI.lastIndexOf('/')+1);
    theImage = imageURI;
    jQT.goTo('#caption_entry');
    /*var i, len;
     for (i = 0, len = mediaFiles.length; i < len; i += 1) {
     uploadFile(mediaFiles[i]);
     }  */    
}
// Upload files to server
function uploadFile() {
    $('.clearit').val("");
    jQT.goTo('#home');
    console.log("upload started");
    $('#home').append('<div class="progress">Developing...');
    theEmail = localStorage.email;
    theDate = localStorage.returnDate;
    theCaption = localStorage.caption;
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = theImage.substr(theImage.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    
    var params = new Object();
    params.email =theEmail;
    params.date = theDate;
    params.caption = theCaption;
    params.tags = localStorage.tags;    
    options.params = params;
    
    //options.chunkedMode = false;
    console.log(params);
    // console.log(options);
    
    var ft = new FileTransfer();
    
    ft.upload(theImage,"http://memento.heroku.com/capsules", win, fail, options); 
    $('#settings').show();
    localStorage.tags = "";
    localStorage.returnDate = "";
    localStorage.caption = "";
    document.getElementById("date").innerHTML = "";

}

function win(r) {
    console.log('Upload success: ' + r.responseCode);
    console.log(r.bytesSent + ' bytes sent');
    $('.progress').remove();
    navigator.notification.vibrate();
    navigator.notification.alert('Sent to your future self', null, 'Success!');
}

function fail(error) {
    console.log('Error uploading file ' + path + ': ' + error.code);
    $('.progress').remove();
    navigator.notification.alert('Try Again', uploadFile(), 'Failed to Develop');
}

var cb = function(date) {
    console.log(date.toString());
    localStorage.returnDate = date.toDateString();
    document.getElementById("date").innerHTML = date.toDateString();
    
}

var show = function(mode) {
    plugins.datePicker.show({
                            date: new Date(),
                            mode: mode, //date or time or blank for both
                            allowOldDates: false
                            }, cb);
}


