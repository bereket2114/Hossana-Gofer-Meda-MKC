/* const API = "http://localhost:5000/api/members";

const memberForm = document.getElementById("memberForm");
const memberList = document.getElementById("memberList");


// Fetch Members
async function fetchMembers() {

  const res = await fetch(API);
  const members = await res.json();

  memberList.innerHTML = "";

  members.forEach(member => {

    memberList.innerHTML += `
      <tr>
        <td>${member.name}</td>
        <td>${member.age}</td>
        <td>${member.sex}</td>
        <td>${member.phone}</td>
        <td>${member.sector}</td>

        <td>
          <button class="delete-btn" onclick="deleteMember('${member._id}')">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}


// Add Member
memberForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const newMember = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    sex: document.getElementById("sex").value,
    phone: document.getElementById("phone").value,
    sector: document.getElementById("sector").value
  };

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newMember)
  });

  memberForm.reset();

  fetchMembers();
});


// Delete Member
async function deleteMember(id){

  await fetch(`${API}/${id}`, {
    method:"DELETE"
  });

  fetchMembers();
}


fetchMembers();   */