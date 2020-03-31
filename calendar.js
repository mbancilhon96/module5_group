//document.addEventListener("DOMContentLoaded", initialize());
let userid; 
let event_group;

(function () {
	"use strict";

	/* Date.prototype.deltaDays(n)
	 * 
	 * Returns a Date object n days in the future.
	 */
	Date.prototype.deltaDays = function (n) {
        // relies on the Date object to automatically wrap between months for us
        // newDate = new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
        // return newDate;
        return new Date(this.getFullYear(), this.getMonth(), this.getDate() + n);
	};

	/* Date.prototype.getSunday()
	 * 
	 * Returns the Sunday nearest in the past to this date (inclusive)
	 */
	Date.prototype.getSunday = function () {
		return this.deltaDays(-1 * this.getDay());
    };
    
    //console.log("inside closure");
}());

//================
/** Week
 * 
 * Represents a week.
 * 
 * Functions (Methods):
 *	.nextWeek() returns a Week object sequentially in the future
 *	.prevWeek() returns a Week object sequentially in the past
 *	.contains(date) returns true if this week's sunday is the same
 *		as date's sunday; false otherwise
 *	.getDates() returns an Array containing 7 Date objects, each representing
 *		one of the seven days in this month
 */
function Week(initial_d) {
	"use strict";

	this.sunday = initial_d.getSunday();
		
	
	this.nextWeek = function () {
		return new Week(this.sunday.deltaDays(7));
	};
	
	this.prevWeek = function () {
		return new Week(this.sunday.deltaDays(-7));
	};
	
	this.contains = function (d) {
		return (this.sunday.valueOf() === d.getSunday().valueOf());
	};
	
	this.getDates = function () {
		var dates = [];
		for(var i=0; i<7; i++){
			dates.push(this.sunday.deltaDays(i));
		}
		return dates;
	};
};

/** Month
 * 
 * Represents a month.
 * 
 * Properties:
 *	.year == the year associated with the month
 *	.month == the month number (January = 0)
 * 
 * Functions (Methods):
 *	.nextMonth() returns a Month object sequentially in the future
 *	.prevMonth() returns a Month object sequentially in the past
 *	.getDateObject(d) returns a Date object representing the date
 *		d in the month
 *	.getWeeks() returns an Array containing all weeks spanned by the
 *		month; the weeks are represented as Week objects
 */
function Month(year, month) {
	"use strict";
	
	this.year = year;
	this.month = month;
	
	this.nextMonth = function () {
		return new Month( year + Math.floor((month+1)/12), (month+1) % 12);
	};
	
	this.prevMonth = function () {
		return new Month( year + Math.floor((month-1)/12), (month+11) % 12);
	};
	
	this.getDateObject = function(d) {
		return new Date(this.year, this.month, d);
	};
	
	this.getWeeks = function () {
		var firstDay = this.getDateObject(1);
		var lastDay = this.nextMonth().getDateObject(0);
		
		var weeks = [];
		var currweek = new Week(firstDay);
		weeks.push(currweek);
		while(!currweek.contains(lastDay)){
			currweek = currweek.nextWeek();
			weeks.push(currweek);
		}
		
		return weeks;
	};
};

// For our purposes, we can keep the current month in a variable in the global scope
$(document).ready(function() {

    isUserLoggedIn();

    var currentMonth = new Month(2020, 2); // March 2020

    //load 
    document.getElementById("error-msg-login").style.display = "none";

    document.getElementById("create-event-btn").style.display = "none";

    document.getElementById("groups").style.display = "none";
    document.getElementById("reset_event_filters").style.display = "none";

    document.getElementById("event-tools-container").style.display = "none";

    document.getElementById("next_month_btn").addEventListener("click", function(event){
        currentMonth = currentMonth.nextMonth(); // Previous month would be currentMonth.prevMonth()
        updateCalendar(currentMonth); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    }, false);  

    document.getElementById("prev_month_btn").addEventListener("click", function(event){
        currentMonth = currentMonth.prevMonth(); // Previous month would be currentMonth.prevMonth()
        updateCalendar(currentMonth); // Whenever the month is updated, we'll need to re-render the calendar in HTML
    }, false);

    document.getElementById("month-name").innerHTML = currentMonth.year + " " + currentMonth.month;

    document.getElementById("login-submit").addEventListener("click", loginAjax, false);


    document.getElementById("register-submit").addEventListener("click", registerAjax, false);

    document.getElementById("create-event-final-btn").addEventListener("click", addEvent, false);

    document.getElementById("time-dropdown-1-content").style.display = "none";

    document.getElementById("time-dropdown-2-content").style.display = "none";

    document.getElementById("popup-event-card-body").style.display = "none";
    //========Reset event filters===========

    $('#reset_event_filters').on('click',function(e){
        document.getElementById("calendarObject").setAttribute("class","calendar-container")

    });

    //========Filter by event group ajax===========
    $('#groups').on('click','button',function(e){
        event.preventDefault()
        let user_id=userid
        let name = this.value
        event_group=this.value

        //remove all previous selected events
        Array.from(document.getElementsByClassName("event filtered")).forEach(function(event){
            event.setAttribute("class","event")
        })
       // document.getElementById("calendarObject").childNodes.setAttribute("class","event")
        document.getElementById("calendarObject").setAttribute("class","calendar-container filter-on")
       // var r = $('<input type="button" value="' + name + '">');
        let eventNode=document.getElementsByClassName("calendarEvent")[0]
        event.preventDefault()

         $.ajax({
            data:{"user_id":user_id,"event_type":name},
            type:"post",
            url:"filter_event_ajax.php",
            success: function(response){
                jsonResponse=JSON.parse(response)
                console.log(jsonResponse)
                jsonResponse.forEach(function(event) {
                    document.getElementById(event.event_id).setAttribute("class", "event filtered")
                })
                //return a list of eventIDs. Set their display to block and other displays to none
            }
        })
    })

    document.getElementById("create-event-btn").addEventListener("click", function(event) {
        if (document.getElementById("event-tools-container").style.display == "block") {
            document.getElementById("event-tools-container").style.display = "none";
        } else { 
            document.getElementById("event-tools-container").style.display = "block";
        }
    });

    document.getElementById("time-dropdown-1-btn").addEventListener("click", function(event){
        event.preventDefault();
        // populateTime();
        if (document.getElementById("time-dropdown-1-content").style.display == "block") {
            document.getElementById("time-dropdown-1-content").style.display = "none";
        } else { 
            document.getElementById("time-dropdown-1-content").style.display = "block";
        }
    });

    document.getElementById("time-dropdown-2-btn").addEventListener("click", function(event){
        event.preventDefault();
        // populateTime();
        if (document.getElementById("time-dropdown-2-content").style.display == "block") {
            document.getElementById("time-dropdown-2-content").style.display = "none";
        } else { 
            document.getElementById("time-dropdown-2-content").style.display = "block";
        }
    });

    document.getElementById("popup-event-card-body").addEventListener("click", function(event){
        if (document.getElementById("popup-event-card-body").style.display == "block") {
            document.getElementById("popup-event-card-body").style.display = "none";
        } else { 
            document.getElementById("popup-event-card-body").style.display = "block";
        }
        let eventTitle = document.getElementById("popup-event-title");
        let eventTimeBegin = document.getElementById("popup-event-time-begin");
        let eventTimeEnd = document.getElementById("popup-event-time-end");
        let eventDescription = document.getElementById("popup-event-description");
        eventTitle.innerHTML = " ";
        eventTimeBegin.innerHTML = " ";
        eventTimeEnd.innerHTML =  " ";
        eventDescription.innerHTML = " ";
    });

    populateTime1(); 

    populateTime2();

    initializeCalendar();
    
});

function getCurrentYear() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + " " + mm + " " + dd;
    return yyyy;
}

function getCurrentMonth() {
    var today = new Date();
    //console.log(today);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + " " + mm + " " + dd;
    return mm;
}

function getCurrentDay() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + " " + mm + " " + dd;
    return dd;
}

function convertToDateFormat(month) {
    month--;
    return month;
}

function initializeCalendar() {
    console.log("initializeCalendar ran");
    let currentMonth = getCurrentMonthObject();

    let monthContainer = document.getElementById("month-container");
    $(monthContainer).empty();
    document.getElementById("month-name").innerHTML = currentMonth.year + " " + currentMonth.month;

    let weeks = currentMonth.getWeeks();
    let daysArray = [];
    let counter = 0;

    for(var theWeek in weeks){
        var days = weeks[theWeek].getDates();
        for(var theDay in days){
            daysArray.push(days[theDay]);
        }
    }

    for (var i = 1; i < 6; i++) {
        let weekNode = document.createElement("li");
        let weekName = document.createAttribute("name");
        let weekClass = document.createAttribute("class");
        let weekId = document.createAttribute("id");
        weekName.value = "week";
        weekClass.value = "week-container" + i;
        weekId.value = "week-container" + i;
        weekNode.setAttributeNode(weekName);
        weekNode.setAttributeNode(weekClass);
        weekNode.setAttributeNode(weekId);
        document.getElementById("month-container").appendChild(weekNode);
    }

    for (var k = 1; k < 6; k++) {
       for (var i = 0; i < 7; i++) {
        let dayNode = document.createElement("div");
        let dayName = document.createAttribute("name");
        let dayClass = document.createAttribute("class");
        let regex = /\d\d\s/; 
        let dayString = daysArray[counter].toString();
        let dayTwoDigitValue = dayString.substring(dayString.search(regex), 10);
        let dayValue = document.createTextNode(dayTwoDigitValue);
        let yearValue = currentMonth['year'];
        let monthValue = currentMonth['month'];
        monthValue++;
        if (monthValue < 10) {
            monthValue = "0" + monthValue;
        }
        let dayId = document.createAttribute("id");
        dayName.value = "day";
        dayClass.value = "day" + counter;
        dayId.value = yearValue.toString() + "-" + monthValue.toString() + "-" + dayTwoDigitValue.toString();
        dayNode.setAttributeNode(dayName);
        dayNode.setAttributeNode(dayClass);
        dayNode.setAttributeNode(dayId);
        dayNode.append(dayValue);
        document.getElementById(`week-container${k}`).appendChild(dayNode);
        counter++;
       }
    };
}

function updateCalendar(currentMonth){
    console.log("updateCalendar ran");
    let monthContainer = document.getElementById("month-container");
    $(monthContainer).empty();
    document.getElementById("month-name").innerHTML = currentMonth.year + " " + currentMonth.month;

    let weeks = currentMonth.getWeeks();
    let daysArray = [];
    let counter = 0;
    var todayId;
    for(var theWeek in weeks){
        var days = weeks[theWeek].getDates();
        for(var theDay in days){
            daysArray.push(days[theDay]);
        }
    }

    for (var i = 1; i < 6; i++) {
        let weekNode = document.createElement("li");
        let weekName = document.createAttribute("name");
        let weekClass = document.createAttribute("class");
        let weekId = document.createAttribute("id");
        weekName.value = "week";
        weekClass.value = "week-container" + i;
        weekId.value = "week-container" + i;
        weekNode.setAttributeNode(weekName);
        weekNode.setAttributeNode(weekClass);
        weekNode.setAttributeNode(weekId);
        document.getElementById("month-container").appendChild(weekNode);
    }

    for (var k = 1; k < 6; k++) {
       for (var i = 0; i < 7; i++) {
        let dayNode = document.createElement("div");
        let dayName = document.createAttribute("name");
        let dayClass = document.createAttribute("class");
        let regex = /\d\d\s/; 
        let dayString = daysArray[counter].toString();
        let dayTwoDigitValue = dayString.substring(dayString.search(regex), 10);
        let dayValue = document.createTextNode(dayTwoDigitValue);
        let yearValue = currentMonth['year'];
        let monthValue = currentMonth['month'];
        monthValue++;
        if (monthValue < 10) {
            monthValue = "0" + monthValue;
        }
        let dayId = document.createAttribute("id");
        dayName.value = "day";
        dayClass.value = "day" + counter;
        dayId.value = yearValue.toString() + "-" + monthValue.toString() + "-" + dayTwoDigitValue.toString();
        todayId = dayId.value;
        dayNode.setAttributeNode(dayName);
        dayNode.setAttributeNode(dayClass);
        dayNode.setAttributeNode(dayId);
        dayNode.append(dayValue);
        document.getElementById(`week-container${k}`).appendChild(dayNode);
        counter++;
       }
    };

    //highlightToday(todayId);

    loadEventsIntoCalendar(currentMonth);
};

function getCurrentMonthObject() {
    let currentYear = getCurrentYear();
    let currentMonthSpecialFormat = getCurrentMonth();
    let currentDay = getCurrentMonth();
    let currentMonthNormalFormat = convertToDateFormat(currentMonthSpecialFormat);
    let currentMonth = new Month(currentYear, currentMonthNormalFormat);
    return currentMonth;
}


function loadEventsIntoCalendar(currentMonth) {
    console.log("loadEventsIntoCalendar ran");
    let pathToPhpFile = 'http://ec2-18-219-250-89.us-east-2.compute.amazonaws.com/~mel/module5_2/get_events_ajax.php';
    let data = {
        userid: userid
    };
    fetch(pathToPhpFile, {
        method: "POST",
        body: JSON.stringify(data),
        header: {'content-type': 'application/json'}
    })
    .then(res => res.json())
    .then(function(response) {
        if(response[0]['success'] == true) {
            console.log('successfully gotten events');
            for(let length = 0; length < response.length; length++) {
                let eventObject = response[length];
                console.log(eventObject);
                let eventNode = document.createElement("div");
                let eventNodeTitle = document.createTextNode(eventObject['event_title']);
                eventNode.append(eventNodeTitle);
                let eventClass = document.createAttribute("class");
                eventClass.value = "event";
                eventNode.setAttribute("class","calendarEvent")
                eventNode.setAttributeNode(eventClass);
                let begin_date = eventObject['date_begin'];
                let end_date = eventObject['date_end'];
                for (let index = begin_date; index <= end_date; index ++) {
                    if (document.getElementById(index) != undefined) {
                        let eventNodeId = document.createAttribute("id");
                        eventNodeId.value = eventObject['event_id'];
                        eventNode.setAttribute("id","event"+eventNodeId)
                        eventNode.setAttributeNode(eventNodeId);
                        document.getElementById(index).append(eventNode);
                        console.log(eventNodeId);
                        console.log(eventNode.getAttribute("id"));

                        eventNode.addEventListener("click", function(event) {

                            //========Set placeholder values in edit form=======
                            document.getElementById("title-edit").setAttribute("value",eventObject['event_title'])
                            document.getElementById("date-edit").setAttribute("value",eventObject['date_begin'])
                            document.getElementById("start-edit").setAttribute("value",eventObject['time_begin'])
                            document.getElementById("end-edit").setAttribute("value",eventObject['time_end'])
                            document.getElementById("description-edit").setAttribute("value",eventObject['description'])

                            //display modal
                            var modal = document.getElementById("myModal");
                            modal.style.display = "block";
                            //======close EDIT AND DELETE======
                            var span = document.getElementsByClassName("close")[0];
                            span.onclick = function() {
                                modal.style.display = "none";
                            }
                            // When the user clicks anywhere outside of the modal, close it
                            window.onclick = function(event) {
                                if (event.target == modal) {
                                modal.style.display = "none";
                                }
                            } 
                            //========Delete event ajax===========
                            $(document).on('click','#delete_event',function(e){
                                e.preventDefault()
                              let event_id=eventObject['event_id']

                              $.ajax({
                                  data:{"event_id":event_id},
                                  type:"post",
                                  url:"delete_event_ajax.php",
                                  success: function(response){
                                  }
                              })
                            })
                            //========Edit event ajax===========
                            $(document).on('click','#edit_event',function(e){
                                e.preventDefault()
                                let event_id=eventObject['event_id']
                                var data=$("#edit_form").serialize()+"&event_id="+event_id;

                              $.ajax({
                                  data:data ,
                                  type:"post",
                                  url:"edit_event_ajax.php",
                                  success: function(response){
                                    updateCalendar(getCurrentMonthObject());
                                  }
                              })
                            })
                        });
                    } else {
                        console.log('this event is not in this current month');
                    }
                }
            }
        } else {
            console.log('nope');
        }
    })
}

function isUserLoggedIn() {
    $.ajax({
        type:"get",
        url:"get_user.php",
        success: function(response){
            response = JSON.parse(response);
            if (response.success){
                userIsLoggedIn(response.userid)
            }
        }
    })
}

function userIsLoggedIn(user) {
    userid = user;
    console.log('successfully logged in');
    var forms_container = document.getElementById("forms-container");
    forms_container.parentNode.removeChild(forms_container);
    document.getElementById("welcome-text").innerHTML="Welcome Back to WuCalendar, " + user;

    document.getElementById("create-event-btn").style.display = "block";
    document.getElementById("groups").style.display = "block";
    document.getElementById("reset_event_filters").style.display = "block";

    updateCalendar(getCurrentMonthObject());
}

function loginAjax(event) {
    event.preventDefault();
    console.log("loginAjax ran");
    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;
    let pathToPhpFile = 'http://ec2-18-219-250-89.us-east-2.compute.amazonaws.com//~mel/module5_2/login_ajax.php';
    let data = { 
        username: username, 
        password: password
    };

    fetch(pathToPhpFile, {
        method: "POST",
        body: JSON.stringify(data),
        header: {'content-type': 'application/json'}
    })
    .then(res => res.json())
    //.then(response => console.log(JSON.stringify(response)))
    .then(function(response){
        //console.log(response);
        if (response['success']==true) {
            userIsLoggedIn(response['userid'])
            // userid = response['userid'];
            // console.log('successfully logged in');
            // var forms_container = document.getElementById("forms-container");
            // forms_container.parentNode.removeChild(forms_container);
            // document.getElementById("welcome-text").innerHTML="Welcome Back to WuCalendar, " + response['firstname'];

            // document.getElementById("create-event-btn").style.display = "block";
            // document.getElementById("groups").style.display = "block";
            // document.getElementById("reset_event_filters").style.display = "block";

            // updateCalendar(getCurrentMonthObject());
        } else {
            console.log('failure to log in');
            document.getElementById("error-msg-login").style.display = "block";
        }
    })
    .catch(error => console.error('Error:', error));


}

function registerAjax(event) {
    event.preventDefault();
    let username = document.getElementById("username-register").value;
    let password = document.getElementById("password-register").value;
    let firstname = document.getElementById("firstname-register").value;
    let lastname = document.getElementById("lastname-register").value;
    let email = document.getElementById("email-register").value;
    console.log(username, password, firstname, lastname, email);
    const pathToPhpFile = 'http://ec2-18-219-250-89.us-east-2.compute.amazonaws.com//~mel/module5_2/register_ajax.php';
    const data = { 
        username: username, 
        password: password,
        firstname: firstname,
        lastname: lastname,
        email: email
    };
    fetch(pathToPhpFile, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
    .then(res => res.json())
    .then(function(response){
        console.log(response);
        if (response['success']==true) {
            console.log('successfully registered');
            var forms_container = document.getElementById("forms-container");
            forms_container.parentNode.removeChild(forms_container);
            // let user_id = response['user']
            document.getElementById("welcome-text").innerHTML="Welcome Back to WuCalendar, " + response['firstname'];
        } else {
            console.log('failure to register');
            document.getElementById("error-msg-register").style.display = "block";
        }
    })
    .catch(error => console.error('Error:', error));
}



function addEvent(event) {
    event.preventDefault();
    let event_title = document.getElementById("event-title-input").value;
    let event_date_begin = document.getElementById("date-input-1").value;
    let event_date_end = document.getElementById("date-input-2").value;
    let event_time_begin = document.getElementById("time-dropdown-1-btn").innerHTML;
    let event_time_end = document.getElementById("time-dropdown-2-btn").innerHTML;
    let event_description = document.getElementById("event-description-input").value;
    let group = document.getElementById("group").value;
    let shared_users = document.getElementById("shared_users").value;

    console.log(event_title, event_date_begin, event_date_end, event_time_begin, event_time_end, event_description, userid,shared_users);
    let pathToPhpFile = 'http://ec2-18-219-250-89.us-east-2.compute.amazonaws.com//~mel/module5_2/add_event_ajax.php';
    let data = {
        title: event_title,
        date_begin: event_date_begin,
        time_begin: event_time_begin,
        date_end: event_date_end,
        time_end: event_time_end,
        description: event_description,
        userid: userid,
        group:group,
        shared_users:shared_users

    };
    fetch(pathToPhpFile, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    })
    .then(res => res.json())
    .then(function(response){
        console.log(response);
        if (response['success']==true) {
            console.log('successfully added event');
            document.getElementById('create-event-btn').click();
            updateCalendar(getCurrentMonthObject());
        } else {
            console.log('failure to add event');
        }
    })
    .catch(error => console.error('Error:', error));
}

function populateTime1(event) {
    let dropdown = document.getElementById("time-dropdown-1-content");
    for(i = 0; i < 1390; i += 60) {
        let hours = Math.floor(i/60);
        if(hours == 0) {
            hours = 12;
        }
        if(hours >= 1 && hours <=9) {
            hours = "0" + hours;
        }
        for(j = 0; j <= 45; j += 15) {
            let minute = j;
            if(minute == 0) {
                minute = minute + "0";
            }
            let timeOption = document.createElement("option");
            let timeOptionClass = document.createAttribute("class");
            timeOptionClass.value = "dropdown-time-option";
            timeOption.setAttributeNode(timeOptionClass);
            let time = hours.toString() + ":" +  minute.toString();
            timeOption.innerHTML = time;
            timeOption.addEventListener('click', function(){
                document.getElementById('time-dropdown-1-btn').innerHTML = this.innerHTML;
                document.getElementById('time-dropdown-1-btn').click();
            })
            dropdown.append(timeOption);
        }
    }
}

function populateTime2(event) {
    let dropdown = document.getElementById("time-dropdown-2-content");
    for(i = 0; i < 1390; i += 60) {
        let hours = Math.floor(i/60);
        if(hours == 0) {
            hours = 12;
        }
        if(hours >= 1 && hours <=9) {
            hours = "0" + hours;
        }
        for(j = 0; j <= 45; j += 15) {
            let minute = j;
            if(minute == 0) {
                minute = minute + "0";
            }
            let timeOption = document.createElement("option");
            let timeOptionClass = document.createAttribute("class");
            timeOptionClass.value = "dropdown-time-option";
            timeOption.setAttributeNode(timeOptionClass);
            let time = hours.toString() + ":" +  minute.toString();
            timeOption.innerHTML = time;
            timeOption.addEventListener('click', function(){
                document.getElementById('time-dropdown-2-btn').innerHTML = this.innerHTML;
                document.getElementById('time-dropdown-2-btn').click();
            })
            dropdown.append(timeOption);
        }
    }
}

function highlightToday(dayId) {
    document.getElementById(dayId).classList.add("today");
}