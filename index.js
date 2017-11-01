'use strict';

function div() {
	return $('<div>');
}

function showDeadlines(deadlines) {
	// Turn due dates into moments.
	for (var i = 0; i < deadlines.length; i++) {
		// times are in UTC.
		deadlines[i].due = moment.utc(deadlines[i].due, "YYYY-MM-DD HH:mm").local();
		if (!deadlines[i].due.isValid()) {
			console.log("Deadline " + i + " not valid");
			return;
		}
	}
	
	var today = moment();
	var todayOffset = -2;
	var currentDay = moment(today).add(todayOffset, 'd');
	// Remove deadlines from too long ago.
	while (deadlines.length > 0 && deadlines[0].due.isBefore(currentDay, 'day')) {
		deadlines.shift();
	}
	
	var main = $('#main');
	// Add deadlines to HTML, 1 day at a time.
	while (deadlines.length > 0) {
		var ele = div();
		ele.addClass('box');
		main.append(ele);
		
		// Left and right divs for the day.
		var left = div();
		left.addClass('left');
		ele.append(left);
		var leftDay = div();
		leftDay.text(currentDay.format('dd DD MMM'));
		if (todayOffset == 0) {
			leftDay.addClass('today');
		}
		left.append(leftDay);
		
		
		// Background color.
		var bgClass = 'none';
		var dayOfWeek = currentDay.day();
		if (dayOfWeek == 0 || dayOfWeek == 6) {
			bgClass = 'weekend';
		}
		
		var red = 'overdue';
		// If deadlines on currentDay.
		if (deadlines.length > 0 && deadlines[0].due.isSame(currentDay, 'day')) {
			bgClass = 'due';
			// Before today.
			if (todayOffset < 0) {
				bgClass = red;
			}
			var right = div();
			right.addClass('right');
			ele.append(right);
			
			// Add each deadline on this day.
			while (deadlines.length > 0 && deadlines[0].due.isSame(currentDay, 'day')) {
				var deadline = deadlines.shift();
				// When the lab ends.
				var labEnd;
				if (deadline.lab_hours !== undefined) {
					labEnd = moment(deadline.due).add(deadline.lab_hours, 'h');
				}
				
				var deadlineDiv = div();
				if (deadline.due.isBefore(today)) {
					var deadlineDivClass = red;
					if (deadline.lab_hours !== undefined && labEnd.isAfter(today)) {
						// Orange if lab is now.
						deadlineDivClass = 'duenow';
					}
					deadlineDiv.addClass(deadlineDivClass);
				}
				right.append(deadlineDiv);
				
				var deadlineLeft = div();
				deadlineLeft.addClass('deadlineLeft');
				deadlineDiv.append(deadlineLeft);
				if (deadline.lab_hours === undefined) {
					deadlineLeft.text(deadline.due.format('HH:mm'));
				} else {
					var timeDiv = div();
					timeDiv.text(deadline.due.format('HH:mm') + '-' + labEnd.format('HH:mm'));
					deadlineLeft.append(timeDiv);
				}
				
				var deadlineRight = div();
				deadlineRight.addClass('deadlineRight');
				deadlineDiv.append(deadlineRight);
				
				var moduleDiv = div();
				moduleDiv.html(deadline.module);
				deadlineRight.append(moduleDiv);
				
				var taskDiv = div();
				taskDiv.html(deadline.task);
				deadlineRight.append(taskDiv);
			}
		} else {
			// Make day and date fit on 1 line.
			//left.css('width', '100px');
		}
		
		ele.addClass(bgClass);
		// Next day.
		todayOffset++;
		currentDay.add(1, 'd');
	}
};
