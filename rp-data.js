const RP_KEY = "RP_PHONE_MEMORY_V1";


function freshRP() {

    return {

        gcash: {
            balance: 3120.75,
            transactions: []
        },

        maribank: {
            balance: 12450.50,
            transactions: []
        },

        foodpandaOrders: [],

        shopeeOrders: [],

        bills: []

    };

}


function loadRP() {

    const saved = localStorage.getItem(RP_KEY);

    if (saved) {

        try {

            return JSON.parse(saved);

        } catch (error) {

            console.log("Corrupted RP save. Creating new save.");

        }

    }

    const data = freshRP();

    localStorage.setItem(
        RP_KEY,
        JSON.stringify(data)
    );

    return data;

}


function saveRP(data) {

    localStorage.setItem(
        RP_KEY,
        JSON.stringify(data)
    );

}


function payRP(account, amount, transaction) {

    const data = loadRP();

    amount = Number(amount);

    if (!amount || amount <= 0) {

        alert("Invalid amount.");

        return false;

    }


    if (!data[account]) {

        alert("Invalid payment account.");

        return false;

    }


    if (data[account].balance < amount) {

        alert("Insufficient balance.");

        return false;

    }


    data[account].balance -= amount;


    data[account].transactions.unshift(
        transaction
    );


    saveRP(data);

    return true;

}


function addFoodpandaOrder(order) {

    const data = loadRP();

    data.foodpandaOrders.unshift(order);

    saveRP(data);

}


function addShopeeOrder(order) {

    const data = loadRP();

    data.shopeeOrders.unshift(order);

    saveRP(data);

}


function addBill(bill) {

    const data = loadRP();

    data.bills.unshift(bill);

    saveRP(data);

}


function resetRP() {

    const confirmReset = confirm(

        "RESET ALL RP DATA?\n\n" +

        "This will erase:\n" +

        "• GCash balance & transactions\n" +

        "• MariBank balance & transactions\n" +

        "• Foodpanda orders\n" +

        "• Shopee orders\n" +

        "• Bills\n\n" +

        "Start a completely new RP?"

    );


    if (!confirmReset) {

        return;

    }


    localStorage.removeItem(RP_KEY);


    loadRP();


    alert("Fresh RP started!");


    location.reload();

}
