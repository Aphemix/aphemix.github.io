const currentURL = new URL(window.location.href);

if (currentURL.pathname == '/chats/') {
  const lastLink = Array
    .from(document.querySelectorAll('a.title'))
    .find(link => link.innerText == 'x');

  (lastLink) && (lastLink.innerText = 'Ride Off Into The Sunset / Directly Into The Future');
}
