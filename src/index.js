const url = "http://localhost:3000/toys";

let addToy = false;
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

// Grab toys collection from database and renders on DOM
fetch(url)
  .then(response => response.json())
  .then(toys => toys.forEach(toy => {
    addToCollection(toy);

    // Like Button Event
    like(toy);
  }))

function addToCollection(toy) {
  const newCard = document.createElement("div");
  newCard.classList.add("card");

  const {name, image, likes} = toy;

  const header = document.createElement("h2");
  header.textContent = name;
  const toyImage = document.createElement("img");
  toyImage.src = image;
  toyImage.classList.add("toy-avatar");
  const toyLikes = document.createElement("p");
  toyLikes.textContent = likes;
  const likeButton = document.createElement("button");
  likeButton.classList.add("like-btn");
  likeButton.id = "toy_id";
  likeButton.textContent = "Like ❤️";

  likeButton.addEventListener("click", () => {
    toyLikes.textContent++;
    like(toy);
  })

  newCard.append(header, toyImage, toyLikes, likeButton);
  document.querySelector("#toy-collection").appendChild(newCard);
}

// Post new toy to database and display on DOM
const form = document.querySelector(".add-toy-form")
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Post to Database
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "name": e.target.name.value,
      "image": e.target.image.value,
      "likes": 0
    })
  })
    .then(response => response.json())
    .then(newToy => addToCollection(newToy))
    .catch(() => {
      alert("Cannot Add Toy :(");
    })
})

function like(toy) {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": toy.likes + 1
      })
    })
}