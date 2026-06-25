 // 1. Listen for clicks on the entire table body instead of individual buttons

const tableBody = document.querySelector('#youthList');

tableBody.addEventListener('click', (e) => {
    // Check if what I clicked is a trash button (or inside one)
    const trashBtn = e.target.closest('.trash');
    if (trashBtn) {
        deleteMember(trashBtn);
    }
});

// 2. Adjust the function to accept the clicked button element
async function deleteMember(buttonElement){
    const nearest = buttonElement.closest('tr');
    const  removeOne = nearest.dataset.id;
    
    // Quick confirmation safety check
    if (!confirm("Are you sure you want to delete this member?")) return;

    try{
        const result = await fetch('/youth/removeYouthUnder18', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'deleteUnder18Youth' : removeOne
            })
        })
        const data = await result.json()
        console.log(data)
        location.reload() // This reloads and resets the table
    } catch(err){
        console.error(err)
    }
}

// i don't use EvenListener because i use onClick attribute in EJs template button
async function searchMember(){
  const keyboard = document.querySelector('#searchInput').value
  const tableBody = document.querySelector('.youthForm')

//if search input is empty, i might want to reload the page to show everyone again
  if(!keyboard.trim()){
    location.reload();
    return;
  }
  try{
    const respond = await fetch(`/youth/searchUnder?under18=${keyboard}`)
    const data = await respond.json()

    //Clear the current table content
    tableBody.innerHTML = "";
    if(data.length === 0){
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;"> No matching members found. </td> </tr>`;
      return;
    }
      // loop through the search results and dynamically build rows match my columns

      data.forEach(user => {
        const row =`
        <tr>
          <td>${user.youthFullName}</td>
          <td>${user.youthAge}</td>
          <td>${user.youthGender}</td>
          <td>${user.youthPhone}</td>
          <td><button class="trash">Delete</button></td>
        </tr> `
        tableBody.insertAdjacentHTML('beforeend', row)
      })
    console.log(data)

  } catch(err){
    console.error(err)
  }
}

/* async function deleteMember(id) {
  if(!confirm("Are you sure you want to delete this member?")){
    return;
  }
  try{
    const respond = await fetch('/memberList/removeMembers',{
      method: 'delete',
      headers:'Content-Type': 'application/json',
      body: JSON.stringify({
        id: id   // sending the id in the request body
      })
    })
    if(respond.ok){
      //1.Remove the row visually from the table
      const rowElement = document.getElementById(`row-${id}`)
      if(rowElement){
        rowElement.remove()
        //Automatically update total member count Element
        const totalCount = document.getElementById('totalCounter')
        if(totalCount){
          let currentCount = parseInt(totalCount.innerText)
          totalCount.innerText = currentCount - 1
        } else{
          alert("Failed to delete the member from database.")
        }
      }
    }
  } catch(err){
    console.error('Error deleting member:', err)
  }
} */
