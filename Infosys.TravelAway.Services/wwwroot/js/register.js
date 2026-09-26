const API="/api/TravelAway";
document.getElementById("registerForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const payload={
        EmailId:document.getElementById("emailId").value.trim(),
        FirstName:document.getElementById("firstName").value.trim(),
        LastName:document.getElementById("lastName").value.trim(),
        UserPassword:document.getElementById("password").value,
        Gender:document.getElementById("gender").value,
        ContactNumber:Number(document.getElementById("contactNumber").value),
        DateOfBirth:document.getElementById("dateOfBirth").value,
        Address:document.getElementById("address").value.trim()
    };
    setMessage("registerMessage","Creating account...","info");
    try{
        const r=await fetch(`${API}/AddCustomer`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        const result=await r.json();
        if(result===1){setMessage("registerMessage","Registration successful. You can now log in.","success");document.getElementById("registerForm").reset()}
        else if(result===-6)setMessage("registerMessage","An account with this email already exists.","error");
        else if(result===-2)setMessage("registerMessage","Password must contain 8-15 characters.","error");
        else if(result===-4)setMessage("registerMessage","Customer must be at least 18 years old.","error");
        else setMessage("registerMessage",`Registration was not completed. API result: ${result}`,"error");
    }catch(err){console.error(err);setMessage("registerMessage","Unable to connect to the TravelAway API.","error")}
});
function setMessage(id,text,type){const e=document.getElementById(id);e.textContent=text;e.className=`message ${type}`}
