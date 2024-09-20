function fetchData() {
  const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQz_tgwab1x4tNxIdO94L9nY-hgjtImndTag6zy7UtStJE7FGALHFxRvF848AxG5HhGo68xNNAU2xsn/pub?gid=0&single=true&output=csv';
  const noCacheURL = sheetURL + '&t=' + new Date().getTime(); // Prevent caching

  fetch(noCacheURL)
    .then(response => response.text())
    .then(data => {
      console.log("Raw CSV data fetched:", data);
      const parsedData = Papa.parse(data, { header: true }).data;
      console.log("Parsed data:", parsedData);
      displayResults(parsedData);
    })
    .catch(error => {
      console.error("Error fetching CSV data:", error);
    });
}

// Call fetchData initially to load the data when the page loads
fetchData();

function displayResults(results) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  if (results && results.length > 0) {
    let tableHTML = '<table><tr>';
    tableHTML += '<th>Item</th><th>Brand</th><th>Size</th><th>Quantity</th><th>Unit</th>';
    tableHTML += '<th class="hide-column">Price at Lidl</th>';
    tableHTML += '<th class="hide-column">Date Checked at Lidl</th>';
    tableHTML += '<th class="hide-column">Price at Ade\'s</th>';
    tableHTML += '<th class="hide-column">Date Checked at Ade\'s</th>';
    tableHTML += '<th class="hide-column">Price at Tesco</th>';
    tableHTML += '<th class="hide-column">Date Checked at Tesco</th>';
    tableHTML += '<th class="hide-column">Price at Aldi</th>';
    tableHTML += '<th class="hide-column">Date Checked at Aldi</th>';
    tableHTML += '<th class="hide-column">Item Category</th>';
    tableHTML += '<th class="hide-column">Brand Hierarchy</th>';
    tableHTML += '</tr>';

    results.forEach(row => {
      tableHTML += '<tr>';
      tableHTML += `<td>${row['Item']}</td>`;
      tableHTML += `<td>${row['Brand']}</td>`;
      tableHTML += `<td>${row['Size']}</td>`;
      tableHTML += `<td>${row['Quantity']}</td>`;
      tableHTML += `<td>${row['Unit']}</td>`;
      tableHTML += `<td class="hide-column">${row['Price at Lidl']}</td>`;
      tableHTML += `<td class="hide-column">${row['Date Checked at Lidl']}</td>`;
      tableHTML += `<td class="hide-column">${row['Price at Ade\'s']}</td>`;
      tableHTML += `<td class="hide-column">${row['Date Checked at Ade\'s']}</td>`;
      tableHTML += `<td class="hide-column">${row['Price at Tesco']}</td>`;
      tableHTML += `<td class="hide-column">${row['Date Checked at Tesco']}</td>`;
      tableHTML += `<td class="hide-column">${row['Price at Aldi']}</td>`;
      tableHTML += `<td class="hide-column">${row['Date Checked at Aldi']}</td>`;
      tableHTML += `<td class="hide-column">${row['Item Category']}</td>`;
      tableHTML += `<td class="hide-column">${row['Brand Heirarchy']}</td>`;
      tableHTML += '</tr>';
    });

    tableHTML += '</table>';
    resultsDiv.innerHTML = tableHTML;
  } else {
    resultsDiv.innerHTML = '<p>No results found.</p>';
  }
}

// Function to toggle the visibility of a column (1-based index)
function toggleColumn(columnIndex) {
  const table = document.querySelector('table');
  const rows = table.querySelectorAll('tr');

  rows.forEach(row => {
    const cells = row.querySelectorAll('th, td');
    if (cells[columnIndex]) {
      cells[columnIndex].classList.toggle('hide-column');
    }
  });
}
