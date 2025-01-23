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
        getGameDiv.classList.remove("hidden");
        //
        const getMetricHeading = document.getElementById("metric-heading");
        getMetricHeading.innerHTML = `Who finished with better ${metricSelected} today?`;
        getMetricHeading.classList.remove("hidden");
        getMetricHeading.classList.add("show");

        const getScoreBoard = document.getElementById("score-board");
        getScoreBoard.classList.remove("hidden");
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
        game_start(stocks_data, metricSelected);
    });
}

//game start
async function game_start(data, metric){
    let score = 0;
    let game_over = false;
    let data_used = []; //array of index used
    
    //random choose option A and B
    let randomIndexA =  Math.floor(Math.random() * 9);  
    data_used.push(randomIndexA);
    let randomIndexB;  

    while(!game_over){  
        randomIndexB =  Math.floor(Math.random() * 9);
       
        while (data_used.includes(randomIndexB)) {
            randomIndexB = Math.floor(Math.random() * 9);
        }
        data_used.push(randomIndexB);
        console.log("used indexes: "+data_used.length);

        renderDivData(data[randomIndexA], data[randomIndexB]);

        //user picked option: A/B
        let userAnswer = await waitForUserChoice();
        renderDivDataB(data[randomIndexB]); //show B

        //check answer and render result
        const answer_checked = checkAnswer(userAnswer,data[randomIndexA], data[randomIndexB]);

        const getScoreBoardTitle = document.getElementById("score-title");
        const getScoreBoardResult = document.getElementById("score"+(data_used.length-1));
        getScoreBoardResult.innerHTML = data[randomIndexA].Symbol+" - "+data[randomIndexB].Symbol;
        getScoreBoardResult.classList.remove("hidden");
        
        if(answer_checked){
            score += 5;
            getScoreBoardResult.classList.add("green")
        } else {
            getScoreBoardResult.classList.add("red")
        }

        getScoreBoardTitle.innerHTML = "Your score is: "+ score;

        //Wait for user to click next
        await waitNext();
        randomIndexA = randomIndexB;

        //game over sequence
        if(data_used.length >= 9){
            getScoreBoardTitle.innerHTML = "GAME-OVER<br>Your score is: "+score; 
            getScoreBoardTitle.style.fontWeight = '700';
            if (score == 40){
                getScoreBoardTitle.innerHTML = "GAME-OVER<br>Your score is: "+score+"<br>PERFECT SCORE !"; 
            }
            game_over=true;
        }
    }
    const getSubmitBtn = document.getElementById("submit-answer");
    getSubmitBtn.classList.add("hidden");
    const getNewGameBtn = document.getElementById("new-game");
    getNewGameBtn.classList.remove("hidden")
}

function restartGame(){
    metricSelected = "";
        //metric selection
        const getRadio = document.getElementById("radio");
        getRadio.classList.remove("hidden");
        //gameboard hide
        const getGameDiv = document.getElementById("game-div");
        getGameDiv.classList.add("hidden");
        
        const getMetricHeading = document.getElementById("metric-heading");
        getMetricHeading.classList.remove("show");
        getMetricHeading.classList.add("hidden");
        //score board hidden
        const getScoreBoard = document.getElementById("score-board");
        getScoreBoard.classList.add("hidden");
        //all results to hidden
        for(i = 1; i<10; i++){
            const getResult = document.getElementById("score"+i);
            getResult.classList.add("hidden")
        }
        //restart title
        const getTitleScore = document.getElementById("score-title");
        getTitleScore.innerHTML = "Your score is: 0";
        getTitleScore.style.fontWeight='400';
        //new game btn- hidden
        const getNewGameBtn = document.getElementById("new-game");
        getNewGameBtn.classList.add("hidden")
        //submit btn- show
        const getSubmitBtn = document.getElementById("submit-answer");
        getSubmitBtn.classList.remove("hidden")
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
        let getPrice = document.getElementById("priceB");
        getPrice.innerHTML = "Price: Hidden";
        getPrice.classList.add("bold");
    } else if (metricSelected === "Change") {
        getChange = document.getElementById("changeB")
        getChange.innerHTML = "Change: Hidden";
        getChange.classList.add("bold");
    } else if (metricSelected === "Volume"){
        getVolume = document.getElementById("volumeB")
        getVolume.innerHTML = "Volume: Hidden";
        getVolume.classList.add("bold");
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
        document.querySelector("button[name='submit-answer']").addEventListener("click", () => {
            const radios = document.getElementsByName('flexRadio2');
            let selectedValue = null;
        
            for (let i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    selectedValue = radios[i].value; 
                    break;  
                }
            }
            if(!selectedValue){
                alert("pick your answer");
            }else{
                resolve(selectedValue);    
            }
        });
    });
}

function submitAnswer() {
    const radios = document.getElementsByName('flexRadio2');
    let selectedValue = null;

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedValue = radios[i].value; //save value
            break;  
        }
    }

    if(!selectedValue){
        alert("pick your answer");
    }else{
        return selectedValue;
    }

}

function waitNext(){
    const submitBtn = document.getElementById("submit-answer");
    submitBtn.classList.add("hidden");
    const nextBtn = document.getElementById("next");
    nextBtn.classList.remove("hidden")

     // Clear radio selection
     const radios = document.getElementsByName('flexRadio2');
     for (let i = 0; i < radios.length; i++) {
         radios[i].checked = false;
     }

    return new Promise((resolve) => {
        nextBtn.addEventListener("click", () => {
            nextBtn.classList.add("hidden"); 
            submitBtn.classList.remove("hidden");
            resolve()
    })

})} 

function checkAnswer(user_answer, dataA, dataB){
    
    let isCorrect; 

    //fix prefix to turn into float
    if(metricSelected == "Change"){ 
        dataA.Change = parseFloat(dataA.Change.replace("+", ""));
        dataB.Change = parseFloat(dataB.Change.replace("+", ""));
    }

    if(user_answer == "A"){ 
        if(dataA[metricSelected] > dataB[metricSelected]){
            isCorrect = true;
        }else if ((dataA[metricSelected] > dataB[metricSelected])){
            isCorrect = false
        }
    }

    if(user_answer == "B"){ 
        if(dataA[metricSelected] < dataB[metricSelected]){
            isCorrect = true;
        }else{
            isCorrect = false;
        }    
    }
    
    if(isCorrect){
        return true;
        
    }else{
        return false;
    }

}



//change score board to dynamic
//if true symbol-symbonl with color green, false red (runcount?)