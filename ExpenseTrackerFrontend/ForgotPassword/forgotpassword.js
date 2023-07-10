// const forgotpassword = async(event) => {
//     event.preventDefault();

//     const form = new FormData(event.target);
    
//     const userDetails = {
//         email : form.get('email')
//     }

//     // console.log('user details',userDetails)
//     const token = localStorage.getItem('token');
//     axios.post('http://localhost:4000/password/forgotpassword',userDetails,{ headers: { Authorization: token } }).then(response => {
//         console.log (response.status)
//         if(response.status === 202){
//             document.body.innerHTML += '<div style="color:red;">Mail Successfully sent <div>'
//         } else {
//             throw new Error('Something went wrong!!!')
//         }
//     }).catch(err => {
//         console.log(err)
//         document.body.innerHTML += `<div style="color:red;">${err} <div>`;
//     })
// }