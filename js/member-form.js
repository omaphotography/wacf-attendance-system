// ==========================================
// WACF MEMBER FORM
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const modal = document.getElementById("memberModal");

const addMemberBtn = document.getElementById("addMemberBtn");

const closeModal = document.getElementById("closeModal");

const memberForm = document.getElementById("memberForm");




// ==========================================
// OPEN MODAL
// ==========================================

if(addMemberBtn){

    addMemberBtn.onclick = ()=>{

        modal.classList.remove("hidden");

    };

}




// ==========================================
// CLOSE MODAL
// ==========================================

if(closeModal){

    closeModal.onclick = ()=>{

        modal.classList.add("hidden");

    };

}





// ==========================================
// CLICK OUTSIDE CLOSE
// ==========================================

if(modal){

    modal.onclick = (e)=>{

        if(e.target === modal){

            modal.classList.add("hidden");

        }

    };

}





// ==========================================
// SAVE MEMBER
// ==========================================

if(memberForm){


memberForm.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const btn =
memberForm.querySelector(
"button[type='submit']"
);



btn.disabled = true;



btn.innerHTML = `

<i class="fas fa-spinner fa-spin"></i>

Saving...

`;



try{


// ==========================================
// GET VALUES
// ==========================================


const fullName =
document.getElementById("fullName")
.value
.trim();



const birthDay =
document.getElementById("birthDay")
.value
.trim();



const birthMonth =
document.getElementById("birthMonth")
.value
.trim();



const address =
document.getElementById("address")
.value
.trim();



const department =
document.getElementById("department")
.value
.trim();



const level =
document.getElementById("level")
.value;



const phone1 =
document.getElementById("phone1")
.value
.trim();



const phone2 =
document.getElementById("phone2")
.value
.trim();






// ==========================================
// VALIDATION
// ==========================================


if(!fullName){

    alert(
        "Full name is required"
    );

    return;

}



if(!phone1){

    alert(
        "Phone number is required"
    );

    return;

}






// ==========================================
// CHECK DUPLICATE PHONE
// ==========================================


const {

data:existing,

error:duplicateError

}

=

await window.supabaseClient

.from("members")

.select("id")

.or(

`phone1.eq.${phone1},phone2.eq.${phone1}`

);






if(duplicateError){


    console.log(
        duplicateError
    );


    alert(
        duplicateError.message
    );


    return;


}






if(existing && existing.length > 0){


    alert(
        "This phone number already exists"
    );


    return;


}







// ==========================================
// CREATE MEMBER OBJECT
// ==========================================


const member = {


    member_no:
    await generateMemberNumber(),



    full_name:
    fullName,



    birth_day:
    birthDay
    ?
    Number(birthDay)
    :
    null,



    birth_month:
    birthMonth
    ?
    Number(birthMonth)
    :
    null,



    address:
    address,



    department:
    department,



    level:
    level,



    phone1:
    phone1,



    phone2:
    phone2 || null


};






console.log(
    "Saving member:",
    member
);







// ==========================================
// SAVE MEMBER
// ==========================================


const savedMember =

await addMember(member);






if(!savedMember){


    alert(
        "Member registration failed"
    );


    return;


}







console.log(
    "Saved member:",
    savedMember
);






// ==========================================
// AUTO MARK PRESENT TODAY
// ==========================================


const attendanceResult =

await markAttendance(savedMember);






console.log(
    "Attendance:",
    attendanceResult
);








if(!attendanceResult.success){


    console.log(
        attendanceResult.message
    );


}








// ==========================================
// SUCCESS
// ==========================================


alert(

"Member registered successfully and marked present today"

);





memberForm.reset();



modal.classList.add("hidden");






// Refresh member list

if(typeof loadMembers === "function"){

    await loadMembers();

}





}



catch(error){


console.error(
    "Save error:",
    error
);



alert(
    error.message
);



}




finally{


btn.disabled = false;



btn.innerHTML = `

<i class="fas fa-user-plus"></i>

Save Member

`;



}



});


}