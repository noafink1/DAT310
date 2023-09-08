"use strict";

//Entry object
class Entry {
    constructor(name, tel, email) {
        this.name = name;
        this.tel = tel;
        this.email = email;
    }
}

//List that contains objects
let entries = [];

//Default objects
let person1 = new Entry("Noa", "+4791665573", "noa@finkenhagen.com");
let person2 = new Entry("Andreas", "+4790419960", "andreas.f.werner@gmail.com");
let person3 = new Entry("Kim", "+4740012666", "finkenhagen@hotmail.com");
let person4 = new Entry("Anders", "+4728492374", "anders@gmail.com");

entries = [person1, person2, person3, person4];

//Calls addEntry function when form is submitted
let form = document.querySelector("form[name='entry-form']");
form.onsubmit = addEntry;

//Adds eventlistener to search input
let search = document.querySelector("#search-input");
search.addEventListener("keyup", searchFunc);

//Shows all entries that lies in entries list
showEntries(entries);

//Hides edit element
let editEl = document.getElementById("edit").style.display="none";

//Function that adds new entry
function addEntry(event) {
    event.preventDefault();
    const nameEl = document.getElementById("entryName");
    const telEl = document.getElementById("entryTel");
    const emailEl = document.getElementById("entryEmail");

    let name = nameEl.value;
    let tel = telEl.value;
    let email = emailEl.value;

    if(validateEntry(name, tel, email)) {
        //Conditions:
        // - Name cant be empty
        // - Email OR tel has to have entry
        // - Email must be valid email
        // - Tel must only contain: numbers, +-() and space
        //If every condition is passed, add person to entries list and show persons on page 
        let person = new Entry(name, tel, email);
        entries.push(person);
        showEntries(entries);
        nameEl.value = "";
        emailEl.value = "";
        telEl.value = "";
    }
}

//Shows all entries on page
function showEntries(entries) {
    //Sets main div (made in index.html) to blank
    const main_content = document.getElementById("main_content");
    main_content.innerHTML = "";

    //Creates html elements for all entries
    for(let i = 0; i < entries.length; i++) {
        const person_info = document.createElement("div");
        person_info.classList.add("person-info");
        person_info.innerHTML = `
        <a class="edit_container"><i class="material-icons" id="edit">edit</i></a>
        <a class="del_container"><i class="material-icons" id="delete">delete</i></a>
        <h3>${entries[i].name}</h3>
        <p>${entries[i].tel}</p>
        <p><a href = "mailto: ${entries[i].email}">${entries[i].email}</a></p>`;

        //Calls delEntry when clicked on delete icon
        let delEl = person_info.querySelector(".del_container #delete");
        delEl.addEventListener("click", () => {
            delEntry(i)
        });

        let editEl = person_info.querySelector(".edit_container #edit");
        editEl.addEventListener("click", () => {
            editEntry(i)
        });

        //Appends to main div
        main_content.appendChild(person_info);
    }
}

function validateEntry(name, tel, email) {

    if(name.length == 0) {
        //Name is empty
        alert("You must enter a name in the name field!");
        return false;  
    } else if(tel.length == 0) {
        //Tel is empty
        if(email.length == 0) {
            //Tel and email is empty
            alert("You must enter an email or telephone number!");
            return false;    
        } else {
            //ONLY tel is empty
            if(validateEmail(email)) {
                //Email is valid
                return true;
            } else {
                //Email is not valid
                alert("Email is not valid!");
                return false;
            }
        }
    } else if(email.length == 0){
        //Email is empty
        if(tel.length == 0) {
            //Email and tel is empty
            alert("You must enter an email or telephone number!");
            return false;
        } else {
            //ONLY email is empty
            if(validateTel(tel)) {
                //Tel is valid
                return true;
            } else {
                //Tel is not valid
                alert("Telephone number is not valid!");
                return false;
            }
        }
    } else {
        //Email and tel has entries
        if(!validateEmail(email)) {
            //Email is not valid
            alert("Email is not valid!");
            return false;
        } else if(!validateTel(tel)) {
            //Tel is not valid
            alert("Telephone number is not valid!");
            return false;
        } else {
            //Email and tel is valid
            return true;
        }
    }
}

//Functions that checks if email is valid upon adding a new entry
function validateEmail(email) {
    // Code inspiration: https://stackoverflow.com/questions/46155/whats-the-best-way-to-validate-an-email-address-in-javascript

    let validInput = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(validInput)) {
        return true;
    } else {
        return false;
    }
}

//Functions that checks if tel is valid upon adding a new entry
function validateTel(tel) {
    let validInput = /^[0-9 ()+-]*$/;
    if(tel.match(validInput)) {
        return true;
    } else {
        return false;
    }
}

//Function that deletes entry from list and updates page when clicked on delete icon
function delEntry(i) {
    if(confirm("Are you sure you want to delete this entry?")) {
        entries.splice(i,1);
        showEntries(entries);
    }
}

//Function that searches for elements given by input
function searchFunc() {
    let filter = search.value;
    let search_entries = [];

    for(let i = 0; i < entries.length; i++) {
        if(entries[i].name.indexOf(filter) > -1 || entries[i].email.indexOf(filter) > -1 || entries[i].tel.indexOf(filter) > -1) {
            search_entries.push(entries[i]);
        }
    }
    showEntries(search_entries);
}

function editEntry(i) {
    editEl = document.getElementById("edit").style.display="";
    const nameEl = document.getElementById("editName");
    const telEl = document.getElementById("editTel");
    const emailEl = document.getElementById("editEmail");
    const sbmEl = document.getElementById("editButton");

    nameEl.value = entries[i].name;
    telEl.value = entries[i].tel;
    emailEl.value = entries[i].email;

    sbmEl.addEventListener("click", () => {
        let name = nameEl.value;
        let tel = telEl.value;
        let email = emailEl.value;

        if(validateEntry(name, tel, email)) {
            entries[i].name = name;
            entries[i].tel = tel;
            entries[i].email = email;
            editEl = document.getElementById("edit").style.display="none";
            showEntries(entries);
        }
    });
}
