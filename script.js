// first, store the URL of the current page
const currentURL = new URL(window.location.href);

// if current page is chats page,
if (currentURL.pathname == '/chats/') {
  // derive the last chat link on the page
  const lastLink = Array
    // starting from a list of every chat link found on the page,
    .from(document.querySelectorAll('a.title'))
    // then isolating the one containing the last chat's name
    .find(link => link.innerText == 'x');

  // if last chat link is found and not empty, change its given text to custom text
  (lastLink) && (lastLink.innerText = 'Ride Off Into The Sunset / Directly Into The Future');

  // initialize counter to 1,
  let dateCount = 1;
  // for each date among a list of every date found on the page,
  for (const currentDate of document.querySelectorAll('td.date')) {
    // change the text so that it is preceded by the current count, padded to a length of two digits
    currentDate.innerText = `[${(dateCount + '').padStart(2, 0)}] ${currentDate.innerText}`;
    // increment the count to the next number up
    dateCount++;
  }
}

// if current URL is in the emails folder and then followed by a number,
else if (currentURL.pathname.match(/^\/emails\/\d+/)) {
  // store true or false based on whether the current URL includes a hash
  let hasHash = !!currentURL.hash;

  // define Gmail format to link format date conversion function
  const toDateAnchor = (() => {
    // store a list of each month abbreviation used by Gmail
    const monthNames = ([
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]);

    // define Gmail format to 24h format time conversion function
    const to24HourTime = function(hh, mm, xx) {
      // if within the 12th hour and AM,
      if ((Number(hh) == 12) && (xx == 'AM')) {

        // consider hour to be 00
        hh = '00';
      }
      // if previous to the 12th hour and PM,
      else if ((Number(hh) < 12) && (xx == 'PM')) {

        // add 12 to the current hour
        hh = Number(hh) + 12 + '';
      }
      // return hour, padded to a length of two digits, divided from minutes by a period
      return `${hh.padStart(2, 0)}.${mm}`;
    };

    // return function to be used as date conversion function
    return function(dateText) {
      // isolate and store the individual elements of Gmail's formatted date
      const [ , month, day, year, hour, minute, amPm] = dateText
        .match(/^[A-Za-z]+, ([A-Za-z]+) (\d+), 20(\d+) at (\d+):(\d+) ([AP]M)/);

      // return a list of those elements rearranged such that they match the desired link format
      return [
        // first the month name's position in the list of months, padded to a length of two digits,
        `${(monthNames.indexOf(month) + 1 + '').padStart(2, 0)}-`,
        // next the number of the day, padded to a length of two digits, followed by the year,
        `${day.padStart(2, 0)}-${year}`,
        // then a hyphen separating the date from the time of day,
        ' - ',
        // then the time of day converted to the desired 24h time with the conversion function
        `${to24HourTime(hour, minute, amPm)}`
      // finally, combine that list of rearranged elements into a single item
      ].join('');
    };
  })();

  // for each date among a list of every date found on the page,
  for (const currentDate of document.querySelectorAll('td[align="right"] > font')) {
    // store the date of the item converted from Gmail's date format
    const dateAnchor = toDateAnchor(currentDate.innerText);

    // create a new link with a hash containing the converted date of that item
    const bookmarkLink = document.createElement('a');
    bookmarkLink.classList.add('bookmark');
    bookmarkLink.setAttribute('href', `#${dateAnchor}`);
    bookmarkLink.innerText = 'Link';

    // in the event the link is clicked, scroll the link to the top of the page
    bookmarkLink.addEventListener('click', function(e) {
      bookmarkLink.scrollIntoView();
    });

    // add the new link to the page alongside the current item's date
    currentDate.innerText = `${currentDate.innerText} > `;
    currentDate.insertAdjacentElement('beforeend', bookmarkLink);

    // if there is presently a hash in the URL matching the present item's date,
    if ((hasHash) && (currentURL.hash.endsWith(dateAnchor))) {
      // scroll to that date,
      currentDate.scrollIntoView();
      // and stop checking for further hashes
      hasHash = false;
    }
  }
}
