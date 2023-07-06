







function addexpense(e)
{
    preventDefault();
       const expenseamount=e.target.expenseamount.value;
       const description=e.target.description.value;
       const category=e.target.category.value;

       expensedetails={
              expenseamount,
                   description,
                      category

       }
console.log(expensedetails);

const token =localStorage.setItem('token')
axois.post(`http://localhost:4000/expense/addexpense`,expensedetails,{headers:{'authorization':token}})
.then((response)=>{
    addnewexpensUi(response.data.expense)

}).catch(err=>{
    document.body.innerHTML+=`<div>${err}</div>`
})

function addnewexpensUi(expense)
{
const parententelement=document.getElementById('list of items')
const expenseelmentid=`expense-${expense.id}`

parententelement.innerHTML+=`<li id=expense-${expense.id}>${expense.expenseamount}-${expense.description}-${expense.category}
<button  onclick=deleeteexpense(event,${expense.id}) >deletebutton</button> </li>`

}


function removeelementfromscreen(expenseid)
{
    const expenseelmentid=`expense-${expenseid}`;
    document.getElementById(expenseelmentid).remove();

}



function deleeteexpense(e,expenseid)
{
    
    axois.delete(`http://localhost:4000/expense/addexpense`,{headers:{'authorization':token}})
    .then((response)=>{
        
        removeelementfromscreen(expenseid)
    }).catch(err=>{
        document.body.innerHTML+=`<div>${err}</div>`
    })

}

}