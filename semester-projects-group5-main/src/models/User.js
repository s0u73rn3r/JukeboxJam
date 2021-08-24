export default class User {
    constructor(userName, password) {
        this._userName = userName;
        this._password = password;
    }

    get userName() {
        return this._userName;
    }

    set userName(userName) {
        this._userName = userName;
    }

    get password() {
        return this._password;
    }

    set password(password) {
        this._password = password;
    }
}