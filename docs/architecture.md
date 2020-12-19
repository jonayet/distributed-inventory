# Distributed inventory service solution architecture

The solution is divided into two major parts to respect the separation of concerns.
1) **Platform components**
2) **Inventory Service**
<br/><br/>

### Platform components
* **@platform/persistence**  
Provides persistence functions for different services and abstracts the underlying database implemention.

* **@platform/cache**  
Provides caching function for different services and abstracts the underlying cache implementions.  

* **@platform/distribute-lock**  
Provides a central lock manager to orchrastrate underlying infrastructure in a distribute environment.
<br/><br/>

### Inventory service
* **Controller**  
Defines the endpoints with appropriate HTTP methods and uses Service to implement them  

* **Service**  
Uses Inventory and Price repository and build the response  

* **Price repository**  
Incorporates Caching layer, Price service and distributed lock to get/set the price data for a product  

* **Inventory repository**  
Incorporates Caching layer, Persistence layer and distributed lock to get/set the inventory  

* **Auth-Middleware**  
Defines the authentication middleware that guards endpoints agains unauthorized access  

* **Routes**  
Defines the endponts for the inventory services  

* **App**  
Incorporate express.js framework to start the http service
<br/><br/>

### Inventory service flows

#### Get inventory flow
<img src="./get-inventory.png?raw=true" width="300" title="Get inventory">
<br/><br/>
  
#### Get price flow
<img src="./get-price.png?raw=true" width="200" title="Get price">
<br/><br/>

#### Consume inventory flow
<img src="./consume-inventory.png?raw=true" width="400" title="Consume inventory">
<br/><br/>

#### Update stock flow
<img src="./update-stock.png?raw=true" width="200" title="Update stock">