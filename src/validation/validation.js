const validate = function(a){
    if(a.match(/^([a-z A-Z]){2,50}$/)) return true
}

const validateEmail = function(a){
    if(a.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) return true
}

const validatePhone = function(a){
    if(a.match(/^[6-9][0-9]{9}$/)) return true
}


module.exports={validate,validateEmail,validatePhone}