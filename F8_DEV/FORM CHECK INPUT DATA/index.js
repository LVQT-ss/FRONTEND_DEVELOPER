//Hàm valid / đối tượng validator 
function Validator(options){
     
    var selectorRules= {};
    // hàm thực hiện validate 
    function validate(inputElement,rule){
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value)
                    
        if (errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
    }

//lấy element của form cần validate 
    var formElement = document.querySelector(options.form);
    if (formElement){
        options.rules.forEach(function (rule){
            //Lưu lại các rules cho mỗi input 
            selectorRules[rule.selector] = rule.test;
            var inputElement = formElement.querySelector(rule.selector);
            if(inputElement){
                // xử lý trường hợp blur khỏi input 
                inputElement.onblur = function (){
                    validate(inputElement,rule);
                }
                // xử lý mỗi khi người dùng nhập vào input 
                inputElement.oninput = function (){
                    var errorElement = inputElement.parentElement.querySelector(errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
        console.log(selectorRules)
        
    }
}
//định nghĩa rules 
//nguyên tắc của các rules:
//1 khi có lỗi => trả ra message lỗi 
//2 khi hợp lệ => không trả ra cái gì cả ( undefined) 
Validator.isRequired = function(selector,message){
    return{
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined :message|| 'Vui lòng nhập trường này';
        }
    }
}
Validator.isEmail = function(selector,message){
    return{
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    }
}
Validator.minLength = function(selector, min,message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
}

Validator.isConfirmed = function (selector,getConfirmValue,message){
    return {
        selector: selector,
        test: function (value){
            return value === getConfirmValue() ? undefined : message || 'Gía trị nhập vào không chính xác'
        }
    }
}