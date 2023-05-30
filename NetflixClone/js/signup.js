var signUpForm = document.getElementById("signUpForm");
var baseUrl = "https://students.codex.today/createAccount";

signUpForm.addEventListener("submit",async(event)=>{
    try {
        event.preventDefault();
        var formData ={
            name: signUpForm.name.value,
            email: signUpForm.email.value,
            phone: signUpForm.phone.value,
            password : signUpForm.password.value
        };

      var res = await fetch(`${baseUrl}`,{
            method:"POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(formData)
        })
     var data = await res.json();
     console.log(data);     
     window.location.reload()
    } catch (error) {
        console.log(error);
    }
})
function signIn(){
      window.location.assign("../html/signin.html");
}
window.onload = () =>{
    const token = localStorage.getItem("token");
    if(token){
        window.location.assign("../html/homepage.html");
    }
}