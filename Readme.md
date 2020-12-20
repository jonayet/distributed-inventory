# Distributed inventory service

### How to run the service in Development mode?
Use **Docker**
```shell
docker-compose -f docker-compose-dev.yaml up
```

Or **NodeJs**  
First run the product-engine service then start the dev server.
```shell
docker run adichallenge/adichallenge:product-engine
npm install && npm run dev
```
<br/><br/>

### How to run the service in Production mode?
Use **Docker**
```shell
docker-compose up
```

Or **NodeJs**  
First run the product-engine service then start the prod server.
```shell
docker run adichallenge/adichallenge:product-engine
npm install && npm run build && npm start
```
<br/><br/>

### How to test the specs?
Use **Docker**
```shell
docker-compose -f docker-compose-test.yaml up
```

Or **NodeJs**
```shell
npm install && npm test
```
<br/><br/>

## Solution architecture
See the architecture [here](docs/architecture.md)
<br/><br/>

## Interacting with the service
First run the inventory service in [Development](#How-to-run-the-service-in-Development-mode?) or [Production](#How-to-run-the-service-in-Production-mode?) mode.

Swagger document can be found here: https://jonayet.github.io/distributed-inventory

Provide a authentication token in **access_token** parameter in the query.  
Token parameter is a simple string which will be used to identify the user.  
Example: user-1  
If not provided an unauthenticated error will be send.
<br/><br/>

### Get Inventory
<br/>

When a client wants to get the inventory they need to make  
a GET call to http://localhost:8080?token=user-1&client=web&lang=en-us&count=5&page=0

#### Request parameters  
* **client**  
Client parameter is used to identify the client. It can be **web** or **mobile**.  
This is an optional parameter, **web** will be used by default.

* **lang**  
Lang parameter is used to select the currency for price.  
This is an optional param. default value is **en-us**.

* **count**  
Count is used to determine how many quantity will be send.
Its default value is **5**.

* **page**  
Page is used to determine to find which segment of data will be provided.  
<br/>
For example,  
Lets say total number of inventory is 30. If **count** is 10, there will be 3 page segments.  
In this case, valid page **value** are be 0, 1 and 2.
<br/><br/>

#### Example Response
```javascript
{
  inventory: [
    {
      productId: '100',
      available: 5,
      price: 10
    },
    {
      productId: '101',
      available: 8,
      price: 4
    },
    {
      productId: '102',
      available: 13,
      price: 12
    }
  ],
  currency: '$',
  $pagination: {
    remainingItems: 0
  }
}
```
<br/><br/>

### Consume Inventory
<br/>

Now lets say **user-1** wants to order **2** quantity of product **102**(productId).  
This will be a POST call to http://localhost:8080/order?token=user-1&client=web
with following payload.

#### Request parameters,
* **client**  
Client parameter is used to identify the client. It can be **web** or **mobile**.  
This is an optional parameter, **web** will be used by default.

Payload
```javascript
[
  {
    productId: '101',
    quantity: 2
  },
  {
    productId: '102',
    quantity: 1
  }
]
```
<br/><br/>
After this point 3 different things can happen.

1) All the items has sufficent quantity and can be baught successfully.  
In this case success response will be send.

2) None of the items has sufficient quantity.  
In this case error message will be send.

3) Some of the items as sufficient quantity and some doesn't has.  
In this case eligible items will be hold for 5 minutes in requested quantity  
and following respons will be send,

```javascript
{
  availableItems: [
    {
      productId: '102',
      quantity: 1
    }
  ],
  unavailableItems: [
    {
      productId: '101',
      quantity: 2
    }
  ],
  confirmation: {
    confirm: '/confirm/ae23fcc2',
    cancel: '/cancel/ae23fcc2',
    status: '/status/ae23fcc2'
    validTill: '2018-04-23T10:26:00.996Z'
  }
}
```
<br/><br/>
Now user have 2 options,  
1) They can confirm the order by making a POST call to http://localhost:8080/confirm/ae23fcc2?token=user-1&client=mobile
2) Or they can cancel the order by making a POST call to http://localhost:8080/cancel/ae23fcc2?token=user-1&client=mobile
<br/><br/>

To check the validity of a pending order client can make a Get call to http://localhost:8080/status/be23dcc3?token=user-1&client=web.  
This endpoint will return following response.

```javascript
{
  availableItems: [
    {
      productId: '102',
      quantity: 1
    }
  ],
  unavailableItems: [
    {
      productId: '101',
      quantity: 2
    }
  ],
  confirmation: {
    confirm: '/confirm/ae23fcc2',
    cancel: '/cancel/ae23fcc2',
    status: '/status/ae23fcc2'
    validTill: '2018-04-23T10:26:00.996Z'
  }
}
```
<br/>

Finally, client can check anytime if an user has any pending order by making a Get call to http://localhost:8080/pending?token=user-1&client=web.  
Which will give followign response.
```javascript
{
  pendingOrders: [
    {
      orderId: 'ae23fcc2',
      validTill: '2018-04-23T10:26:00.996Z'
    },
    {
      orderId: 'be23dcc3',
      validTill: '2018-04-23T10:26:00.996Z'
    }
  ]
}
```