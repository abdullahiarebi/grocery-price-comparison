document.addEventListener('DOMContentLoaded', (event) => {
    const searchButton = document.getElementById('search-button');
    const searchBox = document.getElementById('search-box');
    const resultsContainer = document.getElementById('results-container');
    const filterContainer = document.getElementById('filter-container');
    let productData = [];
    let currentSortOrder = {}; 

    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQz_tgwab1x4tNxIdO94L9nY-hgjtImndTag6zy7UtStJE7FGALHFxRvF848AxG5HhGo68xNNAU2xsn/pub?gid=0&single=true&output=csv')
        .then(response => response.text())
        .then(csvData => {
            productData = Papa.parse(csvData, { header: true }).data;
            createFilterToggles(productData[0]); 
            displayResults(productData); 
        })
        .catch(error => {
            console.error('Error fetching or parsing CSV data:', error);
        });

    searchButton.addEventListener('click', () => {
        const query = searchBox.value.toLowerCase();
        const filteredData = productData.filter(product => {
            if (product['Item']) { 
                return product['Item'].toLowerCase().includes(query);
            } else {
                return false; 
            }
        });

        displayResults(filteredData);
    });

    function createFilterToggles(headers) {
    const excludedColumns = ['Item', 'Brand', 'Quantity', 'Size', 'Unit']; // Columns to exclude

    for (const key in headers) {
        if (excludedColumns.includes(key)) {
            continue; // Skip excluded columns
        }

        const toggle = document.createElement('div');
        toggle.classList.add('filter-toggle');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `toggle-${key}`;
        checkbox.checked = true; 
        checkbox.addEventListener('change', () => {
            toggleColumn(key);
        });

        const label = document.createElement('label');
        label.htmlFor = `toggle-${key}`;
        label.textContent = key;

        toggle.appendChild(checkbox);
        toggle.appendChild(label);
        filterContainer.appendChild(toggle);
    }
}
    function toggleColumn(columnName) {
        const table = resultsContainer.querySelector('table');
        const headerIndex = Array.from(table.querySelectorAll('th')).findIndex(th => th.textContent === columnName);

        for (let i = 0; i < table.rows.length; i++) {
            table.rows[i].cells[headerIndex].style.display = document.getElementById(`toggle-${columnName}`).checked ? '' : 'none';
        }
    }

    function displayResults(results) {
        resultsContainer.innerHTML = ''; 

        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        const table = document.createElement('table');

        const headerRow = table.insertRow();
        for (const key in results[0]) {
            const th = document.createElement('th');
            th.textContent = key;
            th.addEventListener('click', () => {
                sortTable(key);
            });
            headerRow.appendChild(th);
        }

        results.forEach(product => {
            const row = table.insertRow();
            for (const key in product) {
                const cell = row.insertCell();
                cell.textContent = product[key];
            }
        });

        resultsContainer.appendChild(table);
    }

    function sortTable(column) {
        if (currentSortOrder.column === column) {
            currentSortOrder.ascending = !currentSortOrder.ascending;
        } else {
            currentSortOrder.column = column;
            currentSortOrder.ascending = true;
        }

        const filteredData = Array.from(resultsContainer.querySelector('table').querySelectorAll('tr'))
            .slice(1) 
            .map(row => Array.from(row.cells).map(cell => cell.textContent));

        filteredData.sort((a, b) => {
            const valueA = a[getColumnIndex(column)];
            const valueB = b[getColumnIndex(column)];

            if (!isNaN(valueA) && !isNaN(valueB)) {
                return currentSortOrder.ascending ? valueA - valueB : valueB - valueA;
            } else {
                return currentSortOrder.ascending 
                    ? valueA.localeCompare(valueB) 
                    : valueB.localeCompare(valueA);
            }
        });

        displayResults(filteredData.map(row => {
            const obj = {};
            Array.from(resultsContainer.querySelector('table').querySelectorAll('th')).forEach((th, index) => {
                obj[th.textContent] = row[index];
            });
            return obj;
        }));
    }

    function getColumnIndex(columnName) {
        return Array.from(resultsContainer.querySelector('table').querySelectorAll('th'))
            .findIndex(th => th.textContent === columnName);
    } 
});