function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);

    // Send token to backend for verification
    fetch("https://r0rvz7pf-3000.inc1.devtunnels.ms/api/auth/google/callback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${response.credential}`
        },
        credentials: "include",
    })
    .then(res => res.json())
    .then(data => {
        console.log("Login Success:", data);
        alert("Login Successful!");
        localStorage.setItem("user", JSON.stringify(data));
    })
    .catch(error => {
        console.error("Login Failed:", error);
        alert("Login Failed!");
    });
}

function logout() {
    localStorage.removeItem("user");
    alert("Logged out successfully!");
}
