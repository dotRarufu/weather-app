const cardLocalFuncs = `const countryTimezone = require('country-timezone');

function inputOrCoord(inputValue, choice, coordTz) {
  // returns which is used, country name or coordinates
  let res;
  if (choice === 'input') {
    res = countryTimezone.getTimezones(inputValue)[Number(0)]; // It is necessary to convert index to number so eslint will not throw destructuring error
  } else if (choice === 'map') {
    res = coordTz;
  }
  console.log(res);

  return res;
}
function getLastLetterNum(string) {
  let res;
  for (let i = -1; i > -Math.abs(string.length); i += -1) {
    // Starts in last character toward beginning of the string
    if (string.slice(i)[0].match(/[a-zA-Z0-9]/)) {
      if (i === -1) {
        // if string has no non-letter or num in the end
        break;
      } else {
        res = i + 1;
        break;
      }
    }
  }
  return res;
}

module.exports.inputOrCoord = inputOrCoord;
module.exports.getLastLetterNum = getLastLetterNum;
`;
const code = `const ace = require('brace');
const gu = require('./genUtility');
const codeList = require('./codeList');

require('brace/mode/javascript');
require('brace/theme/monokai');

function initCode() {
  const editor = ace.edit('code');
  editor.getSession().setMode('ace/mode/javascript');
  ace.config.set('basePath', 'node_modules/brace/theme');
  editor.setShowPrintMargin(false);
  editor.setTheme('ace/theme/ambiance');

  const preMadeElems = gu.selElems({
    codeSectionFiles: 'code-section__files',
  });

  class CodeSectionFile {
    constructor(name) {
      this.name = name;

      this.init();
    }

    init() {
      this.elem = gu.crElem('li');
      this.elem.id = \`\${this.name}File\`;
      this.elem.textContent = \`\${this.name}.js\`;

      preMadeElems.codeSectionFiles.appendChild(this.elem);
    }

    focusOrUnfocus() {
      if (this.isActive) {
        this.elem.className = 'code-section__files--selected';
      } else {
        this.elem.className = \`\${this.elem.className.replace(
          'code-section__files--selected',
          ''
        )}\`;
      }
    }
  }

  const codeSectionFileObjContainer = [
    new CodeSectionFile('cardLocalFuncs'),
    new CodeSectionFile('code'),
    new CodeSectionFile('genUtility'),
    new CodeSectionFile('main'),
    new CodeSectionFile('mapInstead'),
    new CodeSectionFile('notifBanner'),
    new CodeSectionFile('suggestionBox'),
    new CodeSectionFile('tipMessages'),
    new CodeSectionFile('unfocusCard'),
  ];

  for (let i = 0; i < codeSectionFileObjContainer.length; i += 1) {
    codeSectionFileObjContainer[i].elem.addEventListener('click', () => {
      codeSectionFileObjContainer[i].isActive = true;
      codeSectionFileObjContainer[i].focusOrUnfocus();

      for (let j = 0; j < codeSectionFileObjContainer.length; j += 1) {
        if (codeSectionFileObjContainer[j] !== codeSectionFileObjContainer[i]) {
          codeSectionFileObjContainer[j].isActive = false;
          codeSectionFileObjContainer[j].focusOrUnfocus();
        }
      }

      editor.session.setValue(
        \`\${codeList[\`\${codeSectionFileObjContainer[i].name}\`]}\`
      );
    });
  }

  // Default
  codeSectionFileObjContainer[3].isActive = true;
  codeSectionFileObjContainer[3].focusOrUnfocus();
  editor.session.setValue(
    \`\${codeList[\`\${codeSectionFileObjContainer[3].name}\`]}\`
  );
}

module.exports.initCode = initCode;
`;
const genUtility = `const geoTz = require('geo-tz');

function find(needle, haystack) {
  const results = [];
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    results.push(idx);
    idx = haystack.indexOf(needle, idx + 1);
  }
  return results;
}
function selClass(className) {
  return document.querySelector(\`.\${className}\`);
}
function selId(idName) {
  return document.querySelector(\`#\${idName}\`);
}
function crElem(element) {
  return document.createElement(\`\${element}\`);
}
function getTz(lat, lang) {
  return geoTz(lat, lang)[0];
}
function AllOccurIndex(string, char) {
  const indices = [];
  let idx = string.indexOf(char);
  while (idx !== -1) {
    indices.push(idx);
    idx = string.indexOf(char, idx + 1);
  }
  return indices;
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createElems(config) {
  const elems = config;
  const res = {};
  for (let i = 0; i < Object.keys(elems).length; i += 1) {
    for (
      let j = 0;
      j < Object.keys(elems[\`\${Object.keys(elems)[i]}\`]).length;
      j += 1
    ) {
      res[\`\${Object.keys(elems[\`\${Object.keys(elems)[i]}\`])[j]}\`] = crElem(
        \`\${Object.keys(elems)[i]}\`
      );
      res[
        \`\${Object.keys(elems[\`\${Object.keys(elems)[i]}\`])[j]}\`
      ].className = \`\${
        elems[\`\${Object.keys(elems)[i]}\`][
          \`\${Object.keys(elems[\`\${Object.keys(elems)[i]}\`])[j]}\`
        ]
      }\`;
    }
  }
  return res;
}
function appendElems(config, elems) {
  for (let i = 0; i < Object.keys(config).length; i += 1) {
    // const parent = [\`\${Object.keys(config)[i]}\`];
    const parent =
      elems[i][
        \`\${Object.keys(config)[i].slice(
          0,
          Object.keys(config)[i].indexOf('$')
        )}\`
      ];

    for (let j = 0; j < config[\`\${Object.keys(config)[i]}\`].length; j += 1) {
      const child = config[\`\${Object.keys(config)[i]}\`][j];

      parent.appendChild(child);
    }
  }
}
function selElems(config) {
  const elems = config;
  const res = {};
  for (let i = 0; i < Object.keys(elems).length; i += 1) {
    res[\`\${Object.keys(elems)[i]}\`] = selClass(
      \`\${elems[\`\${Object.keys(elems)[i]}\`]}\`
    );
  }
  return res;
}
function setAnim(action, timeout) {
  setTimeout(() => {
    action();
  }, timeout);
}
function start(time, action) {
  let timeRemaining = time;
  function count() {
    setTimeout(() => {
      timeRemaining -= 1;
      if (timeRemaining === 0) {
        action();
      } else {
        count();
      }
    }, 1000);
  }
  count();
}
module.exports.find = find;
module.exports.selClass = selClass;
module.exports.crElem = crElem;
module.exports.getTz = getTz;
module.exports.AllOccurIndex = AllOccurIndex;
module.exports.random = random;
module.exports.createElems = createElems;
module.exports.appendElems = appendElems;
module.exports.selElems = selElems;
module.exports.setAnim = setAnim;
module.exports.start = start;
module.exports.selId = selId;
`;
const main = `const countryTimezone = require('country-timezone');
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
          \`Uh oh, no result for "\${this.cardItemInput.value}"\`
        );
        this.useLastVal();
      }
      // Checks if input matches the location
      else {
        notifBanner(
          'error',
          \`Uh oh, no result for "\${this.cardItemInput.value}"\`
        );
        this.useLastVal();
      }
    }
    // If input is a coordinate
    else if (this.cardItemInput.value !== this.lastInputVal || mode === 'map') {
      if (this.cardItemInput.value.indexOf(\`,\`) !== -1) {
        // Formats input lat and lon value
        let lat = this.cardItemInput.value.slice(
          0,
          this.cardItemInput.value.indexOf(',')
        );
        let lon = this.cardItemInput.value.slice(
          this.cardItemInput.value.indexOf(\`,\`) + 1
        );

        if (
          Number.isNaN(Number(lat)) || // Although this looks like a tautology, it is not, it can be NaN when input has letter
          Number.isNaN(Number(lon))
        ) {
          notifBanner('error', \`C'mon, type a proper coordinate\`);
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
            this.cardItemInput.value = \`\${lat}, \${lon}\`;
            this.setLastVal();
          } else if (this.data.error) {
            notifBanner(
              'error',
              \`Uh oh, no result for "\${this.cardItemInput.value}"\`
            );
            this.useLastVal();
          }
          // Check if input lat and lon matches data lat and lon
          else {
            notifBanner(
              'error',
              \`Uh oh, no result for "\${this.cardItemInput.value}"\`
            );

            this.useLastVal();
          }
        }
      } else {
        notifBanner(
          'error',
          \`Hm, are you sure with "\${this.cardItemInput.value}"?\`
        );
      }
    }
  }

  async initWeathDescNIcon() {
    this.a = await fetch(
      \`https://api.weatherapi.com/v1/current.json?key=\${apiKey}&q=\${this.cardItemInput.value}\`
    );
    this.data = await this.a.json();
    this.cardItemIcon.src = \`https://\${this.data.current.condition.icon.slice(
      2
    )}\`;
    this.cardItemIconDesc.textContent = \`\${this.data.current.condition.text}\r\n\${this.data.current.temp_c}\u00B0C\`;
    this.lastDesc = this.cardItemIconDesc.textContent;
  }

  async weathApi(place) {
    // Returns weather data from input location
    this.cardItemIconDesc.textContent = 'Loading...';
    this.a = await fetch(
      \`https://api.weatherapi.com/v1/current.json?key=\${apiKey}&q=\${place}\`
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
    this.cardItemDayDate.textContent = \`\${this.raw.format(
      'dddd'
    )}\r\n\${this.raw.format('L')}\`;
    this.dateTime = this.raw.format('LLL');
    this.cardItemTime.textContent = \`\${this.dateTime.slice(
      gu.find(' ', this.dateTime)[2] + 1
    )}\`;
  }

  displayWeathApiRes(data) {
    // Sets weather icon and weather description
    this.cardItemIcon.src = \`https://\${data.current.condition.icon.slice(2)}\`;
    this.cardItemIconDesc.textContent = \`\${data.current.condition.text}\r\n\${data.current.temp_c}\u00B0C\`;
  }

  initTimeDayDate() {
    this.raw = moment.tz(
      moment(),
      countryTimezone.getTimezones(this.cardItemInput.value)[0]
    );
    this.dateTime = this.raw.format('LLL');
    this.cardItemTime.textContent = \`\${this.dateTime.slice(
      gu.find(' ', this.dateTime)[2] + 1
    )}\`;
    this.cardItemDayDate.textContent = \`\${this.raw.format(
      'dddd'
    )}\r\n\${this.raw.format('L')}\`;
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
      this.cardItemInput.value = \`\${this.cardItemInput.value.slice(
        0,
        cardLocalFuncs.getLastLetterNum(this.cardItemInput.value)
      )}\`;

      // This removes extra space between letters or comma and number
      if (this.cardItemInput.value.match(/\\s/)) {
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
              string = \`\${this.cardItemInput.value.slice(
                0,
                charBeforeSpace[i] + 1
              )} \${this.cardItemInput.value.slice(charAfterSpace[i])}\`;
            } else if (i === 0) {
              string = \`\${this.cardItemInput.value.slice(
                0,
                charBeforeSpace[i] + 1
              )}\`;
            } else if (i !== 0 && i !== charBeforeSpace.length - 1) {
              string += \` \${this.cardItemInput.value.slice(
                charAfterSpace[i - 1],
                charBeforeSpace[i] + 1
              )}\`;
            } else if (i === charBeforeSpace.length - 1) {
              string += \` \${this.cardItemInput.value.slice(
                charAfterSpace[i - 1],
                charBeforeSpace[i] + 1
              )} \${this.cardItemInput.value.slice(charAfterSpace[i])}\`;
            } else {
              console.log(\`error on \${i}\`);
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
      console.log(\`NO\`);
      this.cardItemInput.value = this.lastInputVal;
      return;
    }

    // This fixes capitalization of input
    if (
      this.cardItemInput.value !== '' &&
      this.cardItemInput.value.match(/\\s/g)
    ) {
      const indices = gu.AllOccurIndex(this.cardItemInput.value, ' ');
      let final = \`\${this.cardItemInput.value[0].toUpperCase()}\${this.cardItemInput.value
        .slice(1, indices[0])
        .toLowerCase()}\`;
      for (let i = 0; i < indices.length; i += 1) {
        if (i === indices.length - 1) {
          try {
            final += \` \${this.cardItemInput.value[
              indices[i] + 1
            ].toUpperCase()}\${this.cardItemInput.value
              .slice(indices[i] + 2)
              .toLowerCase()}\`;
          } catch (err) {
            notifBanner("C'mon, you can do better than that");
          }
        } else {
          final += \` \${this.cardItemInput.value[
            indices[i] + 1
          ].toUpperCase()}\${this.cardItemInput.value
            .slice(indices[i] + 2, [indices[i + 1]])
            .toLowerCase()}\`;
        }
      }
      this.cardItemInput.value = final;
    } else {
      this.cardItemInput.value = \`\${this.cardItemInput.value[0].toUpperCase()}\${this.cardItemInput.value
        .slice(1)
        .toLowerCase()}\`;
    }
  }

  createElems(config) {
    const elems = config;
    for (let i = 0; i < Object.keys(elems).length; i += 1) {
      const HtmlElems = Object.keys(elems)[i];
      for (let j = 0; j < Object.keys(elems[\`\${HtmlElems}\`]).length; j += 1) {
        this[\`\${Object.keys(elems[\`\${HtmlElems}\`])[j]}\`] = gu.crElem(
          \`\${HtmlElems}\`
        );
        this[\`\${Object.keys(elems[\`\${HtmlElems}\`])[j]}\`].className = \`\${
          elems[\`\${HtmlElems}\`][\`\${Object.keys(elems[\`\${HtmlElems}\`])[j]}\`]
        }\`;
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
            this.kebabClicked.className = \`\${this.kebabClicked.className.replace(
              'kebab-menu__clicked--added',
              ''
            )}\`;
            setTimeout(() => {
              this.kebabClicked.remove();
            }, 500);
          });
          kebabElems.mapInstead.addEventListener('click', () => {
            initMapInstead(cardObjContainer);
          });
          kebabElems.removeCard.addEventListener('click', () => {
            this.cardItem.className = \`\${this.cardItem.className.replace(
              'card-item--added',
              ''
            )}\`;
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
      this.cardItemDayDate.textContent = \`\${this.raw.format(
        'dddd'
      )}\r\n\${this.raw.format('L')}\`;
      this.dateTime = this.raw.format('LLL');
      this.cardItemTime.textContent = \`\${this.dateTime.slice(
        gu.find(' ', this.dateTime)[2] + 1
      )}\`;
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
`;
const mapInstead = `const L = require('leaflet');
const gu = require('./genUtility');

module.exports = function (elems) {
  const handler = {};
  for (let k = 0; k < elems.length; k += 1) {
    handler[\`\${k}\`] = elems[k];
  }

  const mapElems = gu.createElems({
    div: { userPlace: 'user-place', backElem: 'back-elem' },
  });

  const map = gu.crElem('div');
  mapElems.userPlace.textContent = 'Set this location';
  mapElems.backElem.textContent = '‹';
  map.id = 'map';

  let mapLat = 'false'; // default, for condition
  let mapLng = 'false'; // default, for condition
  let mapDidNotSelect = true;
  let activeHandler;

  for (let l = 0; l < elems.length; l += 1) {
    if (handler[l].isActive) {
      activeHandler = l;
    }
  }

  if (activeHandler !== undefined) {
    gu.appendElems(
      {
        body$1: [map, mapElems.userPlace, mapElems.backElem],
      },
      [document]
    );

    const myMap = L.map('map', {
      zoomControl: false,
    }).setView(
      [
        handler[activeHandler].lastLatFromMap,
        handler[activeHandler].lastLngFromMap,
      ],
      13
    );

    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1Ijoic2tyci10ZWNoIiwiYSI6ImNrbjVwbG55MTA1OWoydXF2a2FoZ2dnNzAifQ.6S7NXcvOygILiPJoo23ceQ',
      }
    ).addTo(myMap);

    const iconRetinaUrl = './img/marker-icon-2x.png';
    const iconUrl = './img/marker-icon.png';
    const shadowUrl = './img/marker-shadow.png';

    L.Marker.prototype.options.icon = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });

    const markerA = L.marker(
      [
        handler[activeHandler].lastLatFromMap,
        handler[activeHandler].lastLngFromMap,
      ],
      {
        draggable: true,
      }
    ).addTo(myMap);

    L.control
      .zoom({
        position: 'topright',
      })
      .addTo(myMap);

    myMap.on('click', (e) => {
      markerA.setLatLng(e.latlng);
      mapLat = Number(e.latlng.lat);
      mapLng = Number(e.latlng.lng);
      mapDidNotSelect = false;
    });
    mapElems.userPlace.addEventListener('click', async () => {
      map.remove();
      mapElems.userPlace.remove();
      mapElems.backElem.remove();

      if (mapDidNotSelect) {
        handler[activeHandler].latFromMap =
          handler[activeHandler].lastLatFromMap;
        handler[activeHandler].lngFromMap =
          handler[activeHandler].lastLngFromMap;
      } else {
        handler[activeHandler].latFromMap = mapLat;
        handler[activeHandler].lngFromMap = mapLng;
        handler[activeHandler].lastLatFromMap =
          handler[activeHandler].latFromMap;
        handler[activeHandler].lastLngFromMap =
          handler[activeHandler].lngFromMap;
      }
      handler[
        activeHandler
      ].cardItemInput.value = \`\${handler[activeHandler].latFromMap},\${handler[activeHandler].lngFromMap}\`;
      await handler[activeHandler].inputDataValidation('map');
      handler[activeHandler].kebabClicked.remove();
      handler[activeHandler].updateCardTip();
    });
    mapElems.backElem.addEventListener('click', () => {
      map.remove();
      mapElems.userPlace.remove();
      mapElems.backElem.remove();
    });
  }
};
`;
const notifBanner = `const gu = require('./genUtility');

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
        \`\${notifBannerElems.notifBanner.className.slice(12, 20)}\`,
        ''
      );
      gu.setAnim(() => {
        notifBannerElems.notifBanner.remove();
        document.body.style.overflowX = 'visible';
      }, 2000);
    }, 3000);
  }
};
`;
const suggestionBox = `const gu = require('./genUtility');

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
`;
const tipMessages = `const am12toAm4 = [
  'Go back to sleep!',
  "If you're going outside at this time, might as well go for a jog!",
  'Nocturnal!',
];
const am5toAm8 = ['Breakfast time!', 'Goodmorning!', 'Go for a jog!'];
const am9toAm11 = [
  'Prepare for lunch!',
  "Don't forget to drink lots of water!",
];
const pm12 = ['Lunch time!', "What's your lunch for today?"];
const pm1toPm3 = ["Don't you feel sleepy?", '*yawns*'];
const pm4toPm6 = [
  'Prepare for dinner!',
  "Don't forget to drink lots of water!",
];
const pm7toPm8 = [
  'Dinner time!',
  "Don't forget to eat your dinner!",
  "What's for dinner tonight?",
];
const pm9toPm11 = [
  'Time for late night snacks!',
  'Sleep early today!',
  'Bed time!',
];

module.exports.am12toAm4 = am12toAm4;
module.exports.am5toAm8 = am5toAm8;
module.exports.am9toAm11 = am9toAm11;
module.exports.pm12 = pm12;
module.exports.pm1toPm3 = pm1toPm3;
module.exports.pm4toPm6 = pm4toPm6;
module.exports.pm7toPm8 = pm7toPm8;
module.exports.pm9toPm11 = pm9toPm11;
`;
const unfocusCard = `const gu = require('./genUtility');

const removerElems = [
  'html',
  '.card-container',
  '.header',
  'body',
  '.code-section',
];

// Inputs array of card objects and then adds event listener
// that removes card white border (focused mode) when user
// clicks on other elements
module.exports = function (elems) {
  const handler = {};
  for (let k = 0; k < elems.length; k += 1) {
    handler[\`\${k}\`] = elems[k];
  }

  for (let i = 0; i < removerElems.length; i += 1) {
    if (removerElems[i] === '.code-section') {
      document.querySelector(\`.code-section\`).addEventListener('click', () => {
        for (let j = 0; j < elems.length; j += 1) {
          try {
            if (handler[j].isActive) {
              handler[j].cardItem.className = 'card-item card-item--added';
              handler[j].isActive = false;
              handler[j].cardItemInput.value = handler[j].lastInputVal;

              handler[j].kebabMenu.remove();
              // Lightens add btn
              gu.selClass('add-btn').className = 'add-btn';
            }
          } catch (err) {
            //
          }
        }
      });
    }
    document
      .querySelector(\`\${removerElems[i]}\`)
      .addEventListener('click', (e) => {
        if (document.querySelector(\`\${removerElems[i]}\`) !== e.target) {
          return;
        }
        for (let j = 0; j < elems.length; j += 1) {
          try {
            if (handler[j].isActive) {
              handler[j].cardItem.className = 'card-item card-item--added';
              handler[j].isActive = false;
              handler[j].cardItemInput.value = handler[j].lastInputVal;
              handler[j].kebabMenu.remove();
              // Lightens add btn
              gu.selClass('add-btn').className = 'add-btn';
              gu.start(5, () => {
                gu.selClass('add-btn').className += ' opacity-01';
              });
            }
          } catch (err) {
            // console.log(err);
          }
        }
      });
  }

  for (let j = 0; j < elems.length; j += 1) {
    handler[j].cardItem.addEventListener('click', () => {
      for (let k = 0; k < elems.length; k += 1) {
        try {
          if (!handler[k].isActive) {
            try {
              handler[k].kebabMenu.remove();
              handler[k].kebabClicked.remove();
              // Lightens add btn
              gu.selClass('add-btn').className = 'add-btn';
            } catch (err) {
              // console.log('first time removing');
            }
          }
        } catch (err) {
          //
        }
      }
    });
  }
};
`;

module.exports.cardLocalFuncs = cardLocalFuncs;
module.exports.code = code;
module.exports.genUtility = genUtility;
module.exports.main = main;
module.exports.mapInstead = mapInstead;
module.exports.notifBanner = notifBanner;
module.exports.suggestionBox = suggestionBox;
module.exports.tipMessages = tipMessages;
module.exports.unfocusCard = unfocusCard;
