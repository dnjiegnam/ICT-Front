localStorage.setItem('server_url', 'http://127.0.0.1:8000/')
// WARNING: For POST requests, body is set to null by browsers.
function submitForm(formId, btnId, url, method) {

    url = localStorage.getItem('server_url') + document.getElementById(formId).dataset.action;
    
    method = document.getElementById(formId).method;

    if (formId) {

        btnId = `btn_${formId}`

        btn_login_form = document.getElementById(btnId)

        old_content = btn_login_form.innerHTML
        
        btn_login_form.innerHTML = '<i class="fa fa-circle-o-notch fa-spin" style="font-size:24px"></i>'
        
        var params = serialize(new FormData(document.getElementById(formId)));
    
    }

    var http = new XMLHttpRequest();

    http.open(method, url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.setRequestHeader('Authentication', 'Bearer ' + sessionStorage.getItem('token'));

    http.onreadystatechange = function () {

        //Call a function when the state changes.
        if (http.readyState == 4) {

            const response = JSON.parse(http.responseText);

            if (response.message) {
                swal(response.message, response.icon)
            }

            if (response.token) {
                sessionStorage.setItem("token", response.token.toString());
                sessionStorage.setItem("role", response.role.toString());
            }

            if (formId) {
                btn_login_form.innerHTML = old_content
            }

            if (response.role) {
                location.href = "pages/"+response.role.toLowerCase()
            }

            if (response.logout) {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("role");
                location.href = response.logout
            }

            if (response.notes) {
                response.notes.forEach(element => {
                   document.getElementById("notes_list").innerHTML = document.getElementById("notes_list").innerHTML + fillNotes(element.id, element.lecturer.name, element.semester.name, element.note, element.updated_at ?? '')
                });
            }

            try {
                fillUserTable()
                fillRoleTable()
                fillSemesterTable()
            } catch (error) {
                
            }


        }


    };

    http.send(params);
}

function swal(message, icon) {

    Swal.mixin({
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: message.length * 100,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    })
        .fire({
            icon: icon,
            title: message,
        })
        .then(() => {
            try {
                handleLoader();
            } catch (error) {
                
            }
        });
}

function serialize(data) {
    let resutl = "";
    for (let [key, value] of data) {
        resutl += `${key}=${value}&`
    }
    return resutl.slice(0, -1);
}
