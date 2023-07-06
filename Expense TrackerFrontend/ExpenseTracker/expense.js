function addNewExpense(e) {
  e.preventDefault();

  const expenseDetails = {
    expenseamount: e.target.ExpenseAmount.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };
  console.log(expenseDetails);

  const token = localStorage.getItem('token');
  axios
    .post('http://localhost:4000/expense/addexpense', expenseDetails, { headers: { Authorization: token } })
    .then((response) => {
      addNewExpensetoUI(response.data.expense);
    })
    .catch((err) => showError(err));
}

function addNewExpensetoUI(expense) {
  const parentElement = document.getElementById('list-group');
  const expenseElemId = `expense-${expense.id}`;
  parentElement.innerHTML += `
      <li id=${expenseElemId}>
          ${expense.expenseamount} - ${expense.category} - ${expense.description}
          <button onclick='deleteExpense(event, ${expense.id})'>
              Delete Expense
          </button>
      </li>`;
  
  // Save the expense details in local storage
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function deleteExpense(e, expenseid) {
  console.log('hi');
  const token = localStorage.getItem('token');
  axios
    .delete(`http://localhost:4000/expense/deleteexpense/${expenseid}`, { headers: { Authorization: token } })
    .then((response) => {
      removeExpensefromUI(expenseid);
    })
    .catch((err) => {
      showError(err);
    });
}

function showError(err) {
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`;
}

function removeExpensefromUI(expenseid) {
  const expenseElemId = `expense-${expenseid}`;
  document.getElementById(expenseElemId).remove();
  
  // Remove the expense details from local storage
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const updatedExpenses = expenses.filter((expense) => expense.id !== expenseid);
  localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
}

document.getElementById('rzp-button1').onclick = async function (e) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:4000/purchase/premiummembership', {
      headers: { Authorization: token },
    });

    const options = {
      key: response.data.key_id,
      name: 'kiran Tracker App',
      order_id: response.data.order.id,
      prefill: {
        name: 'KIRAN',
        email: 'kirankiranbangbang@gmail.com',
        contact: '9036593533',
      },
      handler: async function (response) {
        // Handle the success payment
        const res = await axios.post(
          'http://localhost:4000/purchase/updatetransactionstatus',
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );

        console.log(res);

        alert('You are a Premium User Now');
        document.getElementById('rzp-button1').style.visibility = 'hidden';
        document.getElementById('message').innerHTML = 'You are a premium user ';
        localStorage.setItem('token', res.data.token);
        showLeaderboard();

      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', function (response) {
      console.log(response);
      alert('Something went wrong');
    });
  } catch (error) {
    console.error(error);
    alert('Error occurred while processing the payment');
  }
};

function showPremiumUserMessage() {
  document.getElementById('rzp-button1').style.visibility = 'hidden';
  document.getElementById('message').innerHTML = 'You are a premium user';
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  var jsonPayload = decodeURIComponent(
    window.atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const pageSize = localStorage.getItem('pageSize');
    const token = localStorage.getItem('token');
    const page = 1;
    const decodeToken = parseJwt(token);

    console.log(decodeToken);
    const isPremiumUser = decodeToken.ispremiumuser;

    if (isPremiumUser) {
      showPremiumUserMessage();
      showLeaderboard();
    }
    
    // Clear existing expense data
    const parentElement = document.getElementById('list-group');
    parentElement.innerHTML = '';

    // Load and display the expense data from local storage
    const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.forEach((expense) => addNewExpensetoUI(expense));
  } catch (err) {
    console.log('Error in express.js in window.addEventListener() in frontend', err);
  }
});


function showLeaderboard() {
  const leaderboardElem = document.getElementById('leaderboard');
  leaderboardElem.innerHTML = ''; // Clear previous leaderboard data

  const inputElement = document.createElement('input');
  inputElement.type = 'button';
  inputElement.value = 'Show Leaderboard';
  inputElement.style.backgroundColor = 'gold';

  inputElement.style.borderRadius = '15px';
  inputElement.style.padding = '8px';
  inputElement.style.marginLeft = '100px';
  inputElement.style.justifyContent='center'

  inputElement.onclick = async () => {
    const token = localStorage.getItem('token');
    const userLeaderBoardArray = await axios.get('http://localhost:4000/premium/showLeaderBoard', {
      headers: { Authorization: token },
    });
    console.log(userLeaderBoardArray);

    leaderboardElem.innerHTML += '<h1> Leader Board </h1>';
    userLeaderBoardArray.data.forEach((userDetails) => {
      leaderboardElem.innerHTML += `<li>Name -> ${userDetails.name} -> Total Expense -> ${userDetails.totalExpenses || 0} </li>`;
    });
  };

  document.getElementById('message').appendChild(inputElement);
}
