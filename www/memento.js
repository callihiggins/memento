
document.addEventListener("deviceready", onDeviceReady, false);

var theImage = new Object();
function preventBehavior(e) 
{ 
    e.preventDefault(); 
};
document.addEventListener("touchmove", preventBehavior, false);


function onDeviceReady(){
    console.log(localStorage.email);
    localStorage.confirmed = "false";
    console.log(localStorage.confirmed);
    $('#register_entry form').submit(registerEmail);
    $('#login_entry form').submit(checkEmail);
    $('#login_entry form').submit(checkEmail);
    $('#caption_entry form').submit(saveCaption);
    $('#range form').submit(saveRangeSettings);
    $('#login_entry').bind('pageAnimationStart', loadSettings);
    $('#time').bind('pageAnimationStart', loadSettings);
    $('#login_email').bind('pageAnimationStart', loadSettings);
 //   console.log(localStorage.email);
//    if(localStorage.confrimed == false){
//        checkEmail();
//    }
    
    if (localStorage.confirmed == "true"){
        jQT.goTo('#home');
    } else {
        jQT.goTo('#login_entry');
    }
}

function loadSettings() { 
    $('#login_email').val(localStorage.email); 
    $('#time').val(localStorage.time); 
  //  document.getElementById("date").innerHTML = localStorage.returnDate;
}


function registerEmail() {
    localStorage.confirmed = "false";
    console.log("registering email");
    localStorage.email = $('#register_email').val(); 
    var postTo = "http://memento.heroku.com/users/new";
    $('#register_entry').append('<div class="progress">Registering...');
    $.post(postTo, 
           {email:localStorage.email},
           function(data) {
           console.log(data.message);
           if(data == "") {
            console.log(data);
            $('.progress').remove();
            console.log("email sent");
           jQT.goTo('#login_entry');
           $('#login_entry').append('<div class="message">Please check your email for a confirmation link before logging in.');
            } else {
           console.log(data);
            $('.progress').remove();
           $('#register_entry').append('<div class="message">' + data + '. Please try again.');
           }        
           });

}

function checkEmail() { 
    var postTo = "http://memento.heroku.com/users/check"; 
    localStorage.email = $('#login_email').val(); 
    console.log(localStorage.email);
        $.post(postTo, 
               {email: localStorage.email},
           function(data) {
           if(data == "exists") 
               {
               localStorage.confirmed = "true";
               console.log(localStorage.confirmed);
               jQT.goTo('#home');  
               } else if (data =="no user") {
               console.log(data);
               $('#login_entry').append('<div class="message">Email address not found. Have you registered?');
               } else {
                $('#login_entry').append('<div class="message">There was an error. Please try again.');
               }
           });
}

function saveCaption(){
    localStorage.caption = $('#caption').val(); 
    console.log(localStorage.caption);
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



function captureImage() {
    // Launch device camera application, 
    // allowing user to capture up to 2 images
    console.log(localStorage.getItem("email"));
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit: 2});
}

function captureSuccess(mediaFiles) {
    theImage =  mediaFiles[0];
    jQT.goTo('#caption_entry');
    /*var i, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        uploadFile(mediaFiles[i]);
    }     */  
}

function captureError(error) {
    var msg = 'An error occurred during capture: ' + error.code;
   }

// Upload files to server
function uploadFile() {
    jQT.goTo('#home');
    console.log("upload started");
    $('#home').append('<div class="progress">Developing...');
   
    path = theImage.fullPath,
    name = theImage.name;
    theEmail = localStorage.email;
    theDate = localStorage.returnDate;
    theCaption = localStorage.caption;
    var options = new FileUploadOptions();
	options.fileKey="file";
    
    var params = new Object();
    params.fileName = name;
    params.email =theEmail;
    params.date = theDate;
    params.caption = theCaption;
    
    options.params = params;
   
    console.log(params);
 // console.log(options);
    
    var ft = new FileTransfer();
    
    ft.upload(path,"http://memento.heroku.com/capsules", win, fail, options); 
    $('#settings').show();
}

function win(r) {
    console.log('Upload success: ' + r.responseCode);
    console.log(r.bytesSent + ' bytes sent');
    $('.progress').remove();
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

