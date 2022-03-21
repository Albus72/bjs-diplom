'use strict';

const userForm = new UserForm();

const checkStatus = (response, handlerFunctionName) => {
    if (response.success) {
        location.reload();
    } else {
        userForm[handlerFunctionName](response.error);
    }
};

userForm.loginFormCallback = (data) => {
    ApiConnector.login(data, (response) => checkStatus(response, 'setLoginErrorMessage'));
};

userForm.registerFormCallback = (data) => {
    ApiConnector.register(data, (response) => checkStatus(response, 'setRegisterErrorMessage'));
};