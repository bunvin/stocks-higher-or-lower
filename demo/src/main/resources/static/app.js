//CHOOSE YOUR METRIC: PRICE, VOLUME, CHANGE
let metricSelected = "";

function setSelectedMetric() {
    const radios = document.getElementsByName('flexRadioDefault');
    let selectedValue = null;

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedValue = radios[i].value; 
            break;  
        }
    }

    if (selectedValue) {
        metricSelected = selectedValue;
        //change selection to hide
        const getRadio = document.getElementById("radio");
        getRadio.classList.add("hidden");
        //change gameboard to show
        const getGameDiv = document.getElementById("game-div");
        getGameDiv.classList.add("game-div");
        //
        const getMetricHeading = document.getElementById("metric-heading");
        getMetricHeading.innerHTML = `Who finished with better ${metricSelected} today?`;
        getMetricHeading.classList.add("show");

        fetchStockData(); //FETCHING THE DATA 
    } else {
        alert('Please select an option');
    }
}

function fetchStockData(){
    let stocks_data;
    fetch('http://localhost:8080/api/stocks')
      .then(response => response.json())
      .then(values => {
        stocks_data = values;
        console.log(stocks_data);
        game_start(stocks_data, metricSelected);
    });
}


//game start
function game_start(data, metric){
    console.log(metric);
    let score = 0;
    let game_over = false;
    let data_used = []; //array of index used
    
    //random choose option A and B
    let randomIndexA =  Math.floor(Math.random() * 10);
    let randomIndexB =  Math.floor(Math.random() * 10);
    while (randomIndexA == randomIndexB){
        randomIndexB =  Math.floor(Math.random() * 10);
    };
    data_used.push(randomIndexA);
    data_used.push(randomIndexB);

    renderDivData(data[randomIndexA], data[randomIndexB], metric);

    //user picked option: A/B
    let user_answer;
     // Set up event listeners for optionA and optionB buttons
     document.querySelector("button[name='optionA']").addEventListener("click", () => {
        user_answer = "A";
        console.log("User picked: " + user_answer);
    });

    document.querySelector("button[name='optionB']").addEventListener("click", () => {
        user_answer = "B";
        console.log("User picked: " + user_answer);
    });

    //need a function to continue data is stuck in the event listener

}

function renderDivData(dataA, dataB, metric) {
    // Helper function to render stock data
    const renderStockData = (data, option) => {
        const getTitle = document.getElementById(`title${option}`);
        const getPrice = document.getElementById(`price${option}`);
        const getChange = document.getElementById(`change${option}`);
        const getVolume = document.getElementById(`volume${option}`);
        const getDesc = document.getElementById(`desc${option}`);

        getTitle.innerHTML = `${data.Company} (${data.Symbol})`;
        getPrice.innerHTML = `Price: ${data.Price}`;
        getChange.innerHTML = `Change: ${data.Change}`;
        getVolume.innerHTML = `Volume: ${data.Volume}`;
        getDesc.innerHTML = `${data.Description}`;
    };

    renderStockData(dataA, 'A');
    renderStockData(dataB, 'B');

    // hide option B metric chosed
    if (metric === "price") {
        document.getElementById("priceB").innerHTML = "Price: Hidden";
    } else if (metric === "change") {
        document.getElementById("changeB").innerHTML = "Change: Hidden";
    } else {
        document.getElementById("volumeB").innerHTML = "Volume: Hidden";
    }
}
