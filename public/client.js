//js

const form = document.getElementById("form");

form.addEventListener("submit", async e => {
  e.preventDefault();

  let formData = new FormData(form);
  let data = JSON.stringify(Object.fromEntries(formData));

  console.log(data);

  const options = {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json"
    }
  };

  // send post request
  fetch("/users", options);
});
