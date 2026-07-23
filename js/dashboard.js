// ==========================================
// WACF DASHBOARD
// ==========================================


// ==========================================
// START DASHBOARD
// ==========================================

document.addEventListener(
"DOMContentLoaded",
()=>{

    loadDashboard();


    // Auto refresh every minute

    setInterval(
        loadDashboard,
        60000
    );


});





// ==========================================
// ATTENDANCE DATE (TODAY)
// ==========================================

function attendanceDate(){


    const date = new Date();


    return date.getFullYear()
    + "-"
    + String(date.getMonth()+1).padStart(2,"0")
    + "-"
    + String(date.getDate()).padStart(2,"0");


}







// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard(){


    await Promise.all([

        loadStatistics(),

        loadBirthdays(),

        loadRecentMembers()

    ]);


}







// ==========================================
// STATISTICS
// ==========================================

async function loadStatistics(){



    // TOTAL MEMBERS

    const {count:total,error:memberError}=

    await window.supabaseClient

    .from("members")

    .select("*",{

        count:"exact",

        head:true

    });






    // PRESENT TODAY

    const {count:present,error:attendanceError}=

    await window.supabaseClient

    .from("attendance")

    .select("*",{

        count:"exact",

        head:true

    })

    .eq(

        "attendance_date",

        attendanceDate()

    );







    if(memberError || attendanceError){


        console.log(
            memberError || attendanceError
        );


        return;


    }







    const totalMembers =
    total || 0;



    const presentMembers =
    present || 0;



    const absentMembers =

    Math.max(
        totalMembers - presentMembers,
        0
    );








    const totalBox =
    document.getElementById(
        "totalMembers"
    );


    const presentBox =
    document.getElementById(
        "presentToday"
    );


    const absentBox =
    document.getElementById(
        "absentToday"
    );





    if(totalBox){

        totalBox.textContent =
        totalMembers;

    }




    if(presentBox){

        presentBox.textContent =
        presentMembers;

    }




    if(absentBox){

        absentBox.textContent =
        absentMembers;

    }



}









// ==========================================
// BIRTHDAYS TODAY
// ==========================================

async function loadBirthdays(){



    const now =
    new Date();



    const day =
    now.getDate();



    const month =
    now.getMonth()+1;






    const {data,error}=

    await window.supabaseClient

    .from("members")

    .select("*");






    if(error){


        console.log(error);


        return;


    }







    const birthdays =

    data.filter(member=>{


        return (

            Number(member.birth_day)
            === day

            &&

            Number(member.birth_month)
            === month

        );


    });









    const birthdayCount =

    document.getElementById(
        "birthdayToday"
    );



    if(birthdayCount){


        birthdayCount.textContent =
        birthdays.length;


    }








    const badge =

    document.getElementById(
        "birthdayBadge"
    );



    if(badge){


        badge.textContent =
        birthdays.length;


    }








    const list =

    document.getElementById(
        "birthdayList"
    );





    if(!list)

        return;







    list.innerHTML="";







    if(birthdays.length===0){


        list.innerHTML=`

        <div class="p-6 text-center text-gray-500">

        🎂 No birthdays today.

        </div>

        `;


        return;


    }









    birthdays.forEach(member=>{


        list.innerHTML +=`


        <div 
        class="flex justify-between items-center p-5 border-b">


            <div>


                <h3 class="font-bold">

                ${member.full_name}

                </h3>


                <p class="text-gray-500">

                ${member.department || "-"}

                </p>


            </div>



            <div class="text-3xl">

            🎉

            </div>


        </div>


        `;


    });



}









// ==========================================
// RECENT MEMBERS
// ==========================================

async function loadRecentMembers(){



    const {data,error}=


    await window.supabaseClient


    .from("members")


    .select("*")


    .order(

        "created_at",

        {

            ascending:false

        }

    )


    .limit(10);







    if(error){


        console.log(error);


        return;


    }







    const table =

    document.getElementById(
        "memberTable"
    );







    if(!table)

        return;








    table.innerHTML="";







    if(!data || data.length===0){


        table.innerHTML=`

        <tr>

        <td colspan="5"
        class="text-center py-10">

        No members found.

        </td>


        </tr>

        `;


        return;


    }









    data.forEach(member=>{


        table.innerHTML +=`


        <tr>


            <td class="p-4">

            ${member.member_no || "-"}

            </td>



            <td class="p-4 font-semibold">

            ${member.full_name || "-"}

            </td>



            <td class="p-4">

            ${member.department || "-"}

            </td>



            <td class="p-4">

            ${member.level || "-"}

            </td>



            <td class="p-4">

            ${member.phone1 || "-"}

            </td>



        </tr>


        `;


    });



}