function swap(referTo){//referTo refers to the current div where this function is defined
    if(referTo.getAttribute("data-tab")=="login"){
        document.getElementById("form-body").classList.remove("active");
        referTo.parentNode.classList.remove("signup");//removes/hides the signup form
    }
    else{
        document.getElementById("form-body").classList.add("active");
        referTo.parentNode.classList.add("signup");//adds the signup form
    }
}

function loginUser(){
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
        if(email == "" || password ==""){
            alert("Please all enter credentials")
        }
        else{
             if(email == "admin@admin.com" && password=="admin1234"){
           window.location.href= "admin_control_panel.html";
          
        }
            else if(email == "user@user.com" && password=="user1234"){
            window.location.href="request_loan.html";
           
        }
            else{
                alert("Wrong credentials. For testing: 'Admin' => {'email':'admin@admin.com', 'Password':'admin1234'}, 'User'=> {'email':'user@user.com', 'password':'user1234'}");
         }
        }
       
    }