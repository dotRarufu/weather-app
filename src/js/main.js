const countryTimezone = require('country-timezone');
const moment = require('moment');
const code = require('./code');

require('moment-timezone');
require('../css/style.scss');
require('../../node_modules/leaflet/dist/leaflet.css');

const gu = require('./genUtility');
const notifBanner = require('./notifBanner');
const initMapInstead = require('./mapInstead');

const suggestionBox = require('./suggestionBox');
const unfocCard = require('./unfocusCard.js');

const cardLocalFuncs = require('./cardLocalFuncs');
const tipMessages = require('./tipMessages');

const apiKey = 'f80c5ae3ac3a4eb1bf965456210404';

let cardObjContainer = [];

const preMadeElems = gu.selElems({
  cardContainer: 'card-container',
  addBtn: 'add-btn',
});

class Card {
  constructor(name) {
    this.cardName = name;

    this.initCard();
  }

  async inputDataValidation(mode) {
    this.beautifyInput(mode);

    // If input has no number (If input is not a coordinate)
    if (
      (this.cardItemInput.value !== this.lastInputVal || mode === 'map') &&
      !this.cardItemInput.value.match(/[0-9]/g)
    ) {
      this.data = await this.weathApi(this.cardItemInput.value);

      if (this.cardItemInput.value === this.data.location.name) {
        console.log(this.data);
        this.lastInputVal = this.cardItemInput.value;
        this.initTimeDayDate();
        this.displayWeathApiRes(this.data);
        this.locMethodUsed = 'input';
        this.newTime();
      } else if (this.data.error) {
        notifBanner(
          'error',
          `Uh oh, no result for "${this.cardItemInput.value}"`
        );
        this.useLastVal();
      }
      // Checks if input matches the location
      else {
        notifBanner(
          'error',
          `Uh oh, no result for "${this.cardItemInput.value}"`
        );
        this.useLastVal();
      }
    }
    // If input is a coordinate
    else if (this.cardItemInput.value !== this.lastInputVal || mode === 'map') {
      if (this.cardItemInput.value.indexOf(`,`) !== -1) {
        // Formats input lat and lon value
        let lat = this.cardItemInput.value.slice(
          0,
          this.cardItemInput.value.indexOf(',')
        );
        let lon = this.cardItemInput.value.slice(
          this.cardItemInput.value.indexOf(`,`) + 1
        );

        if (
          Number.isNaN(Number(lat)) || // Although this looks like a tautology, it is not, it can be NaN when input has letter
          Number.isNaN(Number(lon))
        ) {
          notifBanner('error', `C'mon, type a proper coordinate`);
        } else {
          lon = Number(Number(lon).toFixed(2));
          lat = Number(Number(lat).toFixed(2));
          this.data = await this.weathApi(this.cardItemInput.value);

          // If API respond is not error
          if (
            lat === this.data.location.lat &&
            lon === this.data.location.lon
          ) {
            this.displayWeathApiRes(this.data);
            this.initTimeDayDate();

            if (mode === 'map') {
              this.locMethodUsed = 'map';
            } else {
              this.locMethodUsed = 'input';
            }
            this.updateCardTip();
            this.newTime();
            this.cardItemInput.value = `${lat}, ${lon}`;
            this.setLastVal();
          } else if (this.data.error) {
            notifBanner(
              'error',
              `Uh oh, no result for "${this.cardItemInput.value}"`
            );
            this.useLastVal();
          }
          // Check if input lat and lon matches data lat and lon
          else {
            notifBanner(
              'error',
              `Uh oh, no result for "${this.cardItemInput.value}"`
            );

            this.useLastVal();
          }
        }
      } else {
        notifBanner(
          'error',
          `Hm, are you sure with "${this.cardItemInput.value}"?`
        );
      }
    }
  }

  async initWeathDescNIcon() {
    this.a = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${this.cardItemInput.value}`
    );
    this.data = await this.a.json();
    this.cardItemIcon.src = `https://${this.data.current.condition.icon.slice(
      2
    )}`;
    this.cardItemIconDesc.textContent = `${this.data.current.condition.text}\r\n${this.data.current.temp_c}\u00B0C`;
    this.lastDesc = this.cardItemIconDesc.textContent;
  }

  async weathApi(place) {
    // Returns weather data from input location
    this.cardItemIconDesc.textContent = 'Loading...';
    this.a = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${place}`
    );
    this.data = await this.a.json();
    return this.data;
  }

  async newTime() {
    // Sets time initial time
    this.raw = moment.tz(
      moment(),
      cardLocalFuncs.inputOrCoord(
        this.cardItemInput.value,
        this.locMethodUsed,
        this.data.location.tz_id
      )
    );
    this.cardItemDayDate.textContent = `${this.raw.format(
      'dddd'
    )}\r\n${this.raw.format('L')}`;
    this.dateTime = this.raw.format('LLL');
    this.cardItemTime.textContent = `${this.dateTime.slice(
      gu.find(' ', this.dateTime)[2] + 1
    )}`;
  }

  displayWeathApiRes(data) {
    // Sets weather icon and weather description
    this.cardItemIcon.src = `https://${data.current.condition.icon.slice(2)}`;
    this.cardItemIconDesc.textContent = `${data.current.condition.text}\r\n${data.current.temp_c}\u00B0C`;
  }

  initTimeDayDate() {
    this.raw = moment.tz(
      moment(),
      countryTimezone.getTimezones(this.cardItemInput.value)[0]
    );
    this.dateTime = this.raw.format('LLL');
    this.cardItemTime.textContent = `${this.dateTime.slice(
      gu.find(' ', this.dateTime)[2] + 1
    )}`;
    this.cardItemDayDate.textContent = `${this.raw.format(
      'dddd'
    )}\r\n${this.raw.format('L')}`;
  }

  updateCardTip() {
    const am = this.cardItemTime.textContent.slice(-2) === 'AM';
    const pm = this.cardItemTime.textContent.slice(-2) === 'PM';
    const hr = Number(this.cardItemTime.textContent[0]);
    if (am && hr >= 12 && hr <= 4) {
      this.cardItemTip.textContent =
        tipMessages.am12toAm4[gu.random(0, tipMessages.am12toAm4.length - 1)];
    } else if (am && hr >= 5 && hr <= 8) {
      this.cardItemTip.textContent =
        tipMessages.am5toAm8[gu.random(0, tipMessages.am5toAm8.length - 1)];
    } else if (am && hr >= 9 && hr <= 11) {
      this.cardItemTip.textContent =
        tipMessages.am9toAm11[gu.random(0, tipMessages.am9toAm11.length - 1)];
    } else if (pm && hr === 12) {
      this.cardItemTip.textContent =
        tipMessages.pm12[gu.random(0, tipMessages.pm12.length - 1)];
    } else if (pm && hr >= 1 && hr <= 3) {
      this.cardItemTip.textContent =
        tipMessages.pm1toPm3[gu.random(0, tipMessages.pm1toPm3.length - 1)];
    } else if (pm && hr >= 4 && hr <= 6) {
      this.cardItemTip.textContent =
        tipMessages.pm4toPm6[gu.random(0, tipMessages.pm4toPm6.length - 1)];
    } else if (pm && hr >= 7 && hr <= 8) {
      this.cardItemTip.textContent =
        tipMessages.pm7toPm8[gu.random(0, tipMessages.pm7toPm8.length - 1)];
    } else if (pm && hr >= 9 && hr <= 11) {
      this.cardItemTip.textContent =
        tipMessages.pm9toPm11[gu.random(0, tipMessages.pm9toPm11.length - 1)];
    }
  }

  beautifyInput(mode) {
    // Removes excess characters in input
    if (mode !== 'map') {
      // !== 'map' means user enters a location name or coordinates

      // This remove characters before the first letter or number
      this.cardItemInput.value = this.cardItemInput.value.slice(
        this.cardItemInput.value.indexOf(
          this.cardItemInput.value.match(/[a-zA-Z0-9]/)
        )
      );

      // This remove characters after the last letter or number
      this.cardItemInput.value = `${this.cardItemInput.value.slice(
        0,
        cardLocalFuncs.getLastLetterNum(this.cardItemInput.value)
      )}`;

      // This removes extra space between letters or comma and number
      if (this.cardItemInput.value.match(/\s/)) {
        const charBeforeSpace = [];
        const charAfterSpace = [];
        let string;

        // Stores index of character around space
        for (let i = 0; i < this.cardItemInput.value.length; i += 1) {
          if (
            i !== 0 &&
            this.cardItemInput.value[i].match(/[a-zA-Z,0-9]/) &&
            this.cardItemInput.value[i - 1] === ' '
          ) {
            charAfterSpace.push(i);
          }
          if (
            i !== this.cardItemInput.value.length - 1 &&
            this.cardItemInput.value[i + 1] === ' ' &&
            this.cardItemInput.value[i].match(/[a-zA-Z,0-9]/)
          ) {
            charBeforeSpace.push(i);
          }
        }

        // Removes excess space
        for (let i = 0; i < charBeforeSpace.length; i += 1) {
          if (i !== charBeforeSpace.length) {
            if (i === 0 && i === charBeforeSpace.length - 1) {
              string = `${this.cardItemInput.value.slice(
                0,
                charBeforeSpace[i] + 1
              )} ${this.cardItemInput.value.slice(charAfterSpace[i])}`;
            } else if (i === 0) {
              string = `${this.cardItemInput.value.slice(
                0,
                charBeforeSpace[i] + 1
              )}`;
            } else if (i !== 0 && i !== charBeforeSpace.length - 1) {
              string += ` ${this.cardItemInput.value.slice(
                charAfterSpace[i - 1],
                charBeforeSpace[i] + 1
              )}`;
            } else if (i === charBeforeSpace.length - 1) {
              string += ` ${this.cardItemInput.value.slice(
                charAfterSpace[i - 1],
                charBeforeSpace[i] + 1
              )} ${this.cardItemInput.value.slice(charAfterSpace[i])}`;
            } else {
              console.log(`error on ${i}`);
            }
          }
        }

        // Fixes space around comma
        if (this.cardItemInput.value.match(/[,]/)) {
          string = string.replace(' ,', ',');
        }

        this.cardItemInput.value = string;
      }
    }

    // Voids obvious illegal inputs
    if (!this.cardItemInput.value.match(/[a-zA-Z0-9]/)) {
      console.log(`NO`);
      this.cardItemInput.value = this.lastInputVal;
      return;
    }

    // This fixes capitalization of input
    if (
      this.cardItemInput.value !== '' &&
      this.cardItemInput.value.match(/\s/g)
    ) {
      const indices = gu.AllOccurIndex(this.cardItemInput.value, ' ');
      let final = `${this.cardItemInput.value[0].toUpperCase()}${this.cardItemInput.value
        .slice(1, indices[0])
        .toLowerCase()}`;
      for (let i = 0; i < indices.length; i += 1) {
        if (i === indices.length - 1) {
          try {
            final += ` ${this.cardItemInput.value[
              indices[i] + 1
            ].toUpperCase()}${this.cardItemInput.value
              .slice(indices[i] + 2)
              .toLowerCase()}`;
          } catch (err) {
            notifBanner("C'mon, you can do better than that");
          }
        } else {
          final += ` ${this.cardItemInput.value[
            indices[i] + 1
          ].toUpperCase()}${this.cardItemInput.value
            .slice(indices[i] + 2, [indices[i + 1]])
            .toLowerCase()}`;
        }
      }
      this.cardItemInput.value = final;
    } else {
      this.cardItemInput.value = `${this.cardItemInput.value[0].toUpperCase()}${this.cardItemInput.value
        .slice(1)
        .toLowerCase()}`;
    }
  }

  createElems(config) {
    const elems = config;
    for (let i = 0; i < Object.keys(elems).length; i += 1) {
      const HtmlElems = Object.keys(elems)[i];
      for (let j = 0; j < Object.keys(elems[`${HtmlElems}`]).length; j += 1) {
        this[`${Object.keys(elems[`${HtmlElems}`])[j]}`] = gu.crElem(
          `${HtmlElems}`
        );
        this[`${Object.keys(elems[`${HtmlElems}`])[j]}`].className = `${
          elems[`${HtmlElems}`][`${Object.keys(elems[`${HtmlElems}`])[j]}`]
        }`;
      }
    }
  }

  initEvents() {
    // When user changes input
    this.cardItemInput.addEventListener('change', async () => {
      await this.inputDataValidation();
      this.updateCardTip();
    });
    // When user selected the card
    this.cardItem.addEventListener('click', async () => {
      if (!this.isActive) {
        // For conditions
        this.isActive = true;

        // For animation
        this.cardItem.className += ' selectCard';
        gu.selClass('add-btn').className = 'add-btn opacity-01';

        // Displays the kebab menu
        this.createElems({
          div: { kebabMenu: 'kebab-menu' },
          figure: { kebabFigure: 'kebab-menu__figure' },
        });
        this.kebabFigureCln1 = this.kebabFigure.cloneNode(true);
        this.kebabFigureCln2 = this.kebabFigure.cloneNode(true);
        gu.appendElems(
          {
            kebabMenu$1: [
              this.kebabFigure,
              this.kebabFigureCln1,
              this.kebabFigureCln2,
            ],
            cardItem$1: [this.kebabMenu],
          },
          [this, this]
        );

        // Kebab menu interface
        this.kebabMenu.addEventListener('click', () => {
          // for outside use elems
          this.createElems({
            div: { kebabClicked: 'kebab-menu__clicked' },
          });

          // local elements
          const kebabElems = gu.createElems({
            div: {
              removeCard: 'kebab-menu__option',
              mapInstead: 'kebab-menu__option',
              backBtn: 'kebab-menu__back-btn',
              options: 'kebab-menu__option-list',
              settings: 'kebab-menu__settings',
            },
          });
          gu.appendElems(
            {
              kebabClicked$1: [kebabElems.backBtn, kebabElems.settings],
              options$1: [kebabElems.removeCard, kebabElems.mapInstead],
              kebabClicked$2: [kebabElems.options],
              cardItem$1: [this.kebabClicked],
            },
            [this, kebabElems, this, this]
          );

          kebabElems.removeCard.textContent = 'Remove this card';
          kebabElems.mapInstead.textContent = 'Use map to find a location';
          kebabElems.settings.textContent = 'Settings';
          kebabElems.backBtn.textContent = '‹';
          // for animation
          setTimeout(() => {
            this.kebabClicked.className += ' kebab-menu__clicked--added';
          }, 10);

          kebabElems.backBtn.addEventListener('click', () => {
            this.kebabClicked.className = `${this.kebabClicked.className.replace(
              'kebab-menu__clicked--added',
              ''
            )}`;
            setTimeout(() => {
              this.kebabClicked.remove();
            }, 500);
          });
          kebabElems.mapInstead.addEventListener('click', () => {
            initMapInstead(cardObjContainer);
          });
          kebabElems.removeCard.addEventListener('click', () => {
            this.cardItem.className = `${this.cardItem.className.replace(
              'card-item--added',
              ''
            )}`;
            setTimeout(() => {
              this.cardItem.remove();
            }, 1000);
          });
        });
        // Updates card tip
        this.updateCardTip();

        for (let i = 0; i < cardObjContainer.length; i += 1) {
          if (cardObjContainer[i].isActive && cardObjContainer[i] !== this) {
            cardObjContainer[i].cardItem.className =
              'card-item card-item--added';
            cardObjContainer[i].isActive = false;
          }
        }
      } else {
        // blabla
      }
    });
    // When user focus on input
    this.cardItemInput.addEventListener('focus', () => {
      suggestionBox(cardObjContainer);
    });
    // When user unfocus on input
    this.cardItemInput.addEventListener('focusout', () => {
      if (document.querySelector('.sugg')) {
        document.querySelector('.sugg').className = 'sugg';
        setTimeout(() => {
          this.mapInstead = false;
          document.body.removeChild(document.querySelector('.sugg'));
        }, 400);
      }
    });
  }

  useLastVal() {
    this.cardItemIconDesc.textContent = this.lastDesc;
    this.cardItemInput.value = this.lastInputVal;
  }

  setLastVal() {
    this.lastDesc = this.cardItemIconDesc.textContent;
    this.lastInputVal = this.cardItemInput.value;
  }

  initCard() {
    // Initial elements
    this.createElems({
      div: {
        cardItem: 'card-item',
        cardItemTime: 'card-item__time',
        cardItemIconDesc: 'card-item__icon-desc',
        cardItemDayDate: 'card-item__day-date',
        cardItemTip: 'card-item__tip',
      },
      input: { cardItemInput: 'card-item__input' },
      img: { cardItemIcon: 'card-item__icon' },
    });
    gu.appendElems(
      {
        cardItem$1: [
          this.cardItemTime,
          this.cardItemInput,
          this.cardItemIcon,
          this.cardItemIconDesc,
          this.cardItemDayDate,
          this.cardItemTip,
        ],
        cardContainer$1: [this.cardItem],
      },
      [this, preMadeElems]
    );

    // Initial values
    this.initVal();

    // Initial display
    this.cardItemIconDesc.textContent = 'Loading...';
    this.initWeathDescNIcon(); // Initiates weather description and icon
    this.initTimeDayDate(); // Initiates time, day, and date
    this.moveTime(); // Initiates moving clock

    // Initial events
    this.initEvents();

    // Initial animation for cards
    gu.setAnim(() => {
      this.cardItem.className += ' card-item--added';
    }, 100);
  }

  moveTime() {
    setTimeout(() => {
      this.raw = moment.tz(
        moment(),
        cardLocalFuncs.inputOrCoord(
          this.cardItemInput.value,
          this.locMethodUsed,
          this.data.location.tz_id
        )
      );
      this.cardItemDayDate.textContent = `${this.raw.format(
        'dddd'
      )}\r\n${this.raw.format('L')}`;
      this.dateTime = this.raw.format('LLL');
      this.cardItemTime.textContent = `${this.dateTime.slice(
        gu.find(' ', this.dateTime)[2] + 1
      )}`;
      this.moveTime();
    }, 60000);
    // Updates card tip
    this.updateCardTip();
  }

  initVal() {
    this.isActive = false;
    this.locMethodUsed = 'input'; // default
    this.lastLatFromMap = 35.69;
    this.lastLngFromMap = 139.69;
    this.cardItemInput.value = 'Manila';
    this.lastInputVal = this.cardItemInput.value;
  }
}
cardObjContainer = [new Card(0), new Card(1)];

// Removes border on focused card, when user click outside the card
unfocCard(cardObjContainer);

// Add card button
preMadeElems.addBtn.addEventListener('click', () => {
  cardObjContainer.push(new Card());
  // For the new set of cards
  unfocCard(cardObjContainer);
});

code.initCode();
