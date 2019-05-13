class Reservation {

    constructor(){
        this._db = []
    }

    //Crud operations - The Create
    create( reservation, cb = null) {
        this._db.push(reservation);
        if( cb != null ) {
            cb( null, 'ok');
        }
    }

    readAll(cb){
        cb( null, this._db );
    }

    // The R in cRud - find on movie.id 
    read(id, cb) {
        this._db.find( (movie) => {
            if( movie.id === id) {
            cb(null, movie);
            }
        });
    }
}

module.exports = Reservation