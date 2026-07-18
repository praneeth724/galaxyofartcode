
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "" || pass === "") {
        document.getElementById("error").innerText = "Please enter valid username and password..!";
    } else {
        document.getElementById("error").innerText = "";
        alert("Login Successful..!");
        // redirect example:
         window.location.href = "dashboard.html";
    }
}

function resetPassword() {
    let email = document.getElementById("email").value;

    if (email === "") {
        document.getElementById("msg").innerText = "Enter your email..!";
    } else {
        document.getElementById("msg").innerText = "Reset link sent to your email..!";
    }
}


// function login() {
//     let user = document.getElementById("username").value;
//     let pass = document.getElementById("password").value;

//     if(user === "" || pass === "") {
//         document.getElementById("error").innerText = "Please enter username and password!";
//     } else {
//         document.getElementById("error").innerText = "";

//         // ✅ Fake validation (you can connect backend later)
//         if(user === "admin" && pass === "1234") {
//             // 🔥 Redirect to dashboard
//             window.location.href = "dashboard.html";
//         } else {
//             document.getElementById("error").innerText = "Invalid login!";
//         }
//     }
// }
