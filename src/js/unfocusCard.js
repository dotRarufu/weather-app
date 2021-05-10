const gu = require('./genUtility');

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
    handler[`${k}`] = elems[k];
  }

  for (let i = 0; i < removerElems.length; i += 1) {
    if (removerElems[i] === '.code-section') {
      document.querySelector(`.code-section`).addEventListener('click', () => {
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
      .querySelector(`${removerElems[i]}`)
      .addEventListener('click', (e) => {
        if (document.querySelector(`${removerElems[i]}`) !== e.target) {
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
