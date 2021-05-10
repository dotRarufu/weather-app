const ace = require('brace');
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
      this.elem.id = `${this.name}File`;
      this.elem.textContent = `${this.name}.js`;

      preMadeElems.codeSectionFiles.appendChild(this.elem);
    }

    focusOrUnfocus() {
      if (this.isActive) {
        this.elem.className = 'code-section__files--selected';
      } else {
        this.elem.className = `${this.elem.className.replace(
          'code-section__files--selected',
          ''
        )}`;
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
        `${codeList[`${codeSectionFileObjContainer[i].name}`]}`
      );
    });
  }

  // Default
  codeSectionFileObjContainer[3].isActive = true;
  codeSectionFileObjContainer[3].focusOrUnfocus();
  editor.session.setValue(
    `${codeList[`${codeSectionFileObjContainer[3].name}`]}`
  );
}

module.exports.initCode = initCode;
