const rateToUSD = {
  usd: 1.00,
  byn: 3.2347,
  eur: 0.9262,
  rub: 90.4053,
  cny: 7.4165,
}

const fakeRatesData = generateFakeRatesData()

function generateFakeRatesData() {
  function subtractDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  function randomiseValueWithDeviation(baseValue) {
    const deviation = baseValue * (10 / 100);
    const minValue = baseValue - deviation;
    const maxValue = baseValue + deviation;
    return Math.random() * (maxValue - minValue) + minValue;
  }

  function randomiseInitRate(initRate) {
    const entries = Object.entries(initRate).map((el) => {
      if (el[0] !== 'usd') {
        el[1] = randomiseValueWithDeviation(el[1])
      }
      return el
    })

    return Object.fromEntries(entries)
  }

  const currentDate = getCurrentDate()
  const availableDates = Array.from({length: 13}).map((element, index) => {
    const date = subtractDays(currentDate, index + 1);
    return normalizeDate(date)
  })

  const result = availableDates.map(element => [element, randomiseInitRate(rateToUSD)])
  result.unshift([currentDate, rateToUSD])

  return Object.fromEntries(result)
}


function formatingNumber(num) {
  let res = Number(num * 100)
  res = Math.round(res)
  return res / 100
}

function renderLabels() {
  const shortedCurrencyList = Object.entries(rateToUSD).filter(el => el[0] !== select.value.toLowerCase())

  const labels = document.querySelector(".labels")

  labels.innerHTML = shortedCurrencyList.map((el) => {
    return `<label class="label">${el[0].toUpperCase()}</label>`
  }).join(' ')

}

function renderValues(array) {
  const values = document.querySelector('.values');
  if (array) {
    values.innerHTML = array.map((value) => {
      return `<div class="value">${value}</div>`
    }).join(' ')
  } else {
    values.innerHTML = ''
  }

}

function convert(currency, value) {
  const res = Object
    .entries(rateToUSD).filter(el => el[0] !== select.value.toLowerCase())
    .map(el => {
      return formatingNumber(rateToUSD[el[0].toLowerCase()] / rateToUSD[currency.toLowerCase()] * value)
    })

  console.log(res);
  return res
}

function countSubstrOccurrences(str, substr) {
  return str.split(substr).length - 1;
}

const select = document.querySelector(".select");
const input = document.querySelector(".converter__input")
const btnConvert = document.querySelector(".button_convert")

// select handle
select.addEventListener("change", () => {
  renderLabels()
  renderValues(convert(select.value, inputValue))
});

// validate input
let inputValue = null
input.addEventListener('input', () => {
  if (input.value[input.value.length - 1] === ',') {
    input.value = input.value.slice(0, -1) + '.'
  }

  if (Number.isNaN(+input.value[input.value.length - 1])
    && input.value[input.value.length - 1] !== '.') {
    input.value = input.value.slice(0, -1)
  }

  if (input.value[input.value.length - 1] === '.') {
    if (countSubstrOccurrences(input.value, '.') > 1) input.value = input.value.slice(0, -1)
  }

  inputValue = input.value
})

input.addEventListener('keydown', (event) => {
  if (event.key === ' ') event.preventDefault()
});

//click btn handle
btnConvert.addEventListener("click", () => {
  if (!inputValue) {
    inputValue = 0
    input.value = '0'
  }

  renderValues(convert(select.value, inputValue))
});

function normalizeDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return [year, month, day].join('-')
}

function getCurrentDate() {
  const currentDate = new Date()
  return normalizeDate(currentDate)
}

function isDateGreaterThanDate(strDateA, strDateB) {
  const dateA = new Date(strDateA)
  const dateB = new Date(strDateB)
  return (dateA > dateB)
}

function renderRateViewer(dateStr) {
  const rateViewerLabels = document.querySelector('.rate-viewer__labels')
  const rateViewerValues = document.querySelector('.rate-viewer__values')
  const lastAvailableDate = Object.keys(fakeRatesData).sort((a, b) => (isDateGreaterThanDate(a, b) ? 1 : -1))[0]
  const rate = fakeRatesData.hasOwnProperty(dateStr)
    ? fakeRatesData[dateStr]
    : fakeRatesData[lastAvailableDate]

  rateViewerLabels.innerHTML = Object.entries(rate)
    .map((el) => {
      return `<label class="rate-viewer__label">${el[0].toUpperCase()}</label>`
    }).join(' ')

  rateViewerValues.innerHTML = Object.entries(rate)
    .map((el) => {
      return `<div class="rate-viewer__value">${formatingNumber(el[1])}</div>`
    }).join(' ')
}

// datepicker
const datepicker = document.querySelector('.datepicker')
const currentDate = getCurrentDate()
datepicker.value = currentDate
renderRateViewer(currentDate)

datepicker.addEventListener('change', function (event) {
  const selectedDateValue = event.target.value;
  if (isDateGreaterThanDate(currentDate, selectedDateValue)
    || currentDate === selectedDateValue) {
    deleteNote()
    renderRateViewer(selectedDateValue)
  } else {
    renderNote()
  }
});

function renderNote() {
  const rateViewer = document.querySelector('.rate-viewer')
  rateViewer.innerHTML = rateViewer.innerHTML
    + `<div class="rate-viewer__note">
         <h3>We cannot know the future</h3>
         <p>Please choose a different date</p>
       </div>`
}

function deleteNote() {
  const rateViewer = document.querySelector('.rate-viewer__note')
  console.log(rateViewer)
}


// invokes
renderLabels()



