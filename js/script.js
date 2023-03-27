document.addEventListener('DOMContentLoaded', function () {
    fillUserTable()  
    document.querySelectorAll('a').forEach((item) => {
        item.classList.remove("active")
        item.addEventListener('click', (event) => {
            fillUserTable()
            fillRoleTable()
            fillSemesterTable()
            document.querySelectorAll('a').forEach((item) => {
                item.classList.remove("active")
            })
            console.time(event);
            event.preventDefault();
            item.classList.add("active")
            const element = document.getElementById(`${event.target.dataset.id}`);
            if (element) {
                document.getElementById("main").innerHTML = element.innerHTML;
            }
        });
    });

}, false);