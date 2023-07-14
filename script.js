const currentURL = new URL(window.location.href);

if (currentURL.pathname == '/chats/') {
  const lastLink = Array
    .from(document.querySelectorAll('a.title'))
    .find(link => link.innerText == 'x');

  (lastLink) && (lastLink.innerText = 'Ride Off Into The Sunset / Directly Into The Future');

  let dateCount = 1;
  for (currentDate of document.querySelectorAll('td.date')) {
    currentDate.innerText = `[${(dateCount + '').padStart(2, 0)}] ${currentDate.innerText}`;

    dateCount++;
  }
}
else if (currentURL.pathname.match(/^\/emails\/\d+/)) {
  let hasHash = !!currentURL.hash;

  const toDateAnchor = (() => {
    const monthNames = ([
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]);
    const to24HourTime = function(hh, mm, xx) {
      if ((Number(hh) == 12) && (xx == 'AM')) {

        hh = '00';
      }
      else if ((Number(hh) < 12) && (xx == 'PM')) {

        hh = Number(hh) + 12 + '';
      }
      return `${hh.padStart(2, 0)}.${mm}`;
    };
    return function(dateText) {
      const [ , month, day, year, hour, minute, amPm] = dateText
        .match(/^[A-Za-z]+, ([A-Za-z]+) (\d+), 20(\d+) at (\d+):(\d+) ([AP]M)/);

      return [
        `${(monthNames.indexOf(month) + 1 + '').padStart(2, 0)}-`,
        `${day.padStart(2, 0)}-${year}`,
        ' - ',
        `${to24HourTime(hour, minute, amPm)}`
      ].join('');
    };
  })();
  const allDates = Array
    .from(document.querySelectorAll('td[align="right"] > font'));

  for (currentDate of allDates) {
    const dateAnchor = toDateAnchor(currentDate.innerText);
    const bookmarkLink = document.createElement('a');
    bookmarkLink.classList.add('bookmark');
    bookmarkLink.setAttribute('href', `#${dateAnchor}`);
    bookmarkLink.innerText = 'Link';

    bookmarkLink.addEventListener('click', function(e) {
      bookmarkLink.scrollIntoView();
    });

    currentDate.innerText = `${currentDate.innerText} > `;
    currentDate.insertAdjacentElement('beforeend', bookmarkLink);

    if ((hasHash) && (currentURL.hash.endsWith(dateAnchor))) {
      currentDate.scrollIntoView();
      hasHash = false;
    }
  }
}
