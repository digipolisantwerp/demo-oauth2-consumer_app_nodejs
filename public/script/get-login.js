async function postData(token) {
  try{
  const response = await fetch('/get-login-token', {
    method: "POST",
    mode: "cors",
    headers: {
      "authorization":`Bearer ${token}`,
    },
  });
  return response.json(); // parses JSON response into native JavaScript objects
  } catch(e) {
    console.log("requesttoken failed", e)
    throw e;
  }
}


document.addEventListener("DOMContentLoaded", function(){
  const access_token_field = document.getElementById("access_token")
  const url_field = document.getElementById("url")
  const result = document.getElementById("result")
  const url = url_field.value
  let access_token;
  const submit = document.getElementById("submit")
  const submitForm = () => {
    postData(access_token).then((resp) => {
      result.innerHTML = JSON.stringify(resp, null, 2);
    }).catch((e) => {
      result.innerHTML = e;
    })
  }
  access_token_field.addEventListener("keyup", (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      access_token = event.target.value
      submitForm();
    } else {
      access_token = event.target.value
    }
  });
  submit.addEventListener("click", (event) => submitForm());
});
