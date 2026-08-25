const RP_KEY = "RP_PHONE_MEMORY_V2";

function freshRP() {
    return {
        profile: {
            name: "RP User"
        },

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

    if (!saved) {
        const data = freshRP();
        saveRP(data);
        return data;
    }

    try {
        return JSON.parse(saved);
    } catch (e) {
        const data = freshRP();
        saveRP(data);
        return data;
    }
}


function saveRP(data) {
    localStorage.setItem(
        RP_KEY,
        JSON.stringify(data)
    );
}


function peso(amount) {

    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(Number(amount));
}


function now() {
    return new Date().toLocaleString("en-PH");
}


/*
==================================================
ADD MONEY
==================================================
*/

function addMoney(account, amount, description = "Cash In") {

    const data = loadRP();

    amount = Number(amount);

    if (!data[account]) {
        return {
            success: false,
            message: "Invalid account."
        };
    }

    if (!amount || amount <= 0) {
        return {
            success: false,
            message: "Enter a valid amount."
        };
    }

    data[account].balance += amount;

    data[account].transactions.unshift({
        id: Date.now(),
        name: description,
        description: "RP Cash In",
        amount: amount,
        icon: "💰",
        date: now()
    });

    saveRP(data);

    return {
        success: true,
        message: "Money added successfully."
    };
}


/*
==================================================
REMOVE MONEY
==================================================
*/

function removeMoney(account, amount) {

    const data = loadRP();

    amount = Number(amount);

    if (!data[account]) {
        return {
            success: false,
            message: "Invalid account."
        };
    }

    if (!amount || amount <= 0) {
        return {
            success: false,
            message: "Enter a valid amount."
        };
    }

    if (data[account].balance < amount) {
        return {
            success: false,
            message: "Insufficient balance."
        };
    }

    data[account].balance -= amount;

    data[account].transactions.unshift({
        id: Date.now(),
        name: "Cash Out",
        description: "RP Cash Out",
        amount: -amount,
        icon: "💸",
        date: now()
    });

    saveRP(data);

    return {
        success: true,
        message: "Money removed successfully."
    };
}


/*
==================================================
PAY FROM ACCOUNT
==================================================
*/

function payRP(account, amount, transaction) {

    const data = loadRP();

    amount = Number(amount);

    if (!data[account]) {
        return {
            success: false,
            message: "Invalid payment account."
        };
    }

    if (!amount || amount <= 0) {
        return {
            success: false,
            message: "Invalid amount."
        };
    }

    if (data[account].balance < amount) {
        return {
            success: false,
            message:
                "Insufficient " +
                (account === "gcash"
                    ? "GCash"
                    : "MariBank") +
                " balance."
        };
    }

    data[account].balance -= amount;

    data[account].transactions.unshift({
        id: Date.now(),
        name: transaction.name || "Payment",
        description: transaction.description || "",
        amount: -amount,
        icon: transaction.icon || "💳",
        date: now()
    });

    saveRP(data);

    return {
        success: true,
        message: "Payment successful."
    };
}


/*
==================================================
RECEIVE MONEY
==================================================
*/

function receiveMoney(account, amount, description = "Money Received") {

    return addMoney(
        account,
        amount,
        description
    );
}


/*
==================================================
ORDERS
==================================================
*/

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


/*
==================================================
RESET
==================================================
*/

function resetRP() {

    const yes = confirm(
        "RESET ALL RP DATA?\n\n" +
        "All balances, orders and transactions " +
        "will be deleted."
    );

    if (!yes) return;

    localStorage.removeItem(RP_KEY);

    loadRP();

    alert("Fresh RP created!");

    location.href = "index.html";
        }
