class User {
    constructor(
        private _login: string|RegExp,
        private _password: string|RegExp,
        private _email: string|RegExp
    ) {}
    public set login(login: string|RegExp) {
        this._login = login;
    }
    public set password(password: string|RegExp) {
        this.password = password;
    }
    public set email(email: string|RegExp) {
        this.email = email;
    }
    public get login(): string|RegExp {
        return this._login;
    }
    public get password(): string|RegExp {
        return this._password;
    }
    public get email(): string|RegExp {
        return this._email;
    }
}
// variables
let usersArray: User[] = [];
let userIndex: number;

// get form
const formUser: HTMLFormElement = document.forms[0];

// input
// check input field; if false, add oninput; call setRed or deleteRed; get input; return true/false
function checkInput(field: HTMLInputElement): boolean {
    let objRegxp: User = new User(/^[a-zA-Z0-9]{4,16}$/, /^[\w_\-.]{4,16}$/, /^[a-z0-9_\-.]+@[a-z.]+\.[a-z]+$/);
    if(objRegxp[field.name].test(field.value)) {
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

// check input of text to input field
function watchInput(event: InputEvent):void {
    if(checkInput(event.target as HTMLInputElement)) {
        event.target.removeEventListener('input', watchInput);
    }
}

// check all input fields; return true/false
function checkAllInputs(): boolean {
    for(let i = 0; i < 3; i++) {
        if(!(checkInput(<HTMLInputElement>formUser[i]))) {
            return false;
        }
    }
    return true;
}
// set red border; get input field
function setRed(field: HTMLInputElement): void {
    field.classList.add('red');
}
// delete red border; get input field
function deleteRed(field: HTMLInputElement): void {
    field.classList.remove('red');
}

// button
// onclick functions
formUser.add.onclick = addUser;
formUser.edit.onclick = saveEditUser;

// create new User; clear input fields
function addUser(): void {
    if(!(checkAllInputs())) {
        return;
    }
    let newUser: User = new User(
        formUser.login.value,
        formUser.password.value,
        formUser.email.value
        );
    usersArray.push(newUser);
    formUser.login.value = '';
    formUser.password.value = '';
    formUser.email.value = '';
    render();
}

// create table with data of users
function render(): void {
    document.querySelector('tbody').innerHTML = null;
    for(let i=0; i<usersArray.length; i++) {
        let tr: HTMLTableRowElement = document.createElement('tr');
        let td: HTMLTableCellElement[] = [];
        for(let j = 0; j < 6; j++) {
            td[j] = document.createElement('td');
            tr.append(td[j]);
        }
        td[0].textContent = `${i + 1}`;
        td[1].textContent = <string>usersArray[i].login;
        td[2].textContent = <string>usersArray[i].password;
        td[3].textContent = <string>usersArray[i].email;
        let button: HTMLButtonElement[] = [];
        for(let j=0; j<2; j++) {
            button[j] = document.createElement('button');
            button[j].setAttribute('type', 'button');
            button[j].classList.add('btn');
            button[j].classList.add(j ? 'btn_delete' : 'btn_edit');
            button[j].textContent = j ? 'Delete' : 'Edit';
            td[j+4].append(button[j]);
        }
        document.querySelector('tbody').append(tr);
    }
}

// tbody.onclick - call editUser or deleteUser
document.querySelector('tbody').onclick = (event: MouseEvent) => 
    (event.target as HTMLButtonElement).classList.contains('btn_edit') ? editUser(event) : 
    (event.target as HTMLButtonElement).classList.contains('btn_delete') ? deleteUser(event) : 0 ;

// delete user from table
function deleteUser(event: MouseEvent) {
    let index: number = +(event.target as HTMLButtonElement).parentElement.parentElement.firstElementChild.textContent - 1;
    usersArray.splice(index, 1);
    render();
}

// get data of user, write the data to input fields, change button
function editUser(event: MouseEvent) {
    userIndex = +(event.target as HTMLButtonElement).parentElement.parentElement.firstElementChild.textContent - 1;
    let user: User = usersArray[userIndex];
    formUser.login.value = user.login;
    formUser.password.value = user.password;
    formUser.email.value = user.email;
    formUser.add.classList.add('hide');
    formUser.edit.classList.remove('hide');
}
// save edit data of user
function saveEditUser(): void {
    if(!(checkAllInputs())) {
        return;
    }
    let user: User = new User(
        formUser.login.value,
        formUser.password.value,
        formUser.email.value
    );
    usersArray[userIndex] = user;
    formUser.login.value = '';
    formUser.password.value = '';
    formUser.email.value = '';
    render();
    formUser.edit.classList.add('hide');
    formUser.add.classList.remove('hide');
}