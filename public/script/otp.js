function updateurl() {
  const otpfield = document.getElementById("otp")
  const userfield = document.getElementById("user")
  const link = document.getElementById("login")
  const url = new URL(link.getAttribute("href"));
  url.searchParams.set('otp', otpfield.value);
  url.searchParams.set('username', userfield.value);
  link.setAttribute("href", url.toString())
}

document.addEventListener("DOMContentLoaded", function(){
  const otpfield = document.getElementById("otp")
  const userfield = document.getElementById("user")
  otpfield.addEventListener('input', updateurl)
  userfield.addEventListener('input', updateurl)
});
