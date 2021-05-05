const gu = require('./genUtility');

module.exports = function (type, msg) {
    const notifBannerElems = gu.createElems({
        div: {
            notifBanner: 'notif-banner',
            notifBannerMsg: 'notif-banner__msg',
        },
        img: { notifBannerImg: 'notif-banner__img' },
    });
    // const notifBanner = document.createElement('div');
    // const notifBannerImg = document.createElement('img');
    // const notifBannerMsg = document.createElement('div');
    // notifBannerImg.className = 'notif-banner__img';
    // notifBanner.className = 'notif-banner';
    // notifBannerMsg.className = 'notif-banner__msg';

    if (type === 'error') {
        notifBannerElems.notifBannerImg.src = '../../img/error-new.png';
        notifBannerElems.notifBanner.style.background = 'rgb(234,48,48)';
        notifBannerElems.notifBannerMsg.textContent = msg;

        notifBannerElems.notifBanner.appendChild(
            notifBannerElems.notifBannerImg
        );
        notifBannerElems.notifBanner.appendChild(
            notifBannerElems.notifBannerMsg
        );
        document.body.appendChild(notifBannerElems.notifBanner);

        document.body.style.overflowX = 'hidden';

        setTimeout(() => {
            notifBannerElems.notifBanner.className += ' fade-in';
        }, 100);

        setTimeout(() => {
            // notifBanner.className += ' fade-out';
            notifBannerElems.notifBanner.className = notifBannerElems.notifBanner.className.replace(
                `${notifBannerElems.notifBanner.className.slice(12, 20)}`,
                ''
            );
            setTimeout(() => {
                notifBannerElems.notifBanner.remove();
                document.body.style.overflowX = 'visible';
            }, 2000);
        }, 3000);
    }
};
