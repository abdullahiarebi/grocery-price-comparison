let groceryData = [];
let groceryList = [];

fetch('https://docs.google.com/spreadsheets/d/1DeZ5yW5ZatBI8UM-Q-Xxiv1-3OuJo1pu56fw0DPRAVI/pub?gid=1930187566&single=true&output=csv')
    .then(response => response.text())
    .then(text => {
        groceryData = Papa.parse(text, { header: true }).data;
    });

const searchBox = document.getElementById('search-box');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const groceryListEl = document.getElementById('grocery-list').getElementsByTagName('tbody')[0]; 
const totalCostEl = document.getElementById('total-cost');
const clearListButton = document.getElementById('clear-list-button');
const printListButton = document.getElementById('print-list-button');

// Custom event for list updates
const groceryListUpdatedEvent = new CustomEvent('groceryListUpdated');

searchButton.addEventListener('click', () => {
    const searchTerm = searchBox.value.toLowerCase();
    const filteredResults = groceryData.filter(item => 
        item.Item.toLowerCase().includes(searchTerm) ||
        item.Brand.toLowerCase().includes(searchTerm) ||
        item.Category.toLowerCase().includes(searchTerm) ||
        item.Description.toLowerCase().includes(searchTerm) 
    );

    displaySearchResults(filteredResults);
});

function displaySearchResults(results) {
    searchResults.innerHTML = ''; 

    results.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('grocery-item');

        // Check if item is in grocery list and add 'selected' class if so
        if (groceryList.some(listItem => listItem.Item === item.Item && listItem.Brand === item.Brand)) {
            itemDiv.classList.add('selected');
        }

        itemDiv.innerHTML = `
            <h3>${item.Item}</h3>
            <p>Description: ${item.Description}</p>
            <p>Brand: ${item.Brand}</p>
            <p>Quantity: ${item.Quantity} ${item.Unit}</p>
            <p>Size: ${item.Size}</p>
            <p>Lidl: £${item.Lidl || 'N/A'}</p> 
            <p>Tesco: £${item.Tesco || 'N/A'}</p> 
            <p>Aldi: £${item.Aldi || 'N/A'}</p> 
        `;
        itemDiv.addEventListener('click', () => {
            updateGroceryList(item);
        });
        searchResults.appendChild(itemDiv);
    });
}

function updateGroceryList(item) {
    const existingItemIndex = groceryList.findIndex(listItem => 
        listItem.Item === item.Item && listItem.Brand === item.Brand
    );

    if (existingItemIndex > -1) {
        groceryList.splice(existingItemIndex, 1); 
    } else {
        groceryList.push(item);
    }

    displayGroceryList();
    calculateTotalCost();

    // Dispatch event to update search results
    searchResults.dispatchEvent(groceryListUpdatedEvent); 
}

// Event listener for grocery list updates
searchResults.addEventListener('groceryListUpdated', () => {
    const searchResultItems = searchResults.querySelectorAll('.grocery-item');
    searchResultItems.forEach(itemDiv => {
        const itemName = itemDiv.querySelector('h3').textContent;
        const brandName = itemDiv.querySelectorAll('p')[1].textContent.replace('Brand: ', ''); 

        const isInGroceryList = groceryList.some(listItem => 
            listItem.Item === itemName && listItem.Brand === brandName
        );

        if (isInGroceryList) {
            itemDiv.classList.add('selected');
        } else {
            itemDiv.classList.remove('selected');
        }
    });
});

function displayGroceryList() {
    groceryListEl.innerHTML = '';

    groceryList.forEach((item, index) => {
        const row = groceryListEl.insertRow();
        const itemCell = row.insertCell();
        const brandCell = row.insertCell();
        const lidlCell = row.insertCell();
        const tescoCell = row.insertCell();
        const aldiCell = row.insertCell();
        const actionsCell = row.insertCell();

        itemCell.textContent = item.Item;
        brandCell.textContent = item.Brand;
        lidlCell.textContent = item.Lidl || 'N/A';
        tescoCell.textContent = item.Tesco || 'N/A';
        aldiCell.textContent = item.Aldi || 'N/A';

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            groceryList.splice(index, 1); 
            displayGroceryList();
            calculateTotalCost();

            // Dispatch event to update search results
            searchResults.dispatchEvent(groceryListUpdatedEvent); 
        });
        actionsCell.appendChild(removeButton);
    });
}

function calculateTotalCost() {
    const storeTotals = { Lidl: 0, Tesco: 0, Aldi: 0 };

    groceryList.forEach(item => {
        if (item.Lidl) storeTotals.Lidl += parseFloat(item.Lidl);
        if (item.Tesco) storeTotals.Tesco += parseFloat(item.Tesco);
        if (item.Aldi) storeTotals.Aldi += parseFloat(item.Aldi);
    });

    let totalCostHTML = '';
    for (const store in storeTotals) {
        if (storeTotals[store] > 0) {
            totalCostHTML += `<p>${store}: £${storeTotals[store].toFixed(2)}</p>`;
        }
    }

    totalCostEl.innerHTML = totalCostHTML;
}

clearListButton.addEventListener('click', () => {
    groceryList = [];
    displayGroceryList();
    calculateTotalCost();
    searchResults.dispatchEvent(groceryListUpdatedEvent); 
});

printListButton.addEventListener('click', () => {
    const printWindow = window.open('', '', 'height=500,width=800');
    printWindow.document.write('<html><head><title>Grocery List</title>');
    printWindow.document.write('<link rel="stylesheet" href="styles.css">'); 
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h2>My Grocery List</h2>');
    printWindow.document.write(document.getElementById('grocery-list').outerHTML);
    printWindow.document.write(document.getElementById('total-cost').outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});