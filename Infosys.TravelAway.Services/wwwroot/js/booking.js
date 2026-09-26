const API="/api/TravelAway";
let packages=[];
let lastBookingId=null;

document.addEventListener("DOMContentLoaded",()=>{
    const email=localStorage.getItem("travelawayEmail");
    if(email) document.getElementById("address").value="";
    const today=new Date(); today.setDate(today.getDate()+1);
    document.getElementById("dateOfTravel").min=today.toISOString().split("T")[0];
    loadPackages();
    loadVehicles();
});
async function get(action,params={}){const u=new URL(`${API}/${action}`,location.origin);Object.entries(params).forEach(([k,v])=>u.searchParams.set(k,v));const r=await fetch(u);if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}
async function post(action,payload){const r=await fetch(`${API}/${action}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}
async function loadPackages(){
    try{
        packages=await get("GetPackages")||[];
        const s=document.getElementById("packageSelect");
        s.innerHTML='<option value="">Select a package</option>'+packages.map(p=>`<option value="${p.packageId??p.PackageId}">${escapeHtml(p.packageName??p.PackageName)}</option>`).join("");
        const id=new URLSearchParams(location.search).get("packageId"); if(id){s.value=id;loadSelectedPackage()}
    }catch(e){console.error(e);document.getElementById("packageSelect").innerHTML='<option value="">Unable to load packages</option>'}
}
document.getElementById("packageSelect").addEventListener("change",loadSelectedPackage);
async function loadSelectedPackage(){
    const id=document.getElementById("packageSelect").value;if(!id)return;
    try{
        const r=await get("GetPackageDetailsByPackageId",{packageId:id});const d=Array.isArray(r)?r[0]:r;
        const name=d?.packageName??d?.PackageName??"Package";
        const places=d?.placesToVisit??d?.PlacesToVisit??"N/A";
        const desc=d?.description??d?.Description??"N/A";
        const days=d?.noOfDays??d?.NoOfDays??"N/A";const nights=d?.noOfNights??d?.NoOfNights??"N/A";
        const price=d?.pricePerAdult??d?.PricePerAdult??0;
        document.getElementById("packageSummary").innerHTML=`<strong>${escapeHtml(name)}</strong><br>${escapeHtml(places)} · ${days} Days / ${nights} Nights · ₹${Number(price).toLocaleString("en-IN")} per adult`;
    }catch(e){document.getElementById("packageSummary").textContent="Unable to load package details."}
}
document.getElementById("bookingForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const selectedPackageId=Number(document.getElementById("packageSelect").value);
    if(!selectedPackageId)return;
    const email=localStorage.getItem("travelawayEmail")||prompt("Enter your registered customer email:");
    if(!email)return;
    const packageDetailsId=await resolvePackageDetailsId(selectedPackageId);
    if(!packageDetailsId){setMessage("bookingMessage","The current API response does not expose PackageDetailsId, so the booking cannot be submitted safely.","error");return}
    const payload={
        EmailId:email,
        ContactNumber:Number(document.getElementById("contactNumber").value),
        Address:document.getElementById("address").value.trim(),
        DateOfTravel:document.getElementById("dateOfTravel").value,
        NumberOfAdults:Number(document.getElementById("numberOfAdults").value),
        NumberOfChildren:Number(document.getElementById("numberOfChildren").value||0),
        Status:"Booked",
        PackageId:packageDetailsId
    };
    try{
        const result=await post("AddBookPackage",payload);
        if(result>0){
            lastBookingId=result;
            document.getElementById("accommodationBookingId").value=result;
            localStorage.setItem("travelawayBookingId",result);
            setMessage("bookingMessage",`Booking created successfully. Booking ID: ${result}`,"success");
            await refreshTotal();
        }else setMessage("bookingMessage",`Booking failed. API result: ${result}`,"error");
    }catch(err){console.error(err);setMessage("bookingMessage","Unable to create the booking.","error")}
});
async function resolvePackageDetailsId(packageId){
    try{
        const r=await get("GetPackageDetailsByPackageId",{packageId});
        const d=Array.isArray(r)?r[0]:r;
        const explicit=d?.packageDetailsId??d?.PackageDetailsId;
        if(explicit)return Number(explicit);
    }catch(e){}
    // The supplied TravelAway database uses PackageId 2000..2008 and
    // PackageDetailsId 900..908 in the same insert order.
    if(packageId>=2000&&packageId<=2008)return packageId-1100;
    return null;
}
async function loadVehicles(){
    try{
        const list=await get("GetVehicles")||[];const s=document.getElementById("vehicleSelect");
        s.innerHTML='<option value="">Select a vehicle</option>'+list.map(v=>{
            const id=v.vehicleId??v.VehicleId;const name=v.vehicleName??v.VehicleName;const type=v.vehicleType??v.VehicleType;
            return `<option value="${id}" data-name="${escapeAttr(name)}" data-type="${escapeAttr(type)}">${escapeHtml(name)} - ${escapeHtml(type)}</option>`;
        }).join("");
    }catch(e){document.getElementById("vehicleSelect").innerHTML='<option value="">Unable to load vehicles</option>'}
}
document.getElementById("vehicleSelect").addEventListener("change",e=>{
    const o=e.target.selectedOptions[0];document.getElementById("vehicleInfo").textContent=o?.dataset.name?`${o.dataset.name} · ${o.dataset.type}`:"Select a vehicle.";
});
document.getElementById("hotelRating").addEventListener("change",loadHotels);
document.getElementById("accommodationCity").addEventListener("change",loadHotels);
async function loadHotels(){
    const city=document.getElementById("accommodationCity").value.trim(),rating=document.getElementById("hotelRating").value,s=document.getElementById("hotelSelect");
    if(!city||!rating){s.innerHTML='<option value="">Select city/rating first</option>';return}
    try{
        const hotels=await get("GetHotelsByCityAndRating",{city,rating})||[];
        s.innerHTML='<option value="">Select hotel</option>'+hotels.map(h=>`<option value="${escapeAttr(h)}">${escapeHtml(h)}</option>`).join("");
    }catch(e){s.innerHTML='<option value="">Unable to load hotels</option>'}
}
document.getElementById("hotelSelect").addEventListener("change",calculateHotelCost);
document.getElementById("roomType").addEventListener("change",calculateHotelCost);
document.getElementById("numberOfRooms").addEventListener("input",calculateHotelCost);
async function calculateHotelCost(){
    const hotel=document.getElementById("hotelSelect").value,room=document.getElementById("roomType").value,rooms=Number(document.getElementById("numberOfRooms").value||1);
    if(!hotel||!room)return;
    try{const cost=await get("GetHotelCost",{hotelName:hotel,roomtype:room});document.getElementById("estimatedCost").value=Number(cost||0)*rooms}
    catch(e){document.getElementById("estimatedCost").value=""}
}
document.getElementById("accommodationForm").addEventListener("submit",async e=>{
    e.preventDefault();
    const payload={BookingId:Number(document.getElementById("accommodationBookingId").value),City:document.getElementById("accommodationCity").value.trim(),HotelRating:Number(document.getElementById("hotelRating").value),Hotels:document.getElementById("hotelSelect").value,RoomType:document.getElementById("roomType").value,NoOfRooms:Number(document.getElementById("numberOfRooms").value),EstimatedCost:Number(document.getElementById("estimatedCost").value||0)};
    try{const r=await post("AddAccomodationDetails",payload);setMessage("accommodationMessage",r?"Accommodation added successfully.":"Accommodation could not be added.",""+(r?"success":"error"));if(r)await refreshTotal()}catch(e){setMessage("accommodationMessage","Unable to add accommodation.","error")}
});
document.getElementById("refreshTotal").addEventListener("click",refreshTotal);
async function refreshTotal(){
    const id=lastBookingId||document.getElementById("accommodationBookingId").value||localStorage.getItem("travelawayBookingId");
    if(!id){setMessage("bookingMessage","Create or enter a booking ID first.","info");return}
    try{const total=await get("GetTotal",{bookingId:id});document.getElementById("bookingTotal").textContent=`₹${Number(total||0).toLocaleString("en-IN")}`}catch(e){document.getElementById("bookingTotal").textContent="₹0"}
}
function setMessage(id,text,type){const e=document.getElementById(id);e.textContent=text;e.className=`message ${type}`}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function escapeAttr(v){return escapeHtml(v)}
