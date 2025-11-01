// get one element, optional location
function $(rule, location) {
	const loc = location ? location : document; // use location or document
	return loc.querySelector(rule); // return first match
}

// get multiple elements, returns array
function $$(rule, location) {
	const loc = location ? location : document; // use location or document
	return Array.from(loc.querySelectorAll(rule)); // return all matches
}

// get integer from string, ignore non numbers
function parseInt2(string) {
	return parseInt(
		string
			.split("") // split into chars
			.filter((e) => e.match(/[0-9]/gim)) // keep only numbers
			.join("") // join back
	);
}

// create element and append to body or location
function newElement(tagName, location) {
	return (location ? location : document.body).appendChild(
		document.createElement(tagName) // make element
	);
}

// round number to nearest multiple
function roundTo(num, roundTo, roundingFunction) {
	const parseNum = parseInt(num); // make num int
	const parseRoundTo = parseInt(roundTo); // make roundTo int
	const answer = Math[roundingFunction](parseNum / parseRoundTo) * parseRoundTo; // round
	return answer; // return result
}

// make element draggable
// the following function was adapted from a stack overflow post
// original source unknown (retrieved online)
// minor modifications for this project
function dragElement(
	element,
	{ mouseup = () => {}, mousemove = () => {}, mousedown = () => {} } = {} // default callbacks
) {
	let pos1 = 0, // x delta
		pos2 = 0, // y delta
		pos3 = 0, // prev x
		pos4 = 0; // prev y

	// attach events
	element.onmousedown = dragMouseDown;
	document.onmouseleave = closeDragElement;
	document.onvisibilitychange = closeDragElement;
	element.ontouchstart = dragMouseDown;

	// start drag
	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault(); // stop selection
		e.X = e.clientX; // save x
		e.Y = e.clientY; // save y

		if (mousedown(e) == false) { // stop if callback says no
			document.onvisibilitychange = null;
			document.onmouseup = null;
			document.ontouchend = null;
			document.onmousemove = null;
			document.ontouchmove = null;
			document.onmouseleave = null;
			return;
		}

		pos3 = e.X; // set prev x
		pos4 = e.Y; // set prev y

		// attach move/release
		document.onmouseup = closeDragElement;
		document.ontouchend = closeDragElement;
		document.onmousemove = elementDrag;
		document.ontouchmove = elementDrag;
	}

	// dragging
	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		e.X = e.clientX; // current x
		e.Y = e.clientY; // current y

		mousemove(e); // call callback

		pos1 = pos3 - e.X; // calc delta x
		pos2 = pos4 - e.Y; // calc delta y

		pos3 = e.X; // save prev x
		pos4 = e.Y; // save prev y

		element.style.top = element.offsetTop - pos2 + "px"; // move y
		element.style.left = element.offsetLeft - pos1 + "px"; // move x
	}

	// stop drag
	function closeDragElement() {
		mouseup(); // call callback
		document.onvisibilitychange = null;
		document.onmouseup = null;
		document.ontouchend = null;
		document.onmousemove = null;
		document.ontouchmove = null;
		document.onmouseleave = null;
	}
}

function checkHover(el1, el2) {
	if (!el1 || !el2) {
		throw new Error("Function Error: Missing parameters");
	}
	const col1 = el1.getBoundingClientRect();
	const itembox = el2.getBoundingClientRect();

	if (
		col1.x > itembox.x + itembox.width ||
		col1.x + col1.width < itembox.x ||
		col1.y > itembox.y + itembox.height ||
		col1.y + col1.height < itembox.y
	) {
		return false;
	} else {
		return true;
	}
}