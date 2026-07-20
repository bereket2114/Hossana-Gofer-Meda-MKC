
const postDlt = document.querySelectorAll('.delete-Btn')
const likes = document.querySelectorAll('.like-Btn')

Array.from(postDlt).forEach(el=>{
    el.addEventListener('click', removePost)
})

Array.from(likes).forEach(el=>{
    el.addEventListener('click', likePost)
})


// JS function for my back-end logic below here
async function removePost() {
    const postDel = this.parentNode.dataset.id.trim()

// we can use instead of the above both work properly.
  //  const element = event.currentTarget;
  //  const id = element.dataset.id;
  //  const postDel = id.trim()

    try{
        const result = await fetch('/feedPage/remove',{ 
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                deletePost: postDel
            })
        })
        const data = await result.json()
        console.log(data)
        location.reload()

    } catch (err) {
        console.error(err)
    }
}

async function likePost (){

    const likeS = this.parentNode.dataset.id.trim()

// we can use instead of the above both work properly.
    //const element = event.currentTarget;
    //const id = element.dataset.id;
    //const likeS = id.trim()

    try{
        const result = await fetch('/feedPage/like',{    // this will be ('/feedPage/like') when i merge it 
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify({
                likePost: likeS
            })
        })
        const data = await result.json()
        console.log(data)
        location.reload()

    } catch(err){
        console.error(err)
    }
}