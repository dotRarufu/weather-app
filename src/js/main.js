const countryTimezone = require('country-timezone'); // converts country name to timezone
const moment = require('moment');

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

class Card {
    constructor(name) {
        const cardContainer = gu.selClass('card-container');
        this.cardName = name;

        // For creating elems
        this.createElems = function (config) {
            const elems = config;
            for (let i = 0; i < Object.keys(elems).length; i += 1) {
                const HtmlElems = Object.keys(elems)[i];
                for (
                    let j = 0;
                    j < Object.keys(elems[`${HtmlElems}`]).length;
                    j += 1
                ) {
                    this[
                        `${Object.keys(elems[`${HtmlElems}`])[j]}`
                    ] = gu.crElem(`${HtmlElems}`);
                    this[
                        `${Object.keys(elems[`${HtmlElems}`])[j]}`
                    ].className = `${
                        elems[`${HtmlElems}`][
                            `${Object.keys(elems[`${HtmlElems}`])[j]}`
                        ]
                    }`;
                }
            }
        };

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

        this.lastLatFromMap = 35.69;
        this.lastLngFromMap = 139.69;
        this.cardItemInput.value = 'Manila';
        this.isActive = false;
        this.lastInputVal = this.cardItemInput.value;
        this.locMethodUsed = 'input'; // default

        // Functions that is used outside
        this.weathApi = async function (place) {
            // Returns weather data from input location
            this.cardItemIconDesc.textContent = 'Loading...';
            this.a = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${place}`
            );
            this.data = await this.a.json();
            return this.data;
        };
        this.newTime = async function () {
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
        };
        this.displayWeathApiRes = function (data) {
            // Sets weather icon and weather description
            this.cardItemIcon.src = `https://${data.current.condition.icon.slice(
                2
            )}`;
            this.cardItemIconDesc.textContent = `${data.current.condition.text}\r\n${data.current.temp_c}\u00B0C`;
        };
        this.inputDataValidation = async function (mode) {
            // console.log(`Start: "${this.cardItemInput.value}"`);
            // This remove characters before the first letter or number
            if (mode !== 'map') {
                // !== 'map' means user enters a location name or coordinates
                this.cardItemInput.value = this.cardItemInput.value.slice(
                    this.cardItemInput.value.indexOf(
                        this.cardItemInput.value.match(/[a-zA-Z0-9]/)
                    )
                );
            }
            // console.log(`After stage 1: "${this.cardItemInput.value}"`);
            // This remove characters after the last letter or number
            if (mode !== 'map') {
                // !== 'map' means user enters a location name or coordinates
                this.cardItemInput.value = `${this.cardItemInput.value.slice(
                    0,
                    cardLocalFuncs.getLastLetterNum(this.cardItemInput.value)
                )}`;
            }
            // console.log(`After stage 2: "${this.cardItemInput.value}"`);
            // This removes extra space between letters or comma and number
            if (mode !== 'map' && this.cardItemInput.value.match(/\s/)) {
                const charBeforeSpace = [];
                const charAfterSpace = [];
                let string;
                for (let i = 0; i < this.cardItemInput.value.length; i += 1) {
                    if (i !== 0) {
                        if (
                            this.cardItemInput.value[i].match(/[a-zA-Z,0-9]/) &&
                            this.cardItemInput.value[i - 1] === ' '
                        ) {
                            charAfterSpace.push(i);
                        }
                    }
                    if (i !== this.cardItemInput.value.length - 1) {
                        if (
                            this.cardItemInput.value[i + 1] === ' ' &&
                            this.cardItemInput.value[i].match(/[a-zA-Z,0-9]/)
                        ) {
                            charBeforeSpace.push(i);
                        }
                    }
                }
                if (!charBeforeSpace) {
                    // If there are characters before space
                    for (let i = 0; i < charBeforeSpace.length; i += 1) {
                        if (i !== charBeforeSpace.length) {
                            if (i === 0 && i === charBeforeSpace.length - 1) {
                                string = `${this.cardItemInput.value.slice(
                                    0,
                                    charBeforeSpace[i] + 1
                                )} ${this.cardItemInput.value.slice(
                                    charAfterSpace[i]
                                )}`;
                            } else if (i === 0) {
                                string = `${this.cardItemInput.value.slice(
                                    0,
                                    charBeforeSpace[i] + 1
                                )}`;
                            } else if (
                                i !== 0 &&
                                i !== charBeforeSpace.length - 1
                            ) {
                                string += ` ${this.cardItemInput.value.slice(
                                    charAfterSpace[i - 1],
                                    charBeforeSpace[i] + 1
                                )}`;
                            } else if (i === charBeforeSpace.length - 1) {
                                string += ` ${this.cardItemInput.value.slice(
                                    charAfterSpace[i - 1],
                                    charBeforeSpace[i] + 1
                                )} ${this.cardItemInput.value.slice(
                                    charAfterSpace[i]
                                )}`;
                            } else {
                                console.log(`error on ${i}`);
                            }
                        }
                    }
                } else {
                    // console.log('Input has only spaces');
                    string = this.cardItemInput.value;
                }
                // Fixes space around comma
                if (this.cardItemInput.value.match(/[,]/)) {
                    string = string.replace(' ,', ',');
                }

                this.cardItemInput.value = string;
            }
            // console.log(`After stage 3: "${this.cardItemInput.value}"`);
            // This fixes capitalization of input
            if (
                (this.cardItemInput.value.slice(-1)[0] !== ' ' ||
                    this.cardItemInput.value[0] !== ' ') &&
                this.cardItemInput.value !== ''
            ) {
                if (this.cardItemInput.value.match(/\s/g)) {
                    const indices = await gu.AllOccurIndex(
                        this.cardItemInput.value,
                        ' '
                    );
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
                                notifBanner(
                                    "C'mon, you can do better than that"
                                );
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
                    this.cardItemInput.value = `${this.cardItemInput.value[0].toUpperCase()}${this.cardItemInput.value.slice(
                        1
                    )}`;
                }
            }
            // console.log(`After stage 4: "${this.cardItemInput.value}"`);

            if (
                (this.cardItemInput.value !== this.lastInputVal &&
                    this.cardItemInput.value[0] !== ' ' &&
                    this.cardItemInput.value[0] !== ' ') ||
                mode === 'map'
            ) {
                console.log(this.cardItemInput.value);
                // if input has no number
                if (!this.cardItemInput.value.match(/[0-9]/g)) {
                    console.log(this.cardItemInput.value);
                    this.data = await this.weathApi(this.cardItemInput.value);
                    console.log(this.cardItemInput.value);
                    if (this.data.error) {
                        notifBanner(
                            'error',
                            `Uh oh, no result for "${this.cardItemInput.value}"`
                        );
                        this.cardItemIconDesc.textContent = this.lastDesc;
                        this.cardItemInput.value = this.lastInputVal;
                    } else if (
                        this.cardItemInput.value === this.data.location.name // || input value is = to data.lat and lon
                    ) {
                        // Check if input matches the location
                        this.lastInputVal = this.cardItemInput.value;
                        this.displayWeathApiRes(this.data);
                        this.raw = moment.tz(
                            moment(),
                            countryTimezone.getTimezones(
                                this.cardItemInput.value
                            )[0]
                        );
                        this.dateTime = this.raw.format('LLL');
                        this.cardItemTime.textContent = `${this.dateTime.slice(
                            gu.find(' ', this.dateTime)[2] + 1
                        )}`;
                        this.cardItemDayDate.textContent = `${this.raw.format(
                            'dddd'
                        )}\r\n${this.raw.format('L')}`;
                        this.locMethodUsed = 'input';
                        this.newTime();
                        console.log(this.data);
                    } else {
                        notifBanner(
                            'error',
                            `Uh oh, no result for "${this.cardItemInput.value}"`
                        );
                        this.cardItemIconDesc.textContent = this.lastDesc;
                        this.cardItemInput.value = this.lastInputVal;
                    }
                }
                // if input has number
                else {
                    // checks if input is valid - for coordinate input
                    // formats input value in lat and lon
                    if (this.cardItemInput.value.indexOf(`,`) !== -1) {
                        this.cardItemInputLat = this.cardItemInput.value.slice(
                            0,
                            this.cardItemInput.value.indexOf(',')
                        );
                        this.cardItemInputLon = this.cardItemInput.value.slice(
                            this.cardItemInput.value.indexOf(`,`) + 1
                        );
                        if (
                            Number.isNaN(Number(this.cardItemInputLat)) || // although this looks like a tautology, its not, it can be NaN when input has string
                            Number.isNaN(Number(this.cardItemInputLon))
                        ) {
                            notifBanner(
                                'error',
                                `C'mon, type a proper coordinate`
                            );
                        } else {
                            // sets lat lon decimal point to 2 if decimal point is present
                            this.cardItemInputLon = Number(
                                Number(this.cardItemInputLon).toFixed(2)
                            );
                            this.cardItemInputLat = Number(
                                Number(this.cardItemInputLat).toFixed(2)
                            );
                            this.data = await this.weathApi(
                                this.cardItemInput.value
                            );
                            if (this.data.error) {
                                notifBanner(
                                    'error',
                                    `Uh oh, no result for "${this.cardItemInput.value}"`
                                );
                                this.cardItemIconDesc.textContent = this.lastDesc;
                                this.cardItemInput.value = this.lastInputVal;
                            } else if (
                                this.cardItemInputLat ===
                                    this.data.location.lat &&
                                this.cardItemInputLon === this.data.location.lon // || input value is = to data.lat and lon
                            ) {
                                // Check if input lat and lon matches data lat and lon
                                this.displayWeathApiRes(this.data);
                                this.raw = moment.tz(
                                    moment(),
                                    countryTimezone.getTimezones(
                                        this.cardItemInput.value
                                    )[0]
                                );
                                this.dateTime = this.raw.format('LLL');
                                this.cardItemTime.textContent = `${this.dateTime.slice(
                                    gu.find(' ', this.dateTime)[2] + 1
                                )}`;
                                this.cardItemDayDate.textContent = `${this.raw.format(
                                    'dddd'
                                )}\r\n${this.raw.format('L')}`;
                                if (mode === 'map') {
                                    this.locMethodUsed = 'map';
                                } else {
                                    this.locMethodUsed = 'input';
                                }

                                this.newTime();
                                this.cardItemInput.value = `${this.cardItemInputLat}, ${this.cardItemInputLon}`;
                                this.lastDesc = this.cardItemIconDesc.textContent;
                                this.lastInputVal = this.cardItemInput.value;

                                this.lastInputVal = this.cardItemInput.value; // add input beautification on this
                            } else {
                                console.log(this.cardItemInputLat);
                                console.log(this.data.location.lat);
                                notifBanner(
                                    'error',
                                    `Uh oh, no result for "${this.cardItemInput.value}"`
                                );

                                this.cardItemIconDesc.textContent = this.lastDesc;
                                this.cardItemInput.value = this.lastInputVal; // add input beautification on this
                            }
                        }
                    } else {
                        notifBanner(
                            'error',
                            `Hm, are you sure with "${this.cardItemInput.value}"?`
                        );
                    }
                    console.log(
                        `Lat: ${typeof this.cardItemInputLat} ${
                            this.cardItemInputLat
                        } \n Lon: ${typeof this.cardItemInputLon} ${
                            this.cardItemInputLon
                        }`
                    );
                }
            }
        };
        this.updateCardTip = function () {
            if (
                this.cardItemTime.textContent.slice(-2) === 'AM' &&
                Number(this.cardItemTime.textContent[0]) <= 8
            ) {
                this.cardItemTip.textContent =
                    tipMessages.morning[
                        gu.random(0, tipMessages.morning.length - 1)
                    ];
                console.log(0);
            } else if (
                this.cardItemTime.textContent.slice(-2) === 'AM' &&
                Number(this.cardItemTime.textContent[0]) >= 9 &&
                Number(this.cardItemTime.textContent[0]) <= 11
            ) {
                this.cardItemTip.textContent =
                    tipMessages.noon[gu.random(0, tipMessages.noon.length - 1)];
            } else if (
                (this.cardItemTime.textContent.slice(-2) === 'PM' &&
                    Number(this.cardItemTime.textContent[0]) === 12) ||
                Number(this.cardItemTime.textContent[0]) <= 5
            ) {
                this.cardItemTip.textContent =
                    tipMessages.dawn[gu.random(0, tipMessages.dawn.length - 1)];
            } else if (
                this.cardItemTime.textContent.slice(-2) === 'PM' &&
                Number(this.cardItemTime.textContent[0]) >= 6
            ) {
                this.cardItemTip.textContent =
                    tipMessages.night[
                        gu.random(0, tipMessages.night.length - 1)
                    ];
                console.log(1);
            }
            console.log('line124');
        };

        // Initial display
        this.cardInitialDisplay = async function () {
            // this isnt used outside this object, but this cant work in function (since its not suggested that u pass an object and reassign its properties through this)
            this.cardItemIconDesc.textContent = 'Loading...';

            // Initiates weather description and icon
            this.initWeathDescNIcon = async () => {
                this.a = await fetch(
                    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${this.cardItemInput.value}`
                );
                this.data = await this.a.json();
                this.cardItemIcon.src = `https://${this.data.current.condition.icon.slice(
                    2
                )}`;
                this.cardItemIconDesc.textContent = `${this.data.current.condition.text}\r\n${this.data.current.temp_c}\u00B0C`;
                this.lastDesc = this.cardItemIconDesc.textContent;
            };
            this.initTimeDayDate = async () => {
                // Initiates time, day, and date
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
            };
            // Initiates moving clock
            this.moveTime = function () {
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
            };

            this.initWeathDescNIcon();
            this.initTimeDayDate();
            this.moveTime();
        };
        this.cardInitialDisplay();

        // When user changes input
        this.cardItemInput.addEventListener('change', async () => {
            // beautifies input (fixes capitalization)
            await this.inputDataValidation();
            this.updateCardTip();
        });
        // When user selected the card
        this.cardItem.addEventListener('click', async () => {
            if (!this.isActive) {
                this.cardItem.className += ' selectCard';
                this.isActive = true;
                gu.selClass('add-btn').className = 'add-btn opacity-01';

                // Displays the kebab menu
                this.createElems({
                    div: { kebabMenu: 'kebab-menu' },
                    figure: { kebabFigure: 'kebab-menu__figure' },
                });
                this.kebabFigureCln1 = this.kebabFigure.cloneNode(true);
                this.kebabFigureCln2 = this.kebabFigure.cloneNode(true);
                this.kebabMenu.appendChild(this.kebabFigure);
                this.kebabMenu.appendChild(this.kebabFigureCln1);
                this.kebabMenu.appendChild(this.kebabFigureCln2);
                this.cardItem.appendChild(this.kebabMenu);

                // Kebab menu interface
                this.kebabMenu.addEventListener('click', () => {
                    this.kebabClicked = gu.crElem('div');
                    const kebabElems = gu.createElems({
                        div: {
                            removeCard: 'kebab-menu__option',
                            mapInstead: 'kebab-menu__option',
                            backBtn: 'kebab-menu__back-btn',
                            options: 'kebab-menu__option-list',
                            settings: 'kebab-menu__settings',
                        },
                    });

                    this.kebabClicked.className = 'kebab-menu__clicked';

                    kebabElems.removeCard.textContent = 'Remove this card';
                    kebabElems.mapInstead.textContent =
                        'Use map to find a location';
                    kebabElems.settings.textContent = 'Settings';
                    kebabElems.backBtn.textContent = '‹';

                    this.kebabClicked.appendChild(kebabElems.backBtn);
                    this.kebabClicked.appendChild(kebabElems.settings);
                    kebabElems.options.appendChild(kebabElems.removeCard);
                    kebabElems.options.appendChild(kebabElems.mapInstead);
                    this.kebabClicked.appendChild(kebabElems.options);
                    this.cardItem.appendChild(this.kebabClicked);
                    setTimeout(() => {
                        this.kebabClicked.className +=
                            ' kebab-menu__clicked--added';
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
                    if (
                        cardObjContainer[i].isActive &&
                        cardObjContainer[i] !== this
                    ) {
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

        this.cardItem.appendChild(this.cardItemTime);
        this.cardItem.appendChild(this.cardItemInput);
        this.cardItem.appendChild(this.cardItemIcon);
        this.cardItem.appendChild(this.cardItemIconDesc);
        this.cardItem.appendChild(this.cardItemDayDate);
        this.cardItem.appendChild(this.cardItemTip);
        cardContainer.appendChild(this.cardItem);
        // For animation purpose
        setTimeout(() => {
            this.cardItem.className += ' card-item--added';
        }, 100);
    }
}
cardObjContainer = [new Card(0), new Card(1)];

// Removes border on focused card, when user click outside the card
unfocCard(cardObjContainer);

// Add card button
gu.selClass('add-btn').addEventListener('click', () => {
    cardObjContainer.push(new Card());
    // For the new set of cards
    unfocCard(cardObjContainer);
});
