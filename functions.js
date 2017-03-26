    function createCustomerCapitalOne(fname, lname, streetNum, street, city, state, zip) { //Create a Capital One customer
        var newCustDetails = "{\"first_name\": \"" + fname + "\", \"last_name\": \"" + lname + "\", \"address\": { \"street_number\": \"" + streetNum + "\", \"street_name\": \"" + streetNum + "\", \"city\": \"" + city + "\", \"state\": \"" + state + "\", \"zip\": \"" + zip + "\" } }";
        var responseCode = cust.createCustomer(newCustDetails);
        if(responseCode != 201) {
          alert("Error!\nAn error occurred. Please recheck your information and try again.");
        }
    } 
    function createAccountCapitalOne(id, nickname, account_number) { //Create a Capital One account for the given customer id
        var newAccountDetails = "{\"type\": \"Credit Card\", \"nickname\": \"" + nickname + "\", \"rewards\": 10, \"balance\": 100, \"account_number\": \"" + account_number + "\"}";
        var responseCode = acct.createAccount(id, newAccountDetails);
        if(responseCode != 201) {
          alert("Error!\nAn error occurred. Please recheck your information and try again.");
        }
    }

    function updateCustomerCapitalOne(id, fname, lname, streetNum, street, city, state, zip) { //Update customer details, not used
        var newCustDetails ="{\"first_name\": \"" + fname + "\", \"last_name\": \"" + lname + "\", \"address\": { \"street_number\": \"" + streetNum + "\", \"street_name\": \"" + streetNum + "\", \"city\": \"" + city + "\", \"state\": \"" + state + "\", \"zip\": \"" + zip + "\" } }";
        cust.updateCustomer(id, newCustDetails);

    }
    
    function getUser() { //Get the current username from the URL
        var match = RegExp('[?&]uname=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    function getCustomer() { //Get the objects we need to access customer data
        getCustomerFB(getUser(), function(snapshot) {
            customerFB = snapshot.val();
            customer = getCustomerCapitalOne({"first_name": customerFB.fname, "last_name": customerFB.lname});
            account = acct.getAllByCustomerId(customer._id)[0];
        });
    }
    function getBalance() { //Get the balance of the account, not used
        return account.balance;
    }

    function getCustomerCapitalOne(customerData) { //Get the Capital One customer with the given data fields
        var allCustomers = cust.getCustomers();
        var myCustomer = null;
        // loop through all customers and log their info
        for (var i = 0; i < allCustomers.length; i++) {
            var curCustomer = allCustomers[i];
            var attrs = ["first_name", "last_name", "address"];
            for(var j = 0; j < attrs.length; j++) {
                //console.log(attrs[j]);
                if(customerData[attrs[j]] != null && (curCustomer[attrs[j]] != customerData[attrs[j]])) {
                    break;
                }
                if(j == attrs.length - 1) {
                    myCustomer = allCustomers[i];
                }
            }
        }
        return myCustomer;
    }

    function createCustomerFB(uname, password, fname, lname, streetNum, street, city, state, zip) { //Create a customer in the FireBase database
        ref = database.ref("users/" + uname);
        ref.set({"username": uname, "password": password, "fname": fname, "lname": lname, "streetNum": streetNum, "street": street, "city": city, "state": state});
    }

    function getCustomerFB(uname, func) { //Get a customer's info from the Firbase database, call func on completion
        ref = database.ref("users/" + uname);
        ref.once("value").then(func);        
    }
