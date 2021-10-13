class User {
    _login;
    _password;
    _email;
    constructor(_login, _password, _email) {
        this._login = _login;
        this._password = _password;
        this._email = _email;
    }
    set login(login) {
        this._login = login;
    }
    set password(password) {
        this.password = password;
    }
    set email(email) {
        this.email = email;
    }
    get login() {
        return this._login;
    }
    get password() {
        return this._password;
    }
    get email() {
        return this._email;
    }
}
let usersArray = [];
let userIndex;
const formUser = document.forms[0];
function checkInput(field) {
    let objRegxp = new User(/^[a-zA-Z0-9]{4,16}$/, /^[\w_\-.]{4,16}$/, /^[a-z0-9_\-.]+@[a-z.]+\.[a-z]+$/);
    if (objRegxp[field.name].test(field.value)) {
        deleteRed(field);
        return true;
    }
    else {
        setRed(field);
        field.addEventListener('input', watchInput);
        field.focus();
        return false;
    }
}
function watchInput(event) {
    if (checkInput(event.target)) {
        event.target.removeEventListener('input', watchInput);
    }
}
function checkAllInputs() {
    for (let i = 0; i < 3; i++) {
        if (!(checkInput(formUser[i]))) {
            return false;
        }
    }
    return true;
}
function setRed(field) {
    field.classList.add('red');
}
function deleteRed(field) {
    field.classList.remove('red');
}
formUser.add.onclick = addUser;
formUser.edit.onclick = saveEditUser;
function addUser() {
    if (!(checkAllInputs())) {
        return;
    }
    let newUser = new User(formUser.login.value, formUser.password.value, formUser.email.value);
    usersArray.push(newUser);
    formUser.login.value = '';
    formUser.password.value = '';
    formUser.email.value = '';
    render();
}
function render() {
    document.querySelector('tbody').innerHTML = null;
    for (let i = 0; i < usersArray.length; i++) {
        let tr = document.createElement('tr');
        let td = [];
        for (let j = 0; j < 6; j++) {
            td[j] = document.createElement('td');
            tr.append(td[j]);
        }
        td[0].textContent = `${i + 1}`;
        td[1].textContent = usersArray[i].login;
        td[2].textContent = usersArray[i].password;
        td[3].textContent = usersArray[i].email;
        let button = [];
        for (let j = 0; j < 2; j++) {
            button[j] = document.createElement('button');
            button[j].setAttribute('type', 'button');
            button[j].classList.add('btn');
            button[j].classList.add(j ? 'btn_delete' : 'btn_edit');
            button[j].textContent = j ? 'Delete' : 'Edit';
            td[j + 4].append(button[j]);
        }
        document.querySelector('tbody').append(tr);
    }
}
document.querySelector('tbody').onclick = (event) => event.target.classList.contains('btn_edit') ? editUser(event) :
    event.target.classList.contains('btn_delete') ? deleteUser(event) : 0;
function deleteUser(event) {
    let index = +event.target.parentElement.parentElement.firstElementChild.textContent - 1;
    usersArray.splice(index, 1);
    render();
}
function editUser(event) {
    userIndex = +event.target.parentElement.parentElement.firstElementChild.textContent - 1;
    let user = usersArray[userIndex];
    formUser.login.value = user.login;
    formUser.password.value = user.password;
    formUser.email.value = user.email;
    formUser.add.classList.add('hide');
    formUser.edit.classList.remove('hide');
}
function saveEditUser() {
    if (!(checkAllInputs())) {
        return;
    }
    let user = new User(formUser.login.value, formUser.password.value, formUser.email.value);
    usersArray[userIndex] = user;
    formUser.login.value = '';
    formUser.password.value = '';
    formUser.email.value = '';
    render();
    formUser.edit.classList.add('hide');
    formUser.add.classList.remove('hide');
}