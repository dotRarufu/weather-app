const gu = require('./genUtility');

module.exports = function () {
  if (!document.querySelector('.sugg')) {
    const suggElems = gu.createElems({
      div: { sugg: 'sugg' },
    });
    suggElems.sugg.textContent = 'This is some suggestion box';
    suggElems.sugg.addEventListener('click', () => {
      // some code here
    });

    gu.setAnim(() => {
      suggElems.sugg.className += ' fade-in';
    }, 100);

    gu.appendElems(
      {
        body$1: [suggElems.sugg],
      },
      [document]
    );
  }
};
