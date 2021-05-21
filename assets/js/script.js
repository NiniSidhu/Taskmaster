var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); //saves tasks onto the local storage 
};

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

$(".list-group").on("click", "p", function() {
  var text = $(this)
  .text()
  .trim();

  //console.log("text"); //this is same as event.target. --> we could use "<p> was clicked" and it would do the same 

  //replace p element with a new text area 
  var textInput = $("<textarea>") //while $("textarea") tells jQuery to find text elemnts; the code we have creates a new textarea <>. 
  //the textarea element is saved in textInput. Only in memory for now, we will append it later. 
  .addClass("form-control")
  .val (text);
  $(this).replaceWith(textInput); //THIS would litterally take the above p and replace it with textInput. 

  textInput.trigger("focus");
});

//To save a task that can be saved when clicked anywhere except <p> on the screen, we use the blur 
$(".list-group").on("blur", "textarea", function(){
  //When users clicks on anything but the text area, we will need to collect a few pieces of data: the current value, the parent element's ID, and the element's position in the list

  //gets text area's current value/text
  var text = $(this)
    .val()
    .trim();

  //gets the sparent ul's id attribute 
  var status = $(this)
    .closest(".list-group")
    .attr("id") //chaining list-group to an id that will be returned as id = list-. the - will be the text which will give us a category name 
    .replace("list-", "");

  //get the task's position in the list of other li elements 
  var index = $(this)
    .closest(".list-group-item")
    .index(); 
  
   //Updates the array and saves the new data onto the local storage 
  tasks[status][index].text = text; 
  saveTasks(); 

  //recreating the p element 
  var taskP = $("<p>")
    .addClass("m-1")
    .text(text);
    
  //replacing the textarea with p element 
  $(this).replaceWith(taskP);

});



//TO Edit the due date when clicked 

$(".list-group").on("click", "span", function() {
  //fetch the current text 
  var date = $(this)
  .text()
  .trim();

  //Create a new input element
  var dateInput = $("<input>") //adding an input function 
  .attr("type", "text") // giving it a type=text
  .addClass("form-control")
  .val(date);

  //swapping the old date with the new date 
  $(this).replaceWith(dateInput);

  //autommatically focus on the new element 
  dateInput.trigger("focus");
});

// When the value of the due date date was changed --> when the elemet's blur occurs. Once again blur means user clicks anywhere on the screem 

$(".list-group").on("blur", "input[type='text']", function(){
  // get the current date (the new one that was added)
  var date = $(this)
    .val() //get the value 
    .trim(); // remove the white noise 

  //get the parent ul's id attribute
  var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

  //get the task's position in the list of other li items 
  var index = $(this)
    .closest(".list-group-item")
    .index();
  
  //updating task in array and re0save to local storage 
  tasks[status][index].date = date; 
  saveTasks(); 

  //Recreate span element with bootstap classes
  var taskSpan = $("<span>")
    .addClass("badge badge-primrary badge-pill")
    .text(date);

  //replace input with span 
  $(this).replaceWith(taskSpan);
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
1) Query Selector: 

jQuery
$("button.continue").html("Next Step ...");

Plain JS
document.querySelector("button.continue").innerHTML = "Next Step ...";

https://api.jquery.com/


*/