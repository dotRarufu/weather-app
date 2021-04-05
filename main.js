(function outer() {
    const height = window.innerHeight;
    const width = window.innerWidth;

    const outerContainer = document.querySelector(`.outer-container`);
    outerContainer.style.height = `${height}px`;
    outerContainer.style.width = `${width}px`;

    const innerContainer = document.querySelector(`.inner-container`);
    innerContainer.style.width = `${width * 0.50}px`;
    innerContainer.style.height = `${height * 0.90}px`;

    const navElem = document.querySelector(`.nav`);
    const iconContainer = document.querySelector(`.icon-container`);
    const iconTempDesc = document.querySelector(`.icon-temp-desc`);
    const descriptContainer = document.querySelector(`.description-container`);

    const inputElem = document.createElement(`input`);
    const icon = document.createElement(`img`);

    inputElem.setAttribute(`type`, `text`);
    inputElem.setAttribute(`placeholder`, `City`);

    descriptContainer.insertBefore(inputElem, iconTempDesc);

    inputElem.value = 'Manila';

    function displayError(message) {
        const errorBoxContainer = document.querySelector(`.error-box-container`);
        const errorIcon = document.querySelector(`.error-box-container img`);
        const errorMsg = document.querySelector(`.error-message`);

        errorMsg.textContent = message;

        errorBoxContainer.className += " fade-in";

        setTimeout(() => {
            errorBoxContainer.className = errorBoxContainer.className.replace(`${errorBoxContainer.className.slice(19, 27)}`, ``);
            

        }, 3000);

    }
    /*
    let lastChar = inputElem.value;
    inputElem.addEventListener(`keydown`, (e) => {   
        
        console.log(lastChar);     
        if (e.key.match(/[a-zA-Z]/)) {
            console.log(`accept`);
            lastChar = inputElem.value;
        } else {

            console.log(`nope`);
            //console.log(inputElem.value[inputElem.value.length-1]);
            inputElem.value = lastChar;
            console.log(inputElem.value);
        }
        
    });
    */
    let lastVal = inputElem.value;
    let lastDesc;
    
    inputElem.addEventListener(`change`, async () => {
        console.log();
        if (inputElem.value != lastVal && inputElem.value != "") { // Check if input is non equal to last val and nonempty
            const p = inputElem.value.match(/[\s]/)
            const q = inputElem.value.match(/[0-9]/g);            
            if ((!p && !q) || (p && !q)) { // Check if input contains no space and no numbers, or spaces but not numbers
                iconTempDesc.textContent = `Loading...`;
                const a = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${inputElem.value}`);
                const data = await a.json();
                if (inputElem.value == data.location.name) { // Check if input matches the location
                    lastVal = inputElem.value;
                    console.log(data);
                    iconTempDesc.textContent = `${data.current.condition.text} \r\n ${data.current.temp_c}\u00B0C`;

                    iconContainer.removeChild(document.querySelector(`.icon-container img`));
                    const imgElem = document.createElement(`img`);
                    imgElem.src = `https://${data.current.condition.icon.slice(2)}`;
                    iconContainer.appendChild(imgElem);
                } else {                
                    //document.createElement(`div`);

                    displayError(`Uh oh, no result for \"${inputElem.value}\"`);

                    iconTempDesc.textContent = lastDesc;
                    inputElem.value = lastVal;
                }
            } else {
                displayError(`Hm, only letters are allowed`);
                inputElem.value = lastVal;
            }

        }
        else {
            displayError(`Nope, it can't be blank`);

            inputElem.value = lastVal;
        }
    });

    const apiKey = `f80c5ae3ac3a4eb1bf965456210404`;

    (async function () {
        iconTempDesc.textContent = `Loading...`;

        const a = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${inputElem.value}`);
        const data = await a.json();

        icon.src = `https://${data.current.condition.icon.slice(2)}`;
        iconContainer.appendChild(icon);

        iconTempDesc.textContent = `${data.current.condition.text} \r\n ${data.current.temp_c}\u00B0C`;
        lastDesc = iconTempDesc.textContent;
    })();
})();
/*
2. store user's location on localStorage then put it in the input.value
3. automatically get the user's location via geolocation api
4. add selecting city via google map
...
n. tidy css, js, html
*/