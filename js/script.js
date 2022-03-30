let sun = "";
let water = "";
let pet = "";
let results = false;

const breakpoint = '(max-width: 800px)';
const mediaQuery = window.matchMedia(breakpoint);

mediaQuery.addEventListener('change', event => {
    if (event.matches && !results) {
        document.getElementById("resultsdiv").style.display = "none";
    } else if (event.matches) {
        document.getElementById("resultsdiv").style.display = "flex";
    } else if (!event.matches && results) {
        document.getElementById("resultsdiv").style.display = "grid";
    }
});

function specialBreakPoint() {

    if (window.screen.width <= 800 || window.innerWidth <= 800) {
        document.getElementById("resultsdiv").style.display = "flex";
    }
}

function resetValues() {

    document.getElementById("sun").selectedIndex = 0;
    document.getElementById("water").selectedIndex = 0;
    document.getElementById("pet").selectedIndex = 0;

    sun = "";
    water = "";
    pet = "";
}

document.addEventListener('input', function (event) {

    switch (event.target.id) {
        case 'sun':
            sun = event.target.value;
            break;
        case 'water':
            water = event.target.value;
            break;
        case 'pet':
            pet = event.target.value;
            break;
    }

    if ((sun && water && pet) != "") {
        const apiURL = `https://front-br-challenges.web.app/api/v2/green-thumb/?sun=${sun}&water=${water}&pets=${pet}`;
        fetch(apiURL)
            .then((res) => res.json())
            .then((data) => {

                // Catch 404 error
                if (data.status == 404) {
                    results = false;
                    document.getElementById('resultstatus')
                        .innerHTML = 'No plants found...';
                    document.getElementById("homeresultsdiv").style.display = "flex";
                    document.getElementById("backtopdiv").style.display = "none";
                    resetValues();
                    return;
                } else {
                    results = true;
                    let petIcon = "pet";
                    if (data[0].toxicity == true) {
                        petIcon = "toxic";
                    }

                    // Reset values
                    resetValues();

                    // Hide the no results div and show the results div
                    document.getElementById("homeresultsdiv").style.display = "block";
                    document.getElementById("beforeapi1").style.display = "none";
                    document.getElementById("beforeapi2").style.display = "none";
                    document.getElementById("resultstopdiv").style.display = "block";
                    document.getElementById("resultsdiv").style.display = "grid";
                    document.getElementById("backtopdiv").style.display = "block";

                    specialBreakPoint();

                    // Empty results before adding more
                    document.getElementById('resultsdiv').innerHTML = "";

                    let resultsTopDiv = document.getElementById('resultstopdiv');
                    resultsTopDiv.innerHTML = `<img class="picksymbol" src="illustrations/pick.png" alt="pick symbol" />
                    <p class="ourpicks">Our picks for you</p>`

                    // Start creating content with API data
                    let resultsDiv = document.getElementById('resultsdiv');
                    resultsDiv.innerHTML += `<div class="bigdiv">
                    <div class="staff">✨ Staff favorite</div>
                    <div class="imagediv">
                    <img src="${data[0].url}" alt="${data[0].name}" class="bigimage" />
                    </div>
                    <div class="bottom">
                    <div class="name">${data[0].name}</div>
                    <div class="icons">
                    <p class="price">$${data[0].price}</p>
                    <img src="icons/${petIcon}.svg" class="iconsvg" />
                    <img src="icons/${data[0].sun}.svg" class="iconsvg"/>
                    <img src="icons/${data[0].water}.svg" />
                    </div>
                    </div>
                    </div>`;
                    data.slice(1).map((item) => {
                        let toxic = "toxic";
                        if (item.toxicity == false) {
                            toxic = "pet";
                        }
                        resultsDiv.innerHTML += `<div class="smalldiv">
                        <div class="image">
                        <img src="${item.url}" alt="${item.name}" class="smallimage" />
                        </div>  
                        <p class="name">${item.name}</p>
                        <div class="bottom">
                        <div class="price">$${item.price}</div>
                        <div class="icons">
                        <img src="icons/${toxic}.svg" class="iconsvg" />
                        <img src="icons/${item.sun}.svg" class="iconsvg"/>
                        <img src="icons/${item.water}.svg" />
                        </div>
                        </div>  
                        </div>`;
                    });
                }
            });
    }

}, false);
