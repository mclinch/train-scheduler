                 
// ------------------------------------------------------------------------------------
$(document).ready(function(){
//FIREBASE=========================================================
var config = {
  apiKey: "AIzaSyAecaQcREDntWxQQ7Pg8RLtADmO7S800lg",
  authDomain: "trainscheduler-52919.firebaseapp.com",
  databaseURL: "https://trainscheduler-52919.firebaseio.com",
  projectId: "trainscheduler-52919",
  storageBucket: "trainscheduler-52919.appspot.com",
  messagingSenderId: "64820836506"
};
 firebase.initializeApp(config);
//VARIABLES=========================================================
var database = firebase.database();
//CONVERT TRAIN TIME================================================
var currentTime = moment();
console.log("Current Time: " + currentTime);
//FUNCTIONS=========================================================

  $("#name-input").val("");
  $("#dest-input").val("");
  $("#time-input").val("");
  $("#freq-input").val("");

// CAPTURE BUTTON CLICK
$("#add-train").on("click", function(event) {
  event.preventDefault();

//VALUES FOR EACH VARIABLE IN HTML
    var name = $('#name-input').val().trim();
    var dest = $('#dest-input').val().trim();
    var time = $('#time-input').val().trim();
    var freq = $('#freq-input').val().trim();

// PUSH NEW ENTRY TO FIREBASE
     // database.ref().push({
    var newTrain = {
      name: name,
      dest: dest,
      time: time,
      freq: freq,
      timeAdded: firebase.database.ServerValue.TIMESTAMP
    };
      
      // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.dest);
  console.log(newTrain.time);
  console.log(newTrain.freq);
  // alert("new train added")
      // });
     // NO REFRESH
  $("#name-input").val("");
  $("#dest-input").val("");
  $("#time-input").val("");
  $("#freq-input").val("");


    //  $("input").val('');
    // return false;
});

//ON CLICK CHILD FUNCTION
database.ref().on("child_added", function(childSnapshot){
     // console.log(childSnapshot.val());
     var name = childSnapshot.val().name;
     var dest = childSnapshot.val().dest;
     var time = childSnapshot.val().time;
     var freq = childSnapshot.val().freq;

     console.log("Name: " + name);
     console.log("Destination: " + dest);
     console.log("Time: " + time);
     console.log("Frequency: " + freq);
     //console.log(moment().format("HH:mm"));

//CONVERT TRAIN TIME================================================
     var freq = parseInt(freq);
     //CURRENT TIME
     var currentTime = moment();
     console.log("CURRENT TIME: " + moment().format('HH:mm'));
     //FIRST TIME: PUSHED BACK ONE YEAR TO COME BEFORE CURRENT TIME
     // var dConverted = moment(time,'hh:mm').subtract(1, 'years');
     var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
     console.log("DATE CONVERTED: " + dConverted);
     var trainTime = moment(dConverted).format('HH:mm');
     console.log("TRAIN TIME : " + trainTime);
     
     //DIFFERENCE B/T THE TIMES 
     var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
     var tDifference = moment().diff(moment(tConverted), 'minutes');
     console.log("DIFFERENCE IN TIME: " + tDifference);
     //REMAINDER 
     var tRemainder = tDifference % freq;
     console.log("TIME REMAINING: " + tRemainder);
     //MINUTES UNTIL NEXT TRAIN
     var minsAway = freq - tRemainder;
     console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
     //NEXT TRAIN
     var nextTrain = moment().add(minsAway, 'minutes');
     console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
     //console.log(==============================);

 //TABLE DATA=====================================================
 //APPEND TO DISPLAY IN TRAIN TABLE
$('#currentTime').text(currentTime);
$('.train-schedule').append(
          "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
          "</td><td id='destDisplay'>" + childSnapshot.val().dest +
          "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
          "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
          "</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + 
          "</td><td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td>" + "</tr>");
 },

function(errorObject){
    console.log("Read failed: " + errorObject.code)
});

$("body").on("click", ".remove-train", function(){
     $(this).closest ('tr').remove();
     getKey = $(this).parent().parent().attr('id');
     database.child(getKey).remove();
});

// database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function(snapshot){
//     // Change the HTML to reflect
//     $("#nameDisplay").html(snapshot.val().name);
//     $("#destDisplay").html(snapshot.val().dest);
//     $("#timeDisplay").html(snapshot.val().time);
//     $("#freqDisplay").html(snapshot.val().freq);
// })

}); //END DOCUMENT.READY


