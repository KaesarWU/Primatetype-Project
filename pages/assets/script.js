function nav(){
    fetch('/assets/nav.html')
    .then(res => res.text())
    .then(text => {
        document.getElementById("nav").innerHTML = text;
    })
}