const API="/api/TravelAway";
let role="customer";
document.querySelectorAll(".tab-btn").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active"); role=btn.dataset.role;
}));
document.getElementById("loginForm").addEventListener("submit",async e=>{
    e.preventDefault(); setMessage("loginMessage","Signing in...","info");
    const emailId=document.getElementById("emailId").value.trim();
    const password=document.getElementById("password").value;
    const payload=role==="customer"
        ? {EmailId:emailId,UserPassword:password}
        : {EmailId:emailId,Password:password};
    try{
        const r=await fetch(`${API}/${role==="customer"?"ValidateLoginCustomer":"ValidateLoginEmployee"}`,{
            method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)
        });
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        const result=await r.json();
        if(result===1){
            localStorage.setItem("travelawayEmail",emailId);
            localStorage.setItem("travelawayRole",role);
            setMessage("loginMessage","Login successful. Redirecting...","success");
            setTimeout(()=>location.href=role==="employee"?"admin.html":"index.html",500);
        }else if(result===0) setMessage("loginMessage","Invalid password.","error");
        else if(result===-1) setMessage("loginMessage","Email ID was not found.","error");
        else setMessage("loginMessage","Login failed. Please check the API response.","error");
    }catch(err){console.error(err);setMessage("loginMessage","Unable to connect to the TravelAway API.","error")}
});
function setMessage(id,text,type){const e=document.getElementById(id);e.textContent=text;e.className=`message ${type}`}
