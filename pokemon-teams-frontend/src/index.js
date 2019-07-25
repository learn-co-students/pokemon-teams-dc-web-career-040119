const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const main = document.querySelector('main')

document.addEventListener('DOMContentLoaded', function(){

  fetchTrainerData()

})

function fetchTrainerData(){
  fetch(TRAINERS_URL)
  .then(resp => resp.json())
  .then(trainer => trainer.forEach(displayTrainerData))
}

function displayTrainerData(trainer){
  //create div + div attributes
  let trainer_div = document.createElement('div')
  trainer_div.className = 'card'
  trainer_div.id = `trainer-${trainer.id}`

  //create trainer tag / value
  let trainer_name = document.createElement('p')
  trainer_name.innerText = trainer.name

  //add pokemon button
  //create list
  let unordered = document.createElement('ul')
  unordered.id = `ul-${trainer.id}`
  trainer.pokemons.forEach(element =>
  {
    let list = document.createElement('li')
    list.id = `pokemon-${element.id}`
    let release_poke = document.createElement('button')
    release_poke.className = 'release'
    release_poke.id = element.id
    release_poke.innerText = "Release"
    release_poke.addEventListener('click', releasePokemon)
    list.innerText = `${element.nickname} (${element.species})`
    list.appendChild(release_poke)
    unordered.appendChild(list)
  })


  let add_poke = document.createElement('button')
  add_poke.id = trainer.id
  add_poke.innerText = 'Add Pokemon'
  add_poke.addEventListener('click', addPokemon)

  //appends all relevant itemsand
  trainer_name.appendChild(unordered)
  trainer_div.append(trainer_name, add_poke)
  main.append(trainer_div)
}

function addPokemon(e){
  e.preventDefault()
  let button_id = e.currentTarget
  let find_ul = document.getElementById(`ul-${button_id.id}`).childElementCount
  if (find_ul < 6){
  fetch(POKEMONS_URL,
  { method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      "trainer_id": button_id.id
    })
  })
  .then(resp => resp.json())
  .then(pokemon => createPokemonList(pokemon))
  }
  else{
    alert('You have a full team!')
  }
}

function createPokemonList(element){
  let id = element.trainer_id
  let pokemon_list = document.getElementById(`ul-${id}`)
  let list = document.createElement('li')
  list.id = `pokemon-${element.id}`
  let release_poke = document.createElement('button')
  release_poke.className = 'release'
  release_poke.id = element.id
  release_poke.innerText = "Release"
  release_poke.addEventListener('click', releasePokemon)
  list.innerText = `${element.nickname} (${element.species})`
  list.appendChild(release_poke)
  pokemon_list.appendChild(list)
}

function releasePokemon(e){
  let button_id = e.currentTarget
  fetch(`http://localhost:3000/pokemons/${button_id.id}`, {
    method: 'delete',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
  .then(resp => resp.json())
  .then(pokemon => {document.getElementById(`pokemon-${button_id.id}`).remove()}
  )
}
