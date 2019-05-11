
class Persons {

    // Constructor, aangeroepen bij new Persons()
    constructor() {
        console.log('>> constructor');
        this._db = []; // Nu niet onder prototype
    }

    // The C in Crud. Ter illustratie een optionele callback
    create(user, cb = null) {
        this._db.push(user);
        console.table(this._db);
        if( cb !== null ) {
            cb(null, 'ok');
        }
    }

    // The R in cRud - find on firstname 
    read(firstname, cb) {
        this._db.find( (person) => {
            if( person === firstname ) {
                cb(null, person);
            }
        });
    }

    // The U in crUd - update age voor person met voornaam === firstname
    update(firstname, age, cb) {
        this._db.find( (person) => {
            if( person.firstname === firstname) {
                person.age = age;
                cb(null, person);
            } else {
                cb(new Error('not found'), null);
            }
        });
    }

    // The D in cruD - Delete person met voornaam === firstname
    delete(firstname, cb) {
        this._db.find( (person) => {
            if (person.firstname === firstname) {

                // Get Index
                const index = this._db.indexOf(person);

                // Splice from array
                this._db.splice(0, 1);
                cb(null, index);
            } else {
                cb(new Error('not found'), null);
            }
        });
        cb(null, "d");
    }
}

module.exports = Persons;
