// first, store the URL of the current page
const currentURL = new URL(window.location.href);

// if current page is chats page,
if (currentURL.pathname == '/chats/') {
  // derive the x titled chat link on the page
  const xTitle = Array
    // starting from a list of every chat link found on the page,
    .from(document.querySelectorAll('a.title'))
    // then isolating the one containing x for a name
    .find(link => link.innerText == 'x');

  // if x titled link is found and not empty, change its given text to custom text
  (xTitle) && (xTitle.innerText = 'Ride Off Into The Sunset / Directly Into The Future');

  // initialize counter to 1,
  let dateCount = 1;
  // for each date among a list of every date found on the page, starting from the end,
  for (const currentDate of Array.from(document.querySelectorAll('td.date')).reverse()) {
    // change the text so that it is preceded by the current count, padded to a length of two digits
    currentDate.innerText = `[${(dateCount + '').padStart(2, 0)}] ${currentDate.innerText}`;
    // increment the count to the next number up
    dateCount++;
  }
}

// if current page is emails page,
else if (currentURL.pathname == '/emails/') {
  // store first row, clone new row from second row
  const parentLink = document.querySelector('tr').nextElementSibling;
  const firstEmail = parentLink.nextElementSibling;
  const okcHistory = firstEmail.cloneNode(true);

  // store link and link column from cloned row
  const okcLink = okcHistory.querySelector('a');
  const okcColumn = okcLink.parentElement;

  // make cloned row taller
  okcHistory.setAttribute('style', 'height:3em');
  // align column to the top
  okcColumn.setAttribute('valign', 'top');
  // change the link address
  okcLink.setAttribute('href', '/emails/00.html');
  // change the link text
  okcLink.innerText = 'OkCupid Messages';

  // add cloned row to the page after the first row
  parentLink.insertAdjacentElement('afterend', okcHistory);
}

// if current URL is in the emails folder and then followed by a non-zero number,
else if (currentURL.pathname.match(/^\/emails\/(?!00)\d+/)) {
  // store true or false based on whether the current URL includes a hash
  let hasHash = !!currentURL.hash;
  // set a place aside for a currently linked hash to be discovered later
  let currentBookmark;

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
        // then an underscore separating the date from the time of day,
        '_',
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
      // store the link to be bookmarked after all further page modifications are done,
      currentBookmark = bookmarkLink;
      // and stop checking for further hashes
      hasHash = false;
    }
  }

  // add color coding style definitions to the page
  document.head.insertAdjacentHTML('beforeend', `
    <style type="text/css">
      body {
        margin-top: 0px;
      }
      body.colorcoded table.his {
        background: #CEDAFC;
      }
      body.colorcoded table.hers {
        background: #FFB4B4;
      }
      body.colorcoded table.message {
        padding: 0.5em;
      }
      body.colorcoded table.message a:not(.bookmark) {
        color: #000;
        text-decoration: underline dashed;
      }
      body.colorcoded a.bookmark {
        border-radius: 25%;
        padding: 5px;
        background-color: #FFF;
      }
      div.controlbar {
        height: 1.5em;
        font-size: 16pt;
        position: sticky;
        box-sizing: border-box;
        border-bottom: 3px solid #000;
        background: #FFF;
        top: 0px;
        left: 0px;
        width: 100%;
      }
      div.controlbar > .float {
        padding: 0em 1em;
        float: right;
        line-height: 1.3em;
      }
      div.controlbar > input[type="checkbox"] {
        transform: scale(1.4, 1.4) translate(0, 3px);
      }
    </style>
  `);

  // for each message block among a list of every message block found on the page,
  for (const currentMessage of document.querySelectorAll('table.message')) {
    // derive the author style from the text of the message
    const authorStyle = currentMessage.textContent
      // starting from a list of author names confirmed discovered at the start of the message text,
      .match(/^(?:(Rebekah R)|(<φ3)|(artismyjoy)|(# %))/)
      // return a style of his or hers derived from the sequential order of the confirmed discovery
      ?.reduce((acc, value, count) => (value) ? ['his', 'hers'][count % 2] : acc);

    // for each element among a list of every styled element contained within this message block,
    for (const containedElement of currentMessage.querySelectorAll('[style]')) {
      // negate any existing background color
      containedElement.style.backgroundColor = '';
    }

    // add the author style to the current message block
    currentMessage.classList.add(authorStyle);
  }

  // fuck it, let's just force the color coding
  document.body.classList.add('colorcoded');

  // if there is an active bookmark in the URL, jump to it
  (currentBookmark) && (currentBookmark.scrollIntoView());
}

// define tracking function
const track = async function(track_url) {
  const target = 'https://rubberduck.info/track/';
  const form = new FormData();
  form.append('url', track_url);

  let response;
  try {
    response = await fetch(target, {
      method: 'POST',
      body: form
    });
  }
  catch {
    // do nothing
  }

  return response?.status == 200;
}

// track this page view
track(currentURL.href.replace(currentURL.origin, ''));

// add listeners to track each link on click
document.querySelectorAll('a').forEach(function(link) {
  if (link.getAttribute('target') === '_blank') {
    const clickHandler = function(e) {
      const linkURL = new URL(link.href);
      track(linkURL.href.replace(currentURL.origin, ''));
    };
    link.addEventListener('click', clickHandler);
    link.addEventListener('auxclick', clickHandler);
    link.addEventListener('touchstart', clickHandler);
  }
});
