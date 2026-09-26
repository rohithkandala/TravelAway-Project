const API="/api/TravelAway";
async function post(action,payload){const r=await fetch(`${API}/${action}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}
async function get(action,params={}){const u=new URL(`${API}/${action}`,location.origin);Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));const r=await fetch(u);if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}

document.getElementById("hotelForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const p={HotelName:v("hotelName"),HotelRating:Number(v("hotelRating")),SingleRoomPrice:Number(v("singleRoomPrice")),DoubleRoomPrice:Number(v("doubleRoomPrice")),DeluxeeRoomPrice:Number(v("deluxeeRoomPrice")),SuiteRoomPrice:Number(v("suiteRoomPrice")),City:v("hotelCity")};
    try{const r=await post("AddHotel",p);msg("hotelMessage",r?"Hotel added successfully.":"Hotel could not be added.",r?"success":"error")}catch(err){msg("hotelMessage","Unable to add hotel.","error")}
});
document.getElementById("vehicleForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const p={VehicleName:v("vehicleName"),VehicleType:v("vehicleType"),RatePerHour:Number(v("ratePerHour")),RatePerKm:Number(v("ratePerKm")),BasePrice:Number(v("basePrice"))};
    try{const r=await post("AddVehicle",p);msg("vehicleMessage",r?"Vehicle added successfully.":"Vehicle could not be added.",r?"success":"error")}catch(err){msg("vehicleMessage","Unable to add vehicle.","error")}
});
document.getElementById("getAssignee").addEventListener("click",async()=>{
    try{const r=await get("GetAssignee");document.getElementById("assignee").value=r;msg("careMessage",r>0?`Assignee selected: ${r}`:"No assignee returned.",r>0?"success":"error")}catch(e){msg("careMessage","Unable to get assignee.","error")}
});
document.getElementById("careForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const p={BookingId:Number(v("careBookingId")),Query:v("query"),QueryStatus:v("queryStatus"),Assignee:Number(v("assignee")),QueryAnswer:v("queryAnswer")};
    try{const r=await post("AddCustomerCare",p);msg("careMessage",r?"Customer-care entry added.":"Customer-care entry could not be added.",r?"success":"error")}catch(err){msg("careMessage","Unable to add customer-care entry.","error")}
});
document.getElementById("loadHotels").addEventListener("click",async()=>{
    try{const list=await get("GetHotels")||[];document.getElementById("referenceData").innerHTML=list.map(h=>`<div class="reference-item"><strong>${esc(h.hotelName??h.HotelName)}</strong><br>Rating: ${h.hotelRating??h.HotelRating} · City: ${esc(h.city??h.City)}</div>`).join("")||"<div class='empty-state'>No hotels returned.</div>"}catch(e){document.getElementById("referenceData").innerHTML='<div class="error-message">Unable to load hotels.</div>'}
});
document.getElementById("loadVehicles").addEventListener("click",async()=>{
    try{const list=await get("GetVehicles")||[];document.getElementById("referenceData").innerHTML=list.map(v=>`<div class="reference-item"><strong>${esc(v.vehicleName??v.VehicleName)}</strong><br>Type: ${esc(v.vehicleType??v.VehicleType)} · Hour: ₹${v.ratePerHour??v.RatePerHour} · Km: ₹${v.ratePerKm??v.RatePerKm}</div>`).join("")||"<div class='empty-state'>No vehicles returned.</div>"}catch(e){document.getElementById("referenceData").innerHTML='<div class="error-message">Unable to load vehicles.</div>'}
});
function v(id){return document.getElementById(id).value}
function msg(id,text,type){const e=document.getElementById(id);e.textContent=text;e.className=`message ${type}`}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
