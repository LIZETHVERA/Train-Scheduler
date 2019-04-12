
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAA5wbTl6qkon_Hx-vK0x1z_Nhgcr2x0Jo",
  authDomain: "trainschedule-27422.firebaseapp.com",
  databaseURL: "https://trainschedule-27422.firebaseio.com",
  projectId: "trainschedule-27422",
  storageBucket: "",
  messagingSenderId: "930157143032"
};

firebase.initializeApp(config);

var database = firebase.database();

var train;
var destination;
var first;
var frecuency;



$('#submit').on('click', function () {
  event.preventDefault();

  train = $('#train-input').val();
  destination = $('#destination-input').val();
  first = $('#first-input').val();
  frecuency = $('#frecuency-input').val();

  database.ref().push({
    train: train,
    destination: destination,
    first: first,
    frecuency: frecuency,

  })
})

database.ref().on('child_added', function (childSnapshot) {
  var tFrequency = (childSnapshot.val().frecuency);
  // First time arrival - input
  var firstTime = (childSnapshot.val().first);

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Difference between the times - First time converted in HHMM
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  // Time apart (remainder)
  var remainder = diffTime % tFrequency;
  console.log(remainder);

  // Minute Until Train
  var minutesAway = tFrequency - remainder;

  // Next Train
  var nextTrain = moment().add(minutesAway, "minutes");
  var tableRow = $('<tr>');

  tableRow.append($('<button>').addClass("update").attr('data-key',childSnapshot.key).text("Update"));
  tableRow.append($('<td>').text(childSnapshot.val().train));
  tableRow.append($('<td>').text(childSnapshot.val().destination));
  tableRow.append($('<td>').text(childSnapshot.val().frecuency));
  tableRow.append($('<td>').text(nextTrain)); // Next arrivals
  tableRow.append($('<td>').text(minutesAway)); // mINUTES AWAY
  tableRow.append($('<button>').addClass("remove").attr('data-key',childSnapshot.key).text("Remove"));
  // tableRow.append($('<td>').text();
  tableRow.appendTo($('#train-display'));
  console.log(childSnapshot);
  
  $('.remove').on('click', function () {
    var row = $(this).closest('tr');
    row.remove();

    var key = $(this).attr('data-key');

    var adaRef = database.ref(key);
    adaRef.remove()
      .then(function () {
        alert("Remove succeeded.");
      })
      .catch(function (error) {
        alert("Remove failed: " + error.message);
      });
  })

  $('.update').on('click', function () {
    var keyUp = $(this).attr('data-key');
    console.log(keyUp);
    
  })



})

