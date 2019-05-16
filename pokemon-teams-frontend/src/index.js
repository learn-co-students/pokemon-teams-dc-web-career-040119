const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener('DOMContentLoaded', () => {
    getTrainers()
})

const getTrainers = () => {
    fetch(TRAINERS_URL)
        .then(response => response.json())
        .then((trainers) => trainers.forEach(renderTrainer))
}

const renderTrainer = trainer => {
    const main = document.querySelector('main')

    const card = document.createElement('div')
    card.classList.add('card')
    card.dataset.id = trainer.id
    main.appendChild(card)

    const name = document.createElement('p')
    name.innerText = trainer.name
    card.appendChild(name)

    const addPokemonButton = document.createElement('button')
    addPokemonButton.innerText = 'Add Pokemon'
    addPokemonButton.addEventListener("click", catchPokemon)
    card.appendChild(addPokemonButton)

    const pokemonList = document.createElement("ul")
    card.appendChild(pokemonList)

    trainer.pokemons.forEach(renderPokemon)
}

const catchPokemon = (e) => {
    if (e.target.nextElementSibling.childElementCount < 6) {
        trainerId = e.target.parentElement.dataset.id
        fetch(POKEMONS_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                trainer_id: trainerId
            })
        })
            .then(response => response.json())
            .then(renderPokemon)
    } else {
        alert("Trainer cannot have more than 6 Pokemon!")
    }
}

const renderPokemon = pokemon => {
    const pokemonList = document.querySelector(`.card[data-id="${pokemon.trainer_id}"] ul`)

    const pokemonElement = document.createElement('li')
    pokemonElement.innerText = `${pokemon.nickname} (${pokemon.species})`
    pokemonList.appendChild(pokemonElement)

    const release = document.createElement('button')
    release.innerText = 'Release'
    release.classList.add('release')
    release.dataset.pokemonId = pokemon.id
    release.addEventListener('click', releasePokemon)
    pokemonElement.appendChild(release)
}

const releasePokemon = (e) => {
    const pokemonId = e.target.dataset.pokemonId

    fetch(`${POKEMONS_URL}/${pokemonId}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            id: pokemonId,
        })
    })
        .then(response => response.json())
        .then(object => {
            document.querySelector(`[data-pokemon-id="${object.id}"]`).parentElement.remove()
        })
}