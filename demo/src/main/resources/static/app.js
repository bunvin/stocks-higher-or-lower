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
        getGameDiv.classList.remove("hidden");
        //
        const getMetricHeading = document.getElementById("metric-heading");
        getMetricHeading.innerHTML = `Who finished with better ${metricSelected} today?`;
        getMetricHeading.classList.remove("hidden");
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
async function game_start(data, metric){
    console.log(metric);
    let score = 0;
    let game_over = false;
    let data_used = []; //array of index used
    
    //random choose option A and B
    let randomIndexA =  Math.floor(Math.random() * 9);  
    data_used.push(randomIndexA);
    console.log("new index A: "+randomIndexA);
    console.log("used indexes: "+data_used);
    let randomIndexB;  

    while(!game_over){  
        randomIndexB =  Math.floor(Math.random() * 9);
       
        while (data_used.includes(randomIndexB)) {
            randomIndexB = Math.floor(Math.random() * 9);
        }
        data_used.push(randomIndexB);
        console.log("new index B: "+randomIndexB);
        console.log("used indexes: "+data_used);

        renderDivData(data[randomIndexA], data[randomIndexB]);

        //user picked option: A/B
        let userAnswer = await waitForUserChoice();
        console.log("User answered: " + userAnswer);
        renderDivDataB(data[randomIndexB]); //show B

        //check if true
        let answer_checked = checkAnswer(userAnswer,data[randomIndexA], data[randomIndexB]);
        
        if(answer_checked){
            score += 5;
            console.log("your score is: "+score);
            randomIndexA = randomIndexB;
            console.log("new index A: "+randomIndexA)
        } else {
            console.log("Game is over!")
            game_over=true;
        }

        console.log("End of loop");
    }
}

function renderDivData(dataA, dataB) {
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
    if (metricSelected === "Price") {
        document.getElementById("priceB").innerHTML = "Price: Hidden";
    } else if (metricSelected === "Change") {
        document.getElementById("changeB").innerHTML = "Change: Hidden";
    } else if (metricSelected === "Volume"){
        document.getElementById("volumeB").innerHTML = "Volume: Hidden";
    }
}

function renderDivDataB(dataB) {
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

    renderStockData(dataB, 'B');
}

function waitForUserChoice() {
    return new Promise((resolve) => {
        // Set up event listeners
        document.querySelector("button[name='optionA']").addEventListener("click", () => {
            resolve("A");
        });

        document.querySelector("button[name='optionB']").addEventListener("click", () => {
            resolve("B");
        });
    });
}

function checkAnswer(user_answer, dataA, dataB){
    console.log("Metric selected is: "+metricSelected);

    if(metricSelected == "Change"){
        floatPositiveChangeA = 
        dataA.Change = parseFloat(dataA.Change.replace("+", ""));
        dataB.Change = parseFloat(dataB.Change.replace("+", ""));
    }

    if(user_answer == "A"){ 
        console.log(dataA[metricSelected]); //undefined
        if(dataA[metricSelected] > dataB[metricSelected]){
            console.log("you are right!"); //not entering here
            return true;
        }else if ((dataA[metricSelected] > dataB[metricSelected])){
            console.log("you are wrong !");
            renderDivDataB(data[randomIndexB]);
            return false;
        }
    }

    if(user_answer == "B"){ 
        console.log(dataB[metricSelected]); //undefined
        if(dataA[metricSelected] < dataB[metricSelected]){
            console.log("you are right!"); //not entering here
            return true;
        }else{
            console.log("you are wrong !");
            return false;
        }    
    }

}


// while(!game_over){  
//     randomIndexB =  Math.floor(Math.random() * 9);
   
//     while (data_used.includes(randomIndexB)) {
//         randomIndexB = Math.floor(Math.random() * 9);
//     }
//     data_used.push(randomIndexB);
//     console.log("new index B: "+randomIndexB);
//     console.log("used indexes: "+data_used);

//     renderDivData(data[randomIndexA], data[randomIndexB]);

//     //user picked option: A/B
//     waitForUserChoice().then((userAnswer) => {
//         renderDivDataB(data[randomIndexB]); //show B
//     //check if true
//     answer_checked = checkAnswer(userAnswer,data[randomIndexA], data[randomIndexB]);
//     if(answer_checked){
//         score += 5;
//         console.log("your score is: "+score);
//         randomIndexA = randomIndexB;
//         console.log("new index A: "+randomIndexA)
//     } else if (!answer_checked){
//         console.log("Game is over!")
//         game_over=true;
//     }
// });
//         console.log("end of loop");
// }