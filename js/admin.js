document.addEventListener('DOMContentLoaded', function () {
    fetch(localStorage.getItem('server_url') + 'api/all/checkuser', {
        headers: { Authentication: 'Bearer ' + sessionStorage.getItem('token') }
      }).then(function (response) {
        // The API call was successful!
        return response.json();
      }).then(function (data) {
        if (data.error) {
          swal(data.message, data.icon);
          location.href = data.route
        }else{
          document.getElementById("main").classList.remove("d-none")
        }
      }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
      });

}, false);

function fillUserTable() {
    fetch(localStorage.getItem('server_url') + 'api/admin/user', {
        headers: {Authentication: 'Bearer ' + sessionStorage.getItem('token')}
      }).then(function (response) {
        // The API call was successful!
        return response.json();
    }).then(function (data) {
        if(data.error){
            swal(data.message, data.icon);
            location.href = data.route
        }
        // This is the JSON from our response
        document.getElementById('user_list').innerHTML = ""
        data.forEach(element => {
            document.getElementById('user_list').innerHTML = document.getElementById('user_list').innerHTML +  line(element.id, element.name, element.email, element.satus ? '<i class="bg-success"></i> Active' : '<i class="bg-danger"></i> Disabled', element.roles.name, element.updated_at, element.roles.id, element.satus, element.matricule ? `( MAT : ${element.matricule} )` : '' )
        });
        if(document.getElementById('all_user')!==undefined){
            document.getElementById('all_user').innerHTML = data.length
        }
        clearFill()
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
    fillUserRoleSelect();
}

function fillUserRoleSelect() {

    fetch(localStorage.getItem('server_url') + 'api/admin/role', {
        headers: {Authentication: 'Bearer ' + sessionStorage.getItem('token')}
      }).then(function (response) {
        // The API call was successful!
        return response.json();
    }).then(function (data) {
        if(data.error){
            swal(data.message, data.icon);
            location.href = data.route
        }
        // This is the JSON from our response
        document.getElementById('admin_role_id_select').innerHTML = ""
        data.forEach(element => {
            document.getElementById('admin_role_id_select').innerHTML = document.getElementById('admin_role_id_select').innerHTML +  `<option value="${element.id}">${element.name}</option>`
        });
        document.getElementById('admin_role_id_select').onchange = function (){
            if(this.value=="3"){
                document.getElementById("matricule").classList.remove("d-none")
            }else{
                document.getElementById("matricule").classList.add("d-none")
            }
        }
        
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });

}

function updateUser(id, name, email, status, role) {
    if(document.getElementById('id').value===""){
        document.getElementById('admin_role_id_select').value = role
        document.getElementById('id').value = id
        document.getElementById('name').value = name
        document.getElementById('email').value = email
    }else{
        clearFill()
    }
}

function clearFill(){
    document.getElementById('admin_role_id_select').value = 3
        document.getElementById('id').value = ""
        document.getElementById('name').value = ""
        document.getElementById('email').value = ""
}


function line(id, name, email, status, role, updated_at, role_id, state, matricule){
return `<tr>
<td>
  <a class="text-heading font-semibold" href="#">
    ${id}
  </a>
</td>
<td>${name}</td>
<td>
  <a class="text-heading font-semibold" href="#">
  ${email}
  </a>
</td>
<td>${role} ${matricule}</td>
<td>
<form id="update_status${id}" data-action="api/admin/user/update/status" method="POST">
    <input type="hidden" name="id" value="${id}" />
    <input type="hidden" name="status" value="${state}" />
    <button id="btn_update_status${id}"
        type="button" onclick="submitForm('update_status${id}', 'btn_update_status${id}');"
        class="btn btn-sm btn-square btn-neutral text-danger-hover bg-transparent border-none"> 
        <span class="badge badge-lg badge-dot">
            ${status}
        </span>
    </button>
</form>
</td>
<td>${updated_at}</td>

<td class="text-end d-flex">
  <button  onclick="updateUser('${id}', '${name}', '${email}', '${state}', '${role_id}')"
    type="button"
    class="btn btn-sm btn-square btn-neutral text-danger-hover"
  >
    <i class="bi bi-pencil"></i>
  </button>
  <form id="del_user_form${id}" data-action="api/admin/user/delete" method="POST">
  <input type="hidden" name="id" value="${id}" />
  <button id="btn_del_user_form${id}"
    type="button" onclick="submitForm('del_user_form${id}', 'btn_del_user_form${id}');"
    class="btn btn-sm btn-square btn-neutral text-danger-hover"
  >
    <i class="bi bi-trash"></i>
  </button>
  </form>
</td>
</tr>`
}
