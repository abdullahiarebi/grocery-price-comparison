let parsedData = []; // Store parsed CSV data globally for search

function fetchData() {
  fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQz_tgwab1x4tNxIdO94L9nY-hgjtImndTag6zy7UtStJE7FGALHFxRvF848AxG5HhGo68xNNAU2xsn/pub?gid=0&single=true&output=csv') 
    .then(response => response.text())
    .then(data => {
      console.log("Raw CSV data fetched:", data); 

      // Parse the CSV data 
      parsedData = Papa.parse(data, { header: true }).data; 
      console.log("Parsed data:", parsedData); 

      // Initially display all data when the page loads
      displayResults(parsedData); 
    })
    .catch(error => {
      console.error("Error fetching CSV data:", error);
    });
}

// Call fetchData initially to load the data when the page loads
fetchData(); 

function search() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  console.log("Search term entered:", searchTerm); 

  // Filter results based on search term
  const filteredResults = parsedData.filter(row => 
    row['Item'].toLowerCase().includes(searchTerm)
  );

  displayResults(filteredResults);
}

function displayResults(results) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  if (results && results.length > 0) {
    let tableHTML = '<table><tr>';
    tableHTML += `
      <th>Item</th>
      <th>Brand</th>
      <th>Size</th>
      <th>Quantity</th>
      <th>Unit</th>
      <th>Price at Lidl</th>
      <th>Date Checked at Lidl</th>
      <th>Price at Ade's</th>
      <th>Date Checked at Ade's</th>
      <th>Price at Tesco</th>
      <th>Date Checked at Tesco</th>
      <th>Price at Aldi</th>
      <th>Date Checked at Aldi</th>
      <th>Item Category</th>
      <th>Brand Heirarchy</th>
    </tr>`;

    results.forEach(row => {
      tableHTML += '<tr>';
      tableHTML += `<td>${row['Item']}</td>`;
      tableHTML += `<td>${row['Brand']}</td>`;
      tableHTML += `<td>${row['Size']}</td>`;
      tableHTML += `<td>${row['Quantity']}</td>`;
      tableHTML += `<td>${row['Unit']}</td>`;
      tableHTML += `<td>${row['Price at Lidl']}</td>`;
      tableHTML += `<td>${row['Date Checked at Lidl']}</td>`;
      tableHTML += `<td>${row['Price at Ade\'s']}</td>`;
      tableHTML += `<td>${row['Date Checked at Ade\'s']}</td>`;
      tableHTML += `<td>${row['Price at Tesco']}</td>`;
      tableHTML += `<td>${row['Date Checked at Tesco']}</td>`;
      tableHTML += `<td>${row['Price at Aldi']}</td>`;
      tableHTML += `<td>${row['Date Checked at Aldi']}</td>`;
      tableHTML += `<td>${row['Item Category']}</td>`;
      tableHTML += `<td>${row['Brand Heirarchy']}</td>`;
      tableHTML += '</tr>';
    });

    tableHTML += '</table>';
    resultsDiv.innerHTML = tableHTML;
  } else {
    resultsDiv.innerHTML = '<p>No results found.</p>';
  }
}