// =========================================
// WACF APP FUNCTIONS
// =========================================


// =========================================
// LOCAL TODAY DATE
// =========================================

function attendanceDate(){

    const date = new Date();

    return date.getFullYear()
    + "-"
    + String(date.getMonth()+1).padStart(2,"0")
    + "-"
    + String(date.getDate()).padStart(2,"0");

}



// =========================================
// CHECK IF ATTENDANCE EXISTS
// =========================================

async function attendanceMarked(memberId){


    const {data,error}=

    await window.supabaseClient

    .from("attendance")

    .select("id")

    .eq(
        "member_id",
        memberId
    )

    .eq(
        "attendance_date",
        attendanceDate()
    )

    .maybeSingle();



    if(error){

        console.log(error);

        return false;

    }


    return !!data;


}



// =========================================
// MARK ATTENDANCE
// =========================================

async function markAttendance(member){


    if(!member || !member.id){

        return {

            success:false,

            message:"Invalid member"

        };

    }



    const already =

    await attendanceMarked(member.id);



    if(already){

        return {

            success:false,

            message:"Attendance already marked"

        };

    }



    const {error}=

    await window.supabaseClient

    .from("attendance")

    .insert({

        member_id:member.id,

        member_no:member.member_no,

        full_name:member.full_name,

        department:member.department,

        level:member.level,

        phone1:member.phone1,

        attendance_date:attendanceDate(),

        status:"Present"

    });



    if(error){

        console.log(error);

        return {

            success:false,

            message:error.message

        };

    }



    return {

        success:true,

        message:"Attendance marked successfully"

    };


}




// =========================================
// PRESENT TODAY COUNT
// =========================================

async function presentToday(){


    const {count,error}=

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



    if(error){

        console.log(error);

        return 0;

    }


    return count || 0;


}




// =========================================
// TOTAL MEMBERS
// =========================================

async function totalMembers(){


    const {count,error}=

    await window.supabaseClient

    .from("members")

    .select("*",{

        count:"exact",

        head:true

    });



    if(error){

        console.log(error);

        return 0;

    }


    return count || 0;


}




// =========================================
// ABSENT TODAY
// =========================================

async function absentToday(){


    const total = await totalMembers();

    const present = await presentToday();


    return Math.max(
        total-present,
        0
    );


}





// =========================================
// GET MEMBERS
// =========================================

async function getMembers(){


    const {data,error}=

    await window.supabaseClient

    .from("members")

    .select("*")

    .order(
        "full_name",
        {
            ascending:true
        }
    );



    if(error){

        console.log(error);

        return [];

    }


    return data || [];


}




// =========================================
// SEARCH MEMBERS
// =========================================

async function searchMembers(keyword){


    if(!keyword){

        return [];

    }


    const search =
    `%${keyword}%`;



    const {data,error}=

    await window.supabaseClient

    .from("members")

    .select("*")

    .or(

        `full_name.ilike.${search},phone1.ilike.${search},phone2.ilike.${search},member_no.ilike.${search},department.ilike.${search},level.ilike.${search}`

    )

    .order(
        "full_name"
    );



    if(error){

        console.log(error);

        return [];

    }



    return data || [];


}





// =========================================
// ADD MEMBER
// =========================================

async function addMember(member){


    const {data,error}=

    await window.supabaseClient

    .from("members")

    .insert([member])

    .select()

    .single();



    if(error){

        console.log(error);

        return null;

    }



    return data;


}





// =========================================
// UPDATE MEMBER
// =========================================

async function updateMember(id,member){


    const {error}=

    await window.supabaseClient

    .from("members")

    .update(member)

    .eq(
        "id",
        id
    );



    if(error){

        console.log(error);

        return false;

    }


    return true;


}





// =========================================
// DELETE MEMBER
// =========================================

async function deleteMember(id){


    const {error}=

    await window.supabaseClient

    .from("members")

    .delete()

    .eq(
        "id",
        id
    );



    if(error){

        console.log(error);

        return false;

    }


    return true;


}





// =========================================
// GENERATE MEMBER NUMBER
// =========================================

async function generateMemberNumber(){


    const {data,error}=

    await window.supabaseClient

    .from("members")

    .select("member_no")

    .order(
        "id",
        {
            ascending:false
        }
    )

    .limit(1);



    if(error || !data){

        return "WACF0001";

    }



    let next = 1;



    if(data.length > 0){


        let last =
        data[0].member_no;



        let number =
        parseInt(
            last.replace("WACF","")
        );


        next = number + 1;


    }



    return "WACF"
    +
    String(next)
    .padStart(4,"0");


}