// Fetch stock data from the API
fetch('http://localhost:8080/api/stocks')
  .then(response => response.json())
  .then(data => {
    const stockList = document.getElementById('stock-list');
    
    // Clear any existing content
    stockList.innerHTML = '';

    // Loop through the stock data and display each stock
    data.forEach(stock => {
      const stockDiv = document.createElement('div');
      stockDiv.classList.add('stock-item');
      
      stockDiv.innerHTML = `
        <h3>${stock.Company}</h3>
        <p>Symbol: ${stock.Symbol}</p>
        <p>Price: ${stock.Price}</p>
        <p>Change: ${stock.Change}</p>
        <p>Volume: ${stock.Volume}</p>
        <p>Description: ${stock.Description}</p>
        <p>Last Updated: ${stock.Update}</p>
      `;
      
      stockList.appendChild(stockDiv);
    });
  })
  .catch(error => {
    console.error('Error loading stock data:', error);
  });