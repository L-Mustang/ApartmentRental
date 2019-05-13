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

    read(id, cb) {
        this._db.find( (apartment) => {
            if(apartment.id === id) {
                cb(null, apartment);
            }
        })
    }
}

module.exports = Apartments