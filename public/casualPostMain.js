
const casualPostDlt = document.querySelectorAll('.casual-delete-Btn')
const likesCas = document.querySelectorAll('.like-btn')

Array.from(casualPostDlt).forEach(el=>{
    el.addEventListener('click', removePost)
})

Array.from(likesCas).forEach(el=>{
    el.addEventListener('click', likeCasualPost)
})


// JS function for my back-end logic below here
async function removePost(event) {
   const element = event.currentTarget;
   const id = element.dataset.id;
   const casualDel = id.trim()
// we can use the above code to make it safe to get the dataset ID from our ejs file(this target the the thing we want, 
// not looking the parentNode, this parentNode fail if the tag is not in that parentNode/parent element)
//but the above works everywhere, because it target the tag simply

   // const casualDel = this.parentNode.dataset.id.trim()
        
    try{
        const result = await fetch('/feedPage/removeCasual',{ 
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                deleteCasual: casualDel
            })
        })
        const data = await result.json()
        console.log(data)
        if (result.ok) location.reload();

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