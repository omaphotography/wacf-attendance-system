// ==========================================
// MEMBER ACTIONS
// ==========================================


document.addEventListener(
"click",
async(e)=>{


if(
e.target.classList.contains("deleteBtn")
){


let id =
e.target.dataset.id;



if(confirm(
"Delete this member?"
)){


await deleteMember(id);


loadMembers();


}


}



});