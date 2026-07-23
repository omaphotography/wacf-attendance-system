// ==========================================
// WACF BIRTHDAY SYSTEM
// ==========================================


const birthdaySearch = document.getElementById("birthdaySearch");

const birthdayTable = document.getElementById("birthdayTable");

const todayBirthday = document.getElementById("todayBirthday");


let allMembers = [];




// ==========================================
// LOAD PAGE
// ==========================================

document.addEventListener(
"DOMContentLoaded",
()=>{

    loadBirthdays();

});





// ==========================================
// LOAD BIRTHDAYS
// ==========================================

async function loadBirthdays(){


    birthdayTable.innerHTML = `

    <tr>

        <td colspan="7" class="text-center p-8">

            Loading birthdays...

        </td>

    </tr>

    `;



    const {data,error}=

    await window.supabaseClient

    .from("members")

    .select(`

        member_no,

        full_name,

        birth_day,

        birth_month,

        department,

        level,

        phone1

    `)

    .not(
        "birth_day",
        "is",
        null
    );





    if(error){

        console.log(error);


        birthdayTable.innerHTML=`

        <tr>

        <td colspan="7" class="text-center p-8 text-red-600">

        Unable to load birthdays

        </td>

        </tr>

        `;


        return;

    }




    allMembers=data || [];



    allMembers.sort((a,b)=>{

        return daysUntilBirthday(a)
        -
        daysUntilBirthday(b);

    });




    displayTodayBirthday();


    displayUpcomingBirthdays(
        allMembers
    );



}






// ==========================================
// TODAY BIRTHDAY
// ==========================================

function displayTodayBirthday(){



    const today=new Date();



    const day=today.getDate();


    const month=today.getMonth()+1;




    const birthdayMembers =

    allMembers.filter(member=>{


        return (

            Number(member.birth_day)===day

            &&

            Number(member.birth_month)===month

        );


    });






    if(birthdayMembers.length===0){


        todayBirthday.innerHTML=`

        <div class="card text-center">

            <h2>🎂</h2>

            <p>

            No birthdays today.

            </p>

        </div>

        `;


        return;


    }






    todayBirthday.innerHTML="";





    birthdayMembers.forEach(member=>{


        todayBirthday.innerHTML += `


        <div class="card">


            <h2>

            🎉 ${member.full_name}

            </h2>



            <p>

            ${member.department || "-"}

            •

            ${member.level || "-"}

            </p>



            <p>

            📞 ${member.phone1 || "-"}

            </p>



            <span class="badge badge-success">

            Happy Birthday 🎂

            </span>


        </div>


        `;



    });



}






// ==========================================
// UPCOMING BIRTHDAYS
// ==========================================

function displayUpcomingBirthdays(members){



    birthdayTable.innerHTML="";




    if(members.length===0){


        birthdayTable.innerHTML=`

        <tr>

        <td colspan="7" class="text-center p-8">

        No birthday records found.

        </td>

        </tr>

        `;


        return;

    }






    members.forEach(member=>{


        birthdayTable.innerHTML += `


        <tr>


        <td>

        ${member.member_no || "-"}

        </td>



        <td>

        ${member.full_name}

        </td>



        <td>

        ${formatBirthday(member)}

        </td>



        <td>

        ${member.department || "-"}

        </td>



        <td>

        ${member.level || "-"}

        </td>



        <td>

        -

        </td>



        <td>


        <span class="badge badge-warning">

        ${daysUntilBirthday(member)} day(s)

        </span>


        </td>



        </tr>


        `;


    });


}






// ==========================================
// SEARCH
// ==========================================

if(birthdaySearch){


birthdaySearch.addEventListener(
"input",
()=>{


const keyword=

birthdaySearch.value
.toLowerCase()
.trim();




if(!keyword){


displayUpcomingBirthdays(
allMembers
);


return;


}




const filtered =

allMembers.filter(member=>{


return (

(member.full_name || "")
.toLowerCase()
.includes(keyword)


||

(member.member_no || "")
.toLowerCase()
.includes(keyword)


||

(member.department || "")
.toLowerCase()
.includes(keyword)


||

(member.phone1 || "")
.includes(keyword)


);


});




displayUpcomingBirthdays(filtered);



});


}






// ==========================================
// FORMAT BIRTHDAY
// ==========================================

function formatBirthday(member){


const months=[

"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December"

];



return (

member.birth_day

+

" "

+

months[
member.birth_month-1
]

);


}







// ==========================================
// DAYS UNTIL BIRTHDAY
// ==========================================

function daysUntilBirthday(member){


const today=new Date();


today.setHours(
0,0,0,0
);



let next = new Date(

today.getFullYear(),

member.birth_month-1,

member.birth_day

);




if(next < today){


next = new Date(

today.getFullYear()+1,

member.birth_month-1,

member.birth_day

);


}




const diff =

next.getTime()

-

today.getTime();




return Math.ceil(

diff /

(1000*60*60*24)

);


}







// ==========================================
// AUTO REFRESH
// ==========================================

setInterval(()=>{


displayTodayBirthday();


displayUpcomingBirthdays(
allMembers
);


},60000);