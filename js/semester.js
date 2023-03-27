function fillSemesterTable() {
  fetch(localStorage.getItem('server_url') + 'api/admin/semester', {
    headers: { Authentication: 'Bearer ' + sessionStorage.getItem('token') }
  }).then(function (response) {
    // The API call was successful!
    return response.json();
  }).then(function (data) {
    if (data.error) {
      swal(data.message, data.icon);
      location.href = data.route
    }
    // This is the JSON from our response
    document.getElementById('semester_list').innerHTML = ""
    data.forEach(element => {
      console.log(element)
      document.getElementById('semester_list').innerHTML = document.getElementById('semester_list').innerHTML + lineSemester(element.id, element.name, element.status ? '<i class="bg-success"></i> Active' : '<i class="bg-danger"></i> Disabled', element.updated_at, element.status)
    });
  }).catch(function (err) {
    // There was an error
    console.warn('Something went wrong.', err);
  });
}


function updateSemester(id, name, state) {
  if (document.getElementById('id').value === "") {
    document.getElementById('id').value = id
    document.getElementById('name').value = name
    document.getElementById('state').value = state
  } else {
    clearsemesterFill()
  }
}

function clearsemesterFill() {
  document.getElementById('id').value = id
  document.getElementById('name').value = name
  document.getElementById('state').value = state
}


function lineSemester(id, name, status, updated_at, state) {
  return `<tr>
<td>
<a class="text-heading font-semibold" href="#">
  ${id}
</a>
</td>
<td>${name}</td>
<td>
<form id="update_status${id}" data-action="api/admin/semester/update/status" method="POST">
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
<button  onclick="updateSemester('${id}', '${name}', '${state}')"
  type="button"
  class="btn btn-sm btn-square btn-neutral text-danger-hover"
>
  <i class="bi bi-pencil"></i>
</button>
<form id="del_semester_form${id}" data-action="api/admin/semester/delete" method="POST">
<input type="hidden" name="id" value="${id}" />
<button id="btn_del_semester_form${id}"
  type="button" onclick="submitForm('del_semester_form${id}', 'btn_del_semester_form${id}');"
  class="btn btn-sm btn-square btn-neutral text-danger-hover"
>
  <i class="bi bi-trash"></i>
</button>
</form>
</td>
</tr>`
}
