
const casualPostDlt = document.querySelectorAll('.delete-Btn')
const likesCas = document.querySelectorAll('.like-btn')

Array.from(casualPostDlt).forEach(el=>{
    el.addEventListener('click', removePost)
})

Array.from(likesCas).forEach(el=>{
    el.addEventListener('click', likeCasualPost)
})


// JS function for my back-end logic below here
async function removePost() {
    const casualDel = this.parentNode.dataset.id.trim()

// we can use instead of the above both work properly.
  //  const element = event.currentTarget;
  //  const id = element.dataset.id;
  //  const postDel = id.trim()

    try{
        const result = await fetch('/feedPage/removeCasual',{ // this will be ('/feedPage/remove') when i merge it 
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                deleteCasual: casualDel
            })
        })
        const data = await result.json()
        console.log(data)
        location.reload()

    } catch (err) {
        console.error(err)
    }
}

async function likeCasualPost (){

    const casualLikes = this.parentNode.dataset.id.trim()

// we can use instead of the above both work properly.
    //const element = event.currentTarget;
    //const id = element.dataset.id;
    //const likeS = id.trim()

    try{
        const result = await fetch('/feedPage/likeCasual',{    // this will be ('/feedPage/like') when i merge it 
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({
                likeCasual: casualLikes
            })
        })
        const data = await result.json()
        console.log(data)
        location.reload()

    } catch(err){
        console.error(err)
    }
}