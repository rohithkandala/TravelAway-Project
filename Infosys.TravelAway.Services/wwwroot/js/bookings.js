const API="/api/TravelAway";
document.addEventListener("DOMContentLoaded",()=>{
    const email=localStorage.getItem("travelawayEmail");
    if(email) document.getElementById("emailId").value=email;
});
document.getElementById("bookingsForm").addEventListener("submit",async e=>{
    e.preventDefault();const email=document.getElementById("emailId").value.trim();setMessage("bookingsMessage","Loading...","info");
    try{
        const u=new URL(`${API}/ViewBookedPackages`,location.origin);u.searchParams.set("email",email);
        const r=await fetch(u);if(!r.ok)throw new Error(`HTTP ${r.status}`);
        const bookings=await r.json();displayBookings(bookings);
    }catch(err){console.error(err);document.getElementById("bookingsContainer").innerHTML='<div class="error-message">Unable to load bookings.</div>';setMessage("bookingsMessage","API request failed.","error")}
});
function displayBookings(list){
    const c=document.getElementById("bookingsContainer");
    if(!list?.length){c.innerHTML='<div class="empty-state">No bookings found.</div>';setMessage("bookingsMessage","No bookings were returned.","info");return}
    c.innerHTML=list.map(b=>{
        const bookingId=b.bookingId??b.BookingId;const name=b.packageName??b.PackageName??"Package";
        const place=b.placesToVisit??b.PlacesToVisit??"N/A";const travel=b.dateOfTravel??b.DateOfTravel??"N/A";
        const adults=b.numberOfAdults??b.NumberOfAdults??0;const children=b.numberOfChildren??b.NumberOfChildren??0;
        const total=b.totalAmount??b.TotalAmount??0;const hotel=b.hotelName??b.HotelName??"N/A";const rooms=b.noOfRooms??b.NoOfRooms??0;
        const days=b.noOfDays??b.NoOfDays??"N/A";const nights=b.noOfNights??b.NoOfNights??"N/A";const status=b.status??b.Status??"N/A";
        return `<article class="booking-card"><h3>${escapeHtml(name)}</h3><p class="muted">${escapeHtml(place)} · ${days} Days / ${nights} Nights</p><div class="booking-meta">
        <div class="meta-box"><span>Booking ID</span><strong>${bookingId}</strong></div>
        <div class="meta-box"><span>Travel Date</span><strong>${escapeHtml(travel)}</strong></div>
        <div class="meta-box"><span>Status</span><strong>${escapeHtml(status)}</strong></div>
        <div class="meta-box"><span>Guests</span><strong>${adults} Adults, ${children} Children</strong></div>
        <div class="meta-box"><span>Hotel</span><strong>${escapeHtml(hotel)} (${rooms} rooms)</strong></div>
        <div class="meta-box"><span>Total</span><strong>₹${Number(total).toLocaleString("en-IN")}</strong></div>
        </div></article>`;
    }).join("");
    setMessage("bookingsMessage",`${list.length} booking(s) loaded.`,"success");
}
function setMessage(id,text,type){const e=document.getElementById(id);e.textContent=text;e.className=`message ${type}`}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
