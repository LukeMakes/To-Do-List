$(document).ready(function () {

    //Select the Elements
    const dateElement = document.getElementById("date");
    const dayElement = document.getElementById("day");
    const clear = document.querySelector(".clear");
    const list = document.getElementById("list");
    const input = document.getElementById("input");

    //Classes Names
    const check = "fa-check-circle";
    const uncheck = "fa-circle-thin";
    const LineThrough = "lineThrough";

    // Variables
    let LIST, id;
    let checkCount = 0,
        total = 0;

    // Update Counter Function
    function updateText() {
        $('#total_count').text(total);
        $('#done_count').text(checkCount);
        $('#remaining_tasks').text(total - checkCount);
    }

    // get item from localstorage
    let data = localStorage.getItem("TODO");

    // check if data is not empty
    if (data) {
        LIST = JSON.parse(data);
        id = LIST.length; // set the id to the last one in the list
        loadList(LIST); // load the list to the user interface
    } else {
        // if data isn't empty
        LIST = [];
        id = 0;
    }

    // load items to the user's interface
    function loadList(array) {
        array.forEach(function (item) {
            addToDo(item.name, item.id, item.done, item.trash);
        });
    }

    // clear the local storage
    clear.addEventListener("click", function () {
        localStorage.clear();
        location.reload();
    });

    // Show the Current Day
    const weekOptions = {
        weekday: "long"
    };
    const weekday = new Date();


    // Show the Current Date
    const options = {
        day: "numeric",
        month: "long",
        year: "numeric"
    };
    const today = new Date();

    dayElement.innerHTML = weekday.toLocaleDateString("en-ZA", weekOptions);

    dateElement.innerHTML = today.toLocaleDateString("en-ZA", options);


    // add to do function
    function addToDo(toDo, id, done, trash) {

        if (trash) {
            return;
        }

        const DONE = done ? check : uncheck;
        const LINE = done ? LineThrough : "";

        const item = `<li class="item">
                    <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                    <p class="text ${LINE}">${toDo}</p>
                    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                  </li>
                `;

        const position = "beforeend";

        list.insertAdjacentHTML(position, item);
    }

    // add an item to the list user the enter key
    document.addEventListener("keyup", function (even) {
        if (event.keyCode == 13) {
            const toDo = input.value;

            // if the input isn't empty
            if (toDo) {
                addToDo(toDo, id, false, false);

                LIST.push({
                    name: toDo,
                    id: id,
                    done: false,
                    trash: false
                });

                // add item to localstorage ( this code must be added where the LIST array is updated)
                localStorage.setItem("TODO", JSON.stringify(LIST));

                id++;
            }
            input.value = "";
        }
    });


    // complete to do
    function completeToDo(element) {
        element.classList.toggle(check);
        element.classList.toggle(uncheck);
        element.parentNode.querySelector(".text").classList.toggle(LineThrough);

        LIST[element.id].done = LIST[element.id].done ? false : true;
    }

    // remove to do
    function removeToDo(element) {
        element.parentNode.parentNode.removeChild(element.parentNode);

        LIST[element.id].trash = true;
    }

    // target the items created dynamically
    list.addEventListener("click", function (event) {
        const element = event.target; // return the clicked element inside list
        const elementJob = element.attributes.job.value; // complete or delete

        if (elementJob == "complete") {
            completeToDo(element);
        } else if (elementJob == "delete") {
            removeToDo(element);
        }

        // add item to localstorage ( this code must be added where the LIST array is updated)
        localStorage.setItem("TODO", JSON.stringify(LIST));
    });

});