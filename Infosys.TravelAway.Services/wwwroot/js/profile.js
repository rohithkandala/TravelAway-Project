const API="/api/TravelAway";
document.addEventListener("DOMContentLoaded",()=>{const e=localStorage.getItem("travelawayEmail");if(e)document.getElementById("lookupEmail").value=e});
document.getElementById("profileLookup").addEventListener("submit",async e=>{
    e.preventDefault();const email=document.getElementById("lookupEmail").value.trim();
    try{
        const u=new URL(`${API}/GetCustomerByEmail`,location.origin);u.searchParams.set("emailId",email);const r=await fetch(u);if(!r.ok)throw new Error();
        const c=await r.json();if(!c)throw new Error("not found");
        setVal("emailId",c.emailId??c.EmailId);setVal("firstName",c.firstName??c.FirstName);setVal("lastName",c.lastName??c.LastName);setVal("gender",c.gender??c.Gender);setVal("contactNumber",c.contactNumber??c.ContactNumber);setVal("dateOfBirth",(c.dateOfBirth??c.DateOfBirth??"").substring(0,10));setVal("address",c.address??c.Address);
        setMessage("profileMessage","Profile loaded.","success");
    }catch(err){setMessage("profileMessage","Customer profile could not be loaded.","error")}
});
document.getElementById("profileForm").addEventListener("submit",async e=>{
    e.preventDefault();const payload={EmailId:val("emailId"),FirstName:val("firstName"),LastName:val("lastName"),Gender:val("gender"),ContactNumber:Number(val("contactNumber")),DateOfBirth:val("dateOfBirth"),Address:val("address")};
    try{
        const r=await fetch(`${API}/UpdateProfile`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!r.ok)throw new Error();const result=await r.json();
        setMessage("profileMessage",result?"Profile updated successfully.":`Profile update failed. API result: ${result}`,""+(result?"success":"error"));
    }catch(err){setMessage("profileMessage","Unable to update profile.","error")}
});
function val(id){return document.getElementById(id).value}
function setVal(id,v){document.getElementById(id).value=v??""}
function setMessage(id,text,type){const e=document.getElementById(id);e.textContent=text;e.className=`message ${type}`}
