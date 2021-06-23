// queries

const rawInputForm = document.querySelector('.raw-input');
const productionInputFields = document.querySelectorAll('.input-field-production');
const priceInputFields = document.querySelectorAll('.input-field-price');
const profitDisplay = document.querySelectorAll('.profit');
const availableCrafts = document.querySelector('.available-crafts');
const dropdownList = document.querySelector('.materials-button');
const materialList = document.querySelector('.materials');
const inSaleButtons = document.querySelectorAll('.button-2');


// Gets the material value selected

let materialValue = 'primordialSaronite';

// Pushes to rawAverage the calculated totalCost

const rawMaterialCost = (price, quantity, material) => {
    
    // sums all passed quantity values to find out how many items are actually bought

    quantityCounter[material] += Number(quantity);
    

    const totalCost = price * quantity;
        
    rawPrices[material].push(totalCost);

    // Sums all values from rawPrices and returns the average
    if (quantityCounter[material] === 0) {

        rawAverage[material] = Math.round(rawPrices[material].reduce((acc, curr) => acc + curr) / 1);
        
    } else {

        rawAverage[material] = Math.round(rawPrices[material].reduce((acc, curr) => acc + curr) / quantityCounter[material]);

    }
    

};

// Calculates the crafting cost (

const craftingCost = (average, items) => {

    const costs = [];
    
    // Iterates through itemsPerRecipe keys and defines totalPrice to store the temporary
    // value of an item then that value is pushed to costs, etc. When that process finish we iterate
    // through costs to display the values in the input field

    Object.keys(itemsPerRecipe)
        .forEach(property => {
            const totalPrice = [];
        
            Object.keys(itemsPerRecipe[property])
                .forEach(item => {

                    totalPrice.push(average[item] * items[property][item]);
            
            });
            costs.push(totalPrice.reduce((acc, curr) => acc + curr));

    });

    for (let i = 0; i < costs.length; i++) {

        if (inSaleButtons[i].classList.contains('in-sale') === false) {
            productionInputFields[i].value = costs[i];

        }        
    }
};



// Takes as arguments the input fields for prices and calculated costs then substracts crafting cost to selling price 
// pushing the result to an array to finally display calculate profit

const calculateProfit = (prices, costs) => {

    const profits = [];

    for (let i = 0; i < prices.length; i++) {

        profits.push(Math.round((prices[i].value * 0.95) - costs[i].value));
        
    };
    
    for (let i = 0; i < profits.length; i++) {

        profitDisplay[i].innerText = profits[i];

    }


};

// Removes from quantityCounter the amount of materials used to craft an item when inSale button is activated

const trackInventory = (inventory, itemsToRemove) => {

    Object.keys(itemsToRemove).forEach(item => {
        rawPrices[item] = [];
        inventory[item] -= itemsToRemove[item];
        rawPrices[item].push(rawAverage[item] * inventory[item]);
        
    });
    localStorage.setItem('quantityCounter', JSON.stringify(inventory));
    localStorage.setItem('rawAverage', JSON.stringify(rawAverage));

}

// Listens for click to update the average and calls the craftingCost and calculateProfit functions

rawInputForm.send.addEventListener('click', e => {

    e.preventDefault();
    rawMaterialCost(rawInputForm.price.value, rawInputForm.quantity.value, materialValue);

    rawInputForm.reset();

    craftingCost(rawAverage, itemsPerRecipe);

    calculateProfit(priceInputFields, productionInputFields);


    // Saves rawAverage and quantityCounter to the localStorage

    localStorage.setItem('rawAverage', JSON.stringify(rawAverage));
    localStorage.setItem('quantityCounter', JSON.stringify(quantityCounter));

});

// Listens for keyup events to update the profit calling calculateProfit function

availableCrafts.addEventListener('keyup', e => {

    if (e.target.classList.contains('input-field-price')) {

        calculateProfit(priceInputFields, productionInputFields);

    }

});


// Display dropdown list

dropdownList.addEventListener('click', e => {

    e.preventDefault();
    materialList.classList.toggle('d-none')
     
});

materialList.addEventListener('click', e => {


    if (e.target.classList.contains('material')) {

        materialList.classList.toggle('d-none');
        materialValue = e.target.innerText;
      
    }
})

// Changes InSale button color and when user clicks on the inSale button it saves the last price in localstorage and prevents updates on the input field

availableCrafts.addEventListener('click', e => {
    e.preventDefault();
    const lastPrice = e.target.parentElement[1];
    if (e.target.classList.contains('button-2') && !e.target.classList.contains('in-sale')) {

        e.target.classList.add('in-sale');
        localStorage.setItem(lastPrice.id, lastPrice.value);
        trackInventory(quantityCounter, itemsPerRecipe[e.target.id]);
        
   
    } else if (e.target.classList.contains('button-2') && e.target.classList.contains('in-sale')) {

        e.target.classList.remove('in-sale');
        localStorage.removeItem(lastPrice.id);

    }
});



// Check localStorage for rawAverage and quantityCounter then call rawMaterialCost, craftingCost and calculateProfit

if (localStorage.getItem('rawAverage') && localStorage.getItem('quantityCounter')) {

    const price = JSON.parse(localStorage.getItem('rawAverage'));
    const quantity = JSON.parse(localStorage.getItem('quantityCounter'));
    const material = Object.keys(rawAverage);

    for (let i = 0; i < material.length; i++) {

        rawMaterialCost(price[material[i]], quantity[material[i]], material[i]);


    }
    craftingCost(rawAverage, itemsPerRecipe);
    calculateProfit(priceInputFields, productionInputFields);

}

// Checks if there's saved crafting costs in local storage and puts them in the correspondent input fields when starting the app and puts in-sale class to the insale buttons
for (let i = 0; i < productionInputFields.length; i++) {

    if (localStorage.getItem(productionInputFields[i].id)) {

        productionInputFields[i].value = localStorage.getItem(productionInputFields[i].id)
        inSaleButtons[i].classList.add('in-sale');

    }

}

