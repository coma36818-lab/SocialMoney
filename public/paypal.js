
function paypalBtn(id, price, callback) {
    if(!window.paypal) {
        console.error("PayPal SDK not loaded.");
        return;
    }
    window.paypal.Buttons({
        createOrder: (d,a)=>a.order.create({
            purchase_units:[{ amount:{ value: price.toString() } }]
        }),
        onApprove: async (d,a)=>{
            await callback();
        }
    }).render(id);
}

// LIKE PACKS
if(document.getElementById("#likes50")) paypalBtn("#likes50", 1.00, ()=>alert("50 Like aggiunti al tuo wallet."));
if(document.getElementById("#likes200")) paypalBtn("#likes200", 3.00, ()=>alert("200 Like aggiunti al tuo wallet."));
if(document.getElementById("#likes500")) paypalBtn("#likes500", 5.00, ()=>alert("500 Like aggiunti al tuo wallet."));
if(document.getElementById("#likes1500")) paypalBtn("#likes1500", 10.00, ()=>alert("1500 Like aggiunti al tuo wallet."));

    