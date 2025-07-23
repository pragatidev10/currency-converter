// BASE URL for the currency API
const BASE_URL = "https://api.currencyapi.com/v3/latest?apikey=cur_live_304b6XZYyTAIt0cf4LaPJ1WmUxGUNqUofzZJrgZX";


// Get DOM elements
const dropdowns = document.querySelectorAll("select");
const btn = document.querySelector("#btn");
const fromCurr = document.querySelector('select[name="from"]');
const toCurr = document.querySelector('select[name="to"]');
const convertedAmt = document.querySelector("#converted-amount");
const swapBtn = document.querySelector("#swap-btn");

// Populate both dropdowns with currency options
dropdowns.forEach(select => {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    // Set default selected options
    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.appendChild(option);
  }

  // Update flag when currency is changed
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
});

// Function to update flag based on selected currency
function updateFlag(selectElement) {
  const currencyCode = selectElement.value;
  const countryCode = countryList[currencyCode];
  const img = selectElement.parentElement.querySelector("img");

  if (img && countryCode) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
}

// Handle exchange rate fetch and conversion
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  const amountInput = document.querySelector("#amount");
  let amountValue = parseFloat(amountInput.value);

  if (isNaN(amountValue) || amountValue <= 0) {
    amountValue = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  const url = `${BASE_URL}&base_currency=${from}&currencies=${to}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("API Response:", data);

    if (!data.data || !data.data[to] || !data.data[to].value) {
      throw new Error("Exchange rate not available.");
    }

    const rate = data.data[to].value;
    const result = (amountValue * rate).toFixed(2);
    convertedAmt.value = result;

    console.log(`${amountValue} ${from} = ${result} ${to}`);
  } catch (error) {
    console.error("Failed to fetch exchange rate:", error.message);
    convertedAmt.value = "Error";
  }
});

// Swap the selected currencies and update flags
swapBtn.addEventListener("click", () => {
  const temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);

  btn.click(); // Recalculate with new selection
});
