const API="/api/TravelAway";
document.addEventListener("DOMContentLoaded",async()=>{
    const bookingId=localStorage.getItem("travelawayBookingId");if(bookingId)document.getElementById("bookingId").value=bookingId;
});
document.getElementById("paymentForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const payload={BookingId:Number(document.getElementById("bookingId").value),TotalAmount:Number(document.getElementById("totalAmount").value),PaymentStatus:document.getElementById("paymentStatus").value};
    try{
        const r=await fetch(`${API}/Payment`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!r.ok)throw new Error(`HTTP ${r.status}`);
        const result=await r.json();setMessage("paymentMessage",result?"Payment recorded successfully.":"Payment could not be recorded.",""+(result?"success":"error"));
    }catch(err){console.error(err);setMessage("paymentMessage","Unable to submit payment.","error")}
});
function setMessage(id,text,type){const e=document.getElementById(id);e.textContent=text;e.className=`message ${type}`}
