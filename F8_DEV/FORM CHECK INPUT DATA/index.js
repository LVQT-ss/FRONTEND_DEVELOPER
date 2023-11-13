// Hàm valid / đối tượng validator 
function Validator(options) {

    var selectorRules = {};

    // hàm thực hiện validate 
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage = rule.test(inputElement.value);

        // lấy ra các rules của selector 
        var rules = selectorRules[rule.selector];
        // lặp qua từng rule và kiểm tra 
        // nếu có lỗi thì dừng việc kiểm tra 
        for (var i = 0; i < rules.length; ++i) {
            rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
    }

    // lấy element của form cần validate 
    var formElement = document.querySelector(options.form);
    if (formElement) {
        // khi submit form 
        formElement.onsubmit = function (e) {
            e.preventDefault();
            var isFormValid = true;
            options.rules.forEach(function (rule) {
                // lặp qua từng rules và validate 
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    options.onSubmit({
                        name: 'Son Dang'
                    })
                }
            }
        }

        // lặp qua mỗi rule và xử lý ( lắng nghe sự kiện blur , input )
        options.rules.forEach(function (rule) {
            // Lưu lại các rules cho mỗi input 
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                // xử lý trường hợp blur khỏi input 
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }
                // xử lý mỗi khi người dùng nhập vào input 
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });

    }
}

// định nghĩa rules 
// nguyên tắc của các rules:
// 1 khi có lỗi => trả ra message lỗi 
// 2 khi hợp lệ => không trả ra cái gì cả ( undefined) 
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này';
        }
    }
}
Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    }
}
Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}

// validate js 
Validator({
    form: '#form-1',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#fullname', 'Vui lòng nhập tên đầy đủ của bạn'),
        Validator.isEmail('#email'),
        Validator.minLength('#password', 6),
        Validator.isConfirmed('#password_confirmation', function () {
            return document.querySelector('#form-1 #password').value;
        }, 'Mật khẩu nhập lại không chính xác')
    ],
    onSubmit: function (data) {
        console.log(data)
    }
});
