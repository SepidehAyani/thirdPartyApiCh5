/*
Setting the variables
*/
var currentDate = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
var currentHour = moment().format("H");
var $currentDay = $("#currentDay");

var $eventBlocks = $(".time-block");
var $scheduleSection = $(".schedule");

var eventItems = [];

/*
Function to initialize schedule, and save the event in local storage
*/
function initializeSchedule() {
    $eventBlocks.each(function () {
        var $thisBlock = $(this);
        var thisBlockHr = parseInt($thisBlock.attr("data-hour"));
        var todoObj = {
            hour: thisBlockHr,
            text: "",
        }
        eventItems.push(todoObj);
    });
    localStorage.setItem("todos", JSON.stringify(eventItems));
}

/*
Color coded for each block of time: Present, Past and Future
*/
function setUpTimeBlocks() {
    $eventBlocks.each(function () {

        var $thisBlock = $(this);
        var thisBlockHr = parseInt($thisBlock.attr("data-hour"));

        if (thisBlockHr == currentHour) {
            $thisBlock.addClass("present").removeClass("past future");
        }
        if (thisBlockHr < currentHour) {
            $thisBlock.addClass("past").removeClass("present future");
        }
        if (thisBlockHr > currentHour) {
            $thisBlock.addClass("future").removeClass("past present");
        }
    });
}
/*
Render schedule function to go through the events and assign to the next timeBlock
*/
function renderSchedule() {
    eventItems = localStorage.getItem("todos");
    eventItems = JSON.parse(eventItems);

    for (var i = 0; i < eventItems.length; i++) {
        var itemHour = eventItems[i].hour;
        var itemText = eventItems[i].text;

        $("[data-hour=" + itemHour + "]").children("textarea").val(itemText);
    }
}

/*
Saving function for the added events
*/
function saveHandler() {
    var $thisBlock = $(this).parent();

    var hourToUpdate = $(this).parent().attr("data-hour");
    var itemToAdd = (($(this).parent()).children("textarea")).val();

    for (var j = 0; j < eventItems.length; j++) {
        if (eventItems[j].hour == hourToUpdate) {
            eventItems[j].text = itemToAdd;
        }
    }
    localStorage.setItem("todos", JSON.stringify(eventItems));
    renderSchedule();
}

/*
Loading the document, if the event exists in the local storage, skip, if not, initialize the schedule
*/
$(document).ready(function () {

    setUpTimeBlocks();
    if (!localStorage.getItem("todos")) {
        initializeSchedule();
    }
    //Displaying current date
    $currentDay.text(currentDate);
    renderSchedule();
    $scheduleSection.on("click", "button", saveHandler);
});