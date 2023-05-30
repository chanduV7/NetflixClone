let signInForm = document.getElementById("signInForm");
const baseUrl ="https://students.codex.today/login";
const getUsersUrl = "https://students.codex.today/getUsers"

signInForm.addEventListener("submit", async(event)=>{
    try {
        event.preventDefault();
        const formData ={
            email: signInForm.email.value,
            password: signInForm.password.value 
        }

        const res = await fetch(`${baseUrl}`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        const data = await res.json();
        console.log(data);
        const keys = Object.keys(data)
        console.log(keys)
        keys.forEach((e) => localStorage.setItem(e,data[e]))
        window.location.reload()
    } catch (error) {
        console.log(error)
    }
})
function signUp(){
    window.location.assign("../html/signup.html");
}

window.onload = () =>{
    const token = localStorage.getItem("token");
    if(token){
        window.location.assign("../html/homePage.html");
    }
}