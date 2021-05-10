const gu = require('./genUtility');

module.exports = function (type, msg) {
  const notifBannerElems = gu.createElems({
    div: {
      notifBanner: 'notif-banner',
      notifBannerMsg: 'notif-banner__msg',
    },
    img: { notifBannerImg: 'notif-banner__img' },
  });

  if (type === 'error') {
    notifBannerElems.notifBannerImg.src = '../../img/error-new.png';
    notifBannerElems.notifBanner.style.background = 'rgb(234,48,48)';
    notifBannerElems.notifBannerMsg.textContent = msg;

    notifBannerElems.notifBanner.appendChild(notifBannerElems.notifBannerImg);
    notifBannerElems.notifBanner.appendChild(notifBannerElems.notifBannerMsg);
    gu.appendElems(
      {
        body$1: [notifBannerElems.notifBanner],
      },
      [document]
    );

    document.body.style.overflowX = 'hidden';

    gu.setAnim(() => {
      notifBannerElems.notifBanner.className += ' fade-in';
    }, 100);

    gu.setAnim(() => {
      notifBannerElems.notifBanner.className = notifBannerElems.notifBanner.className.replace(
        `${notifBannerElems.notifBanner.className.slice(12, 20)}`,
        ''
      );
      gu.setAnim(() => {
        notifBannerElems.notifBanner.remove();
        document.body.style.overflowX = 'visible';
      }, 2000);
    }, 3000);
  }
};
