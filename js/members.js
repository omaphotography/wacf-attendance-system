// ==========================================
// WACF MEMBERS PAGE
// ==========================================


let allMembers = [];

let filteredMembers = [];

let currentPage = 1;

const rowsPerPage = 10;



document.addEventListener("DOMContentLoaded",()=>{

    loadMembers();

});




// ==========================================
// LOAD MEMBERS
// ==========================================

async function loadMembers(){


    allMembers = await getMembers();


    filteredMembers = [...allMembers];


    updateStatistics();


    displayMembers();


}




// ==========================================
// STATISTICS
// ==========================================

function updateStatistics(){


    document.getElementById("totalMembers").textContent =
    allMembers.length;


    document.getElementById("birthdayMonth").textContent =

    allMembers.filter(member=>{

        return member.birth_month ==
        new Date().getMonth()+1;

    }).length;



}



// ==========================================
// DISPLAY TABLE
// ==========================================

function displayMembers(){


const table =
document.getElementById("memberTable");


table.innerHTML="";


const start =
(currentPage-1)*rowsPerPage;


const data =
filteredMembers.slice(
start,
start+rowsPerPage
);



if(data.length===0){

table.innerHTML=`

<tr>
<td colspan="6" class="text-center p-10">

No members found

</td>
</tr>

`;

return;

}




data.forEach(member=>{


table.innerHTML += `


<tr>


<td>${member.member_no}</td>


<td>${member.full_name}</td>


<td>${member.department || "-"}</td>


<td>${member.level || "-"}</td>


<td>${member.phone1 || "-"}</td>


<td>

<button 
class="btn btn-red deleteBtn"
data-id="${member.id}">

Delete

</button>


</td>


</tr>


`;

});


updatePagination();


}




// ==========================================
// SEARCH
// ==========================================


document
.getElementById("searchInput")
.addEventListener("input",async(e)=>{


const keyword =
e.target.value.toLowerCase();



filteredMembers =
allMembers.filter(member=>{


return (

member.full_name.toLowerCase()
.includes(keyword)

||

(member.phone1 || "")
.includes(keyword)

||

(member.member_no || "")
.toLowerCase()
.includes(keyword)


);


});



currentPage=1;


displayMembers();



});




// ==========================================
// PAGINATION
// ==========================================


function updatePagination(){


let pages =
Math.ceil(
filteredMembers.length /
rowsPerPage
)||1;



document.getElementById("pageInfo")
.textContent =
`Page ${currentPage} of ${pages}`;


}





document
.getElementById("nextPage")
.onclick=()=>{


let pages =
Math.ceil(
filteredMembers.length/
rowsPerPage
);


if(currentPage < pages){

currentPage++;

displayMembers();

}


};





document
.getElementById("prevPage")
.onclick=()=>{


if(currentPage>1){

currentPage--;

displayMembers();

}


};