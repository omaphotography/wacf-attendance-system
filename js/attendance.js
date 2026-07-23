// ==========================================
// WACF ATTENDANCE PAGE
// ==========================================


const searchInput =
document.getElementById("searchInput");


const memberCard =
document.getElementById("memberCard");


const notFound =
document.getElementById("notFound");



let selectedMember = null;



// ==========================================
// SEARCH MEMBERS
// ==========================================


if(searchInput){


searchInput.addEventListener(
"input",
async()=>{


const keyword =
searchInput.value.trim();



if(keyword.length < 2){


memberCard.classList.add("hidden");

notFound.classList.add("hidden");

selectedMember=null;


return;


}




memberCard.classList.remove("hidden");



memberCard.innerHTML=`

<div class="text-center p-5">

<i class="fas fa-spinner fa-spin text-red-700 text-3xl"></i>

<p>Searching...</p>

</div>

`;





const searchValue =
`%${keyword}%`;





const {data,error}=


await window.supabaseClient


.from("members")


.select("*")


.or(

`full_name.ilike.${searchValue},member_no.ilike.${searchValue},phone1.ilike.${searchValue},phone2.ilike.${searchValue},department.ilike.${searchValue},level.ilike.${searchValue}`

)


.order("full_name");





if(error){


console.log(error);


memberCard.innerHTML=

`
<p class="text-red-600">
Search error
</p>
`;

return;


}





if(!data || data.length===0){


memberCard.classList.add("hidden");


notFound.classList.remove("hidden");


return;


}



showSearchResults(data);



});


}




// ==========================================
// SHOW SEARCH RESULTS
// ==========================================


function showSearchResults(members){



memberCard.classList.remove("hidden");


notFound.classList.add("hidden");



memberCard.innerHTML=`

<h2 class="font-bold text-xl mb-4">

Select Member

</h2>


<div id="memberResults"></div>


`;



const box =
document.getElementById("memberResults");





members.forEach(member=>{


const item =
document.createElement("div");



item.className=
"search-item";



item.innerHTML=`

<h4>

${member.full_name}

</h4>


<p>

${member.member_no || "-"}

</p>


<p>

${member.department || "-"} |

${member.level || "-"}

</p>


<p>

${member.phone1 || "-"}

</p>


`;





item.onclick=()=>{


selectedMember=member;


showMember(member);



};



box.appendChild(item);



});



}




// ==========================================
// SHOW MEMBER DETAILS
// ==========================================


async function showMember(member){



memberCard.classList.remove("hidden");



memberCard.innerHTML=`

<div class="grid-2">


<div>

<label>Name</label>

<h2>

${member.full_name}

</h2>

</div>



<div>

<label>Member No</label>

<h2>

${member.member_no}

</h2>

</div>



<div>

<label>Department</label>

<h2>

${member.department || "-"}

</h2>

</div>



<div>

<label>Level</label>

<h2>

${member.level || "-"}

</h2>

</div>



<div>

<label>Phone</label>

<h2>

${member.phone1 || "-"}

</h2>

</div>


</div>



<button

id="markBtn"

class="btn btn-green"

style="margin-top:20px;">

<i class="fas fa-check"></i>

Mark Attendance

</button>



<p id="status"></p>


`;





const markBtn =
document.getElementById("markBtn");


const status =
document.getElementById("status");




// ==========================================
// CHECK EXISTING ATTENDANCE
// ==========================================


const marked =
await attendanceMarked(member.id);




if(marked){


markBtn.disabled=true;


markBtn.classList.remove(
"btn-green"
);


markBtn.classList.add(
"btn-blue"
);



markBtn.innerHTML=`

<i class="fas fa-circle-check"></i>

Attendance Marked

`;



status.innerHTML=

`
<span class="blue">
Attendance already recorded today
</span>
`;



return;


}




// ==========================================
// MARK ATTENDANCE
// ==========================================


markBtn.onclick=
async()=>{


markBtn.disabled=true;



markBtn.innerHTML=`

<i class="fas fa-spinner fa-spin"></i>

Saving...

`;




const result =

await markAttendance(member);





status.innerHTML=result.message;





if(result.success){


markBtn.innerHTML=`

<i class="fas fa-circle-check"></i>

Attendance Marked

`;



markBtn.classList.remove(
"btn-green"
);



markBtn.classList.add(
"btn-blue"
);



}

else{


markBtn.disabled=false;


markBtn.innerHTML=`

<i class="fas fa-check"></i>

Mark Attendance

`;



}



};



}