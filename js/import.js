// ==========================================
// WACF IMPORT EXCEL MEMBERS
// ==========================================


let importedMembers = [];


// ELEMENTS

const excelFile = document.getElementById("excelFile");

const uploadBtn = document.getElementById("uploadBtn");

const previewBox = document.getElementById("previewBox");

const previewTable = document.getElementById("previewTable");

const saveImport = document.getElementById("saveImport");




// ==========================================
// LOCAL TODAY DATE
// ==========================================

function importAttendanceDate(){

    const date = new Date();

    return date.getFullYear()
    + "-"
    + String(date.getMonth()+1).padStart(2,"0")
    + "-"
    + String(date.getDate()).padStart(2,"0");

}



// ==========================================
// READ EXCEL
// ==========================================


if(uploadBtn){

uploadBtn.onclick = ()=>{


    if(!excelFile.files[0]){

        alert("Select Excel file first");

        return;

    }



    const reader = new FileReader();



    reader.onload = (e)=>{


        const workbook = XLSX.read(

            e.target.result,

            {
                type:"binary"
            }

        );



        const sheet =
        workbook.Sheets[
            workbook.SheetNames[0]
        ];



        importedMembers =
        XLSX.utils.sheet_to_json(sheet);



        showPreview();


    };



    reader.readAsBinaryString(
        excelFile.files[0]
    );


};


}





// ==========================================
// SHOW PREVIEW
// ==========================================


function showPreview(){


    previewTable.innerHTML="";



    importedMembers.forEach(member=>{


        previewTable.innerHTML += `


        <tr class="border-b">


        <td class="p-3">

        ${member.full_name || ""}

        </td>



        <td class="p-3">

        ${member.phone1 || ""}

        </td>



        <td class="p-3">

        ${member.department || "-"}

        </td>



        <td class="p-3">

        ${member.level || "-"}

        </td>



        </tr>


        `;


    });



    previewBox.classList.remove("hidden");


}








// ==========================================
// SAVE IMPORT
// ==========================================


if(saveImport){


saveImport.onclick = async()=>{


    if(importedMembers.length===0){

        alert(
            "No members to import"
        );

        return;

    }



    // ===============================
    // START LOADER
    // ===============================


    saveImport.disabled = true;


    saveImport.innerHTML = `

        <i class="fas fa-spinner fa-spin"></i>

        Saving Members...

    `;




    let success = 0;



    let failed = 0;



    try{



    for(const row of importedMembers){



        const phone1 =
        row.phone1;



        const phone2 =
        row.phone2 || null;



        if(!phone1){

            failed++;

            continue;

        }





        // CHECK DUPLICATE PHONE


        const {

            data:existing

        } = await window.supabaseClient


        .from("members")

        .select("id")

        .or(
        `
        phone1.eq.${phone1},
        phone2.eq.${phone1}
        `
        );





        if(existing && existing.length > 0){


            failed++;

            continue;


        }






        // CREATE MEMBER


        const member = {


            member_no:
            await generateMemberNumber(),



            full_name:
            row.full_name || "",



            birth_day:
            row.birth_day || null,



            birth_month:
            row.birth_month || null,



            address:
            row.address || "",



            department:
            row.department || "",



            level:
            row.level || "",



            phone1:
            phone1,



            phone2:
            phone2


        };







        const {

            data:newMember,

            error

        } = await window.supabaseClient


        .from("members")

        .insert(member)

        .select()

        .single();






        if(error){


            console.log(error);


            failed++;

            continue;


        }






        // ===============================
        // AUTO MARK PRESENT TODAY
        // ===============================


        const {

            error:attendanceError

        } = await window.supabaseClient


        .from("attendance")

        .insert({



            member_id:
            newMember.id,



            member_no:
            newMember.member_no,



            attendance_date:
            importAttendanceDate(),



            status:
            "Present"



        });





        if(attendanceError){


            console.log(attendanceError);


        }





        success++;



    }







    alert(

        success +

        " members imported successfully\n\n" +

        failed +

        " skipped"

    );







    importedMembers = [];



    previewTable.innerHTML = "";



    previewBox.classList.add("hidden");





    }

    catch(error){



        console.log(error);



        alert(

            error.message

        );



    }



    finally{



        // ===============================
        // STOP LOADER
        // ===============================


        saveImport.disabled = false;



        saveImport.innerHTML = `


            <i class="fas fa-database"></i>


            Save Members



        `;



    }





};


}