class Apartments {

    constructor(){
        this._db = []
    }

    //Crud operations - The Create
    create( apartment, cb = null) {
        this._db.push(apartment);
        if( cb != null ) {
            cb( null, 'ok');
        }
    }

    readAll(cb){
        cb( null, this._db );
    }
}

module.exports = Apartments