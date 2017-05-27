



                  
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
  alert("new train added")
      // });
     // NO REFRESH
     $("input").val('');
    return false;
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





// -----------------------------------------------------------------------------------

// var url ="https://trainscheduler-52919.firebaseio.com";
// var dataRef = firebase.database().ref().child('train');
// var name ='';
// var destination = '';
// var firstTrainTime = '';
// var frequency = '';
// var nextTrain = '';
// var nextTrainFormatted = '';
// var minutesAway = '';
// var firstTimeConverted = '';
// var currentTime = '';
// var diffTime = '';
// var tRemainder = '';
// var minutesTillTrain = '';
// var keyHolder = '';
// var getKey = '';


// $(document).ready(function() {

//      $("#add-train").on("click", function() {

//      	name = $('#name-input').val().trim();
//      	destination = $('#destination-input').val().trim();
//      	firstTrainTime = $('#first-train-time-input').val().trim();
//      	frequency = $('#frequency-input').val().trim();
//           firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
//           currentTime = moment();
//           diffTime = moment().diff(moment(firstTimeConverted), "minutes");
//           tRemainder = diffTime % frequency;
//           minutesTillTrain = frequency - tRemainder;
//           nextTrain = moment().add(minutesTillTrain, "minutes");
//           nextTrainFormatted = moment(nextTrain).format("hh:mm");

//      	// Code for the push
//      	keyHolder = dataRef.push({
//      		name: name,
//      		destination: destination,
//      		firstTrainTime: firstTrainTime,  // 2:22 in my example
//      		frequency: frequency,
//                nextTrainFormatted: nextTrainFormatted,
//                minutesTillTrain: minutesTillTrain
//      	});
//           // The notes below are for finding the path to the key in the data being pushed, leaving as notes to save for later use.
//           console.log(keyHolder.path.u[0]);
//           var key = keyHolder.path.u[0];
//           console.log(key);
//      	// Don't refresh the page!

//           $('#name-input').val('');
//      	$('#destination-input').val('');
//      	$('#first-train-time-input').val('');
//      	$('#frequency-input').val('');

//      	return false;
//      });
//           //id=" + "'" + keyHolder.path.u[0] + "'" + "
//      dataRef.on("child_added", function(childSnapshot) {
// 	// full list of items to the well

// 		$('.train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.key() + "'" + ">" +
//                "<td class='col-xs-3'>" + childSnapshot.val().name +
//                "</td>" +
//                "<td class='col-xs-2'>" + childSnapshot.val().destination +
//                "</td>" +
//                "<td class='col-xs-2'>" + childSnapshot.val().frequency +
//                "</td>" +
//                "<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted + // Next Arrival Formula ()
//                "</td>" +
//                "<td class='col-xs-2'>" + childSnapshot.val().minutesTillTrain + // Minutes Away Formula
//                "</td>" +
//                "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td>" +
//           "</tr>");
// // Handle the errors
// }, function(errorObject){
// 	//console.log("Errors handled: " + errorObject.code)
// });

// $("body").on("click", ".remove-train", function(){
//      $(this).closest ('tr').remove();
//      getKey = $(this).parent().parent().attr('id');
//      dataRef.child(getKey).remove();
// });

// }); // Closes jQuery wrapper