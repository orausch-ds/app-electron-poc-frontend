const BASE_URL = 'http://localhost:9229';

async function loadOrderData() {
  await fetch(`${BASE_URL}/orders`, {
    method: 'GET',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const tableBody = document.getElementById('orderData');
    tableBody.innerHTML = '';

    data.forEach(order => {
      const row = tableBody.insertRow();
      ['id', 'itemName', 'pricePerUnit', 'amount', 'customerName', 'creationDate'].forEach(property => {
        const cell = row.insertCell();
        cell.appendChild(document.createTextNode(order[property]));
      });
      const cell = row.insertCell(); 
      cell.appendChild(createStyledDeleteButton(order['id']));
    });
  })
  .catch(error => {
    console.log('An error occurred.');
    console.log(error);
  });
}

function createStyledDeleteButton(orderIdToDelete) {
  const deleteButton = document.createElement("button");
  deleteButton.style.backgroundColor = "#ff0000";
  deleteButton.style.color = "#ffffff";
  deleteButton.style.border = "none";
  deleteButton.style.padding = "5px 10px";
  deleteButton.style.cursor = "pointer";
  deleteButton.innerHTML = 'X';
  deleteButton.addEventListener("click", async() => {
    await deleteOrder(orderIdToDelete);
    await loadOrderData();
  });

  return deleteButton
}

async function deleteOrder(orderId) {
  await fetch(`${BASE_URL}/orders/order/${orderId}`, {
    method: 'DELETE',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  })
}

async function createExampleOrder() {
  const order = {
    itemName: 'Random Item ' + (Math.floor(Math.random() * 10) + 1),
    pricePerUnit: (Math.floor(Math.random() * 10) + 1),
    amount: (Math.floor(Math.random() * 10) + 1),
    customerName: 'Max Mustermann',
  }

  await createOrder(order);
  await loadOrderData();
}


async function createOrder(order) {
  await fetch(`${BASE_URL}/orders/order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  })
  .then(response => {
    if (response.status !== 201) {
      throw new Error('Network response was not 201 (CREATED)');
    }
  })
}