document.addEventListener("DOMContentLoaded", () => {

  const doggyBar = document.getElementById("dog-bar")
  const doggyDisplay = document.getElementById("dog-info")
  const doggyUrl = "http://localhost:3000/pups"
  const goodDogFilter = document.getElementById("good-dog-filter")

  goodDogFilter.addEventListener("click", event => toggleDogFilter(event))

  function toggleDogFilter(event) {
    if (event.target.innerText === "Filter good dogs: OFF") {
      event.target.innerText = "Filter good dogs: ON"
      fetch(doggyUrl).then(res => res.json()).then(data => filterDoggyBar(data))
    } else {
      event.target.innerText = "Filter good dogs: OFF"
      fetch(doggyUrl).then(res => res.json()).then(data => setDoggyBar(data))
    }
  }

  function filterDoggyBar(data) {
    data = data.filter(dog => dog.isGoodDog === true)
    setDoggyBar(data)
    }

  function setDoggyBar(data) {
    doggyBar.innerHTML = ""
    data.forEach(dog => {
      const div = document.createElement("div")
      const span = document.createElement("span")
      span.id = dog.id
      span.className = "dogs"
      span.innerText = dog.name
      div.appendChild(span)
      doggyBar.appendChild(div)
    })
  }

  doggyBar.addEventListener("click", event => {
    if (event.target.tagName === "SPAN") {
      fetchDoggy(event)
    }
  })

  function fetchDoggy(event) {
    const doggyId = event.target.id;
    fetch(`${doggyUrl}/${doggyId}`).then(res => res.json()).then(data => displayDoggy(data))
  }

  function displayDoggy(data) {
    doggyDisplay.innerHTML = ""
    const div = document.createElement("div")
    div.innerHTML = `<img src=${data.image}> <h2>${data.name}</h2>`
    const button = document.createElement("button")
    button.id = data.id
    data.isGoodDog === true ? button.innerText = "Good Dog!" :
    button.innerText = "Bad Dog!"
    div.appendChild(button)
    doggyDisplay.appendChild(div)
  }

  doggyDisplay.addEventListener("click", event => {
    if (event.target.tagName === "BUTTON") {
      patchDoggy(event)
    }
  })

  function patchDoggy(event) {
    const doggyId = event.target.id;
    const setToTrue = {
    	method:"PATCH",
    	headers:{'Content-Type':'application/json'},
    	body:JSON.stringify({isGoodDog: true})
    }
    const setToFalse = {
    	method:"PATCH",
    	headers:{'Content-Type':'application/json'},
    	body:JSON.stringify({isGoodDog: false})
    }
    if (event.target.innerText === "Good Dog!") {
      fetch(`${doggyUrl}/${doggyId}`, setToFalse).then(res => res.json()).then(toggleGoodAndBad(event))
    } else {
      fetch(`${doggyUrl}/${doggyId}`, setToTrue).then(res => res.json()).then(toggleGoodAndBad(event))
    }
  }

  function toggleGoodAndBad(event) {
    event.target.innerText === "Good Dog!" ? event.target.innerText = "Bad Dog!" : event.target.innerText = "Good Dog!"
  }

})
