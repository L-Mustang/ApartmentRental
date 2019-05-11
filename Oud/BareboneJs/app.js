const Persons = require('./person');

//
const persons = new Persons();

function generateRandomName() {
    return 'M3N0x' + (Math.random() * 0xFFFF).toString(16).substr(0,4).toUpperCase();
}

// Main variable aan functie koppelen
const main = function (){

    console.log('Hello I 14 students, how are you');

    // Voeg persoon toe (met callback)
    persons.create('Robin', function() {
        console.log('Robin is toegevoegd')
    });

    // Voeg andere persoon toe (met callback fat arrow function
    persons.create('Diederich', () => {
        console.log('Diederich is toegevoegd')
    });

    // Voeg 10 personen toe
    for( let idx = 0; idx < 10; idx++ ) {
//       With callback
//       persons.create(generateRandomName(), () => {});
//       Without callback (optional in Persons)
       persons.create(generateRandomName());
    }

    // Display

    persons.read('Diederich', (err, result) => {
        if(!err) {
            console.log('Found ==> ' + result);
        } else {
            console.log('Ahhg ' + err.toString())
        }
    });


    console.log('Bye, we\'re done');
};

// En uitvoeren
main();

// // Korter maar ook cryptisch
// const _ = function (){
//     console.log('Hello CS students, how are you doing?');
// }();
//
// // En met evt een parameter
// const _ = function (name){
//     console.log('Hallo ' + name + ', welkom!');
// }('Diederich');

