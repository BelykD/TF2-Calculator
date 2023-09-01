/*
TF2 Calculator - Chrome Extension

Author: Dylan Belyk
*/
    
const ref = document.getElementById('refined'); // Refined Price input
const key = document.getElementById('key'); // Key Amount input
const res = document.getElementById('refTotal'); // Total metal number
const metal = document.getElementById('metals'); // Metal values
const calc = document.getElementById('calc'); // Calculate button
const teamToggle = document.getElementById('changeTeam'); // Change team toggle
// Function for the main logic - Calculates values and outputs them to be displayed
function updateValue() {
    const refValue = parseFloat(ref.value); // Gets value input into Refined Price
    const keyValue = parseFloat(key.value); // Gets value input into Key Amount

    const outResult = refValue * keyValue;
    // Outputting calculated value to display - Total Metal
    res.innerHTML = '<span class="highlight" id="refTotal">'
        + outResult.toFixed(2) + '</span>';

    const recValue = Math.floor(refValue * keyValue); // Gets value without point values
    const remainder = (refValue * keyValue) - recValue; // Gets remainder i.e. "0.20"

    var refTotal = Math.floor(outResult); // Total refined rounded down i.e. 116.7 = 116
    var recTotal = 0; // Total reclaimed
    var scrapTotal = 0; // Total scrap
    var remainingMetal = roundScrap(remainder * 100); // Rounds to nearest "scrap" or 0.11

    while(remainingMetal > 0) {
        if(remainingMetal > 32) { // Checking for reclaimed metal
            recTotal++; // Adds a "reclaimed" to the total
            remainingMetal = remainingMetal - 33; // Removes a "reclaimed" worth from remainder
        } else if (remainingMetal > 10) { // Checking for remaining scrap metal 
            scrapTotal++; // Adds a "scrap" to the total
            remainingMetal = remainingMetal - 11;
        }
    }
    if (recTotal == 3) { // Reseting if 3 reclaimed exist - equaling 1 refined
        recTotal = 0;
    }
    if (scrapTotal == 3) { // Reseting if 3 scrap exist - equaling 1 reclaimed
        scrapTotal = 0;
    }
    // Outputting calculated values to display
    metal.innerHTML = 'Refined: <span class="highlight">' + refTotal + ' </span>' +
    ' Reclaimed: <span class="highlight">' + recTotal + ' </span>' +
    ' Scrap: <span class="highlight">' + scrapTotal + ' </span>';
}
// Function to round to nearest multiple of 11
function roundScrap(value) {
    const nearestEleven = Math.round(value / 11) * 11; 
    return nearestEleven;
}
// Change team logic - remembers last used team
document.addEventListener('DOMContentLoaded', function() {
    // Get toggle state when extension is opened
    chrome.storage.sync.get('changeTeam', function(team) {
        teamToggle.checked = team.changeTeam || false;
        updateTeam(teamToggle.checked); // Sets default color to blue
    });
    teamToggle.addEventListener('change', function() {
        updateTeam(teamToggle.checked); // Updates toggle and changes team color
        chrome.storage.sync.set({'changeTeam': teamToggle.checked}); // Updates toggle state
    });
    function updateTeam(toggle) {
        if (toggle) { // Changes background color via toggle
            document.body.style.backgroundColor = '#B8383B'; // Red
        } else {
            document.body.style.backgroundColor = '#5885A2'; // Blue
        }
    }
});
// Event listener for Calculate button
calc.addEventListener('click', updateValue);
// Event listener to calculate when enter is pressed
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        updateValue();
    }
});
