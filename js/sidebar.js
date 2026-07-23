const menuBtn =
document.getElementById("menuBtn");


const sidebar =
document.getElementById("sidebar");


const overlay =
document.getElementById("overlay");



if(menuBtn){


menuBtn.addEventListener("click",()=>{


sidebar.classList.toggle("active");


overlay.classList.toggle("hidden");


});


}



if(overlay){


overlay.addEventListener("click",()=>{


sidebar.classList.remove("active");


overlay.classList.add("hidden");


});


}