class Reservation {

    constructor(startDate, endDate, status, userId, apartmentId){
        this.startDate = startDate,
        this.endDate = endDate,
        this.status = status,
        this.userId = userId,
        this.apartmentId = apartmentId
    }
}

module.exports = Reservation