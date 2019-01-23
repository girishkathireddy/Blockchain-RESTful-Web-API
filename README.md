# Private Blockchain
Project developed using Node.js Express Framework to interfaces with the private blockchain.

REST API has two endpoints
1. GET Block at http://localhost:8000/block
2. POST Block at http://localhost:8000/block

## Setup 

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node simpleChain.js__ in the root directory.


## Testing the project

Test the project using Postman at endpoint http://localhost:8000/block using GET and Post calls.

### GET example 

GET Block at http://localhost:8000/block/0

__Response__

```
{
    "hash": "83057494513ec2f5c01fa929f673f8537ba8de7e6f100c9878aa2ef7d755ccb6",
    "height": 0,
    "body": "Genesis block",
    "time": "1548225810",
    "previousBlockHash": ""
}
```
### POST example 

POST block at http://localhost:8000/block/

__Input__ 
```
{
    "data":"block 1"
}
```
__Response__

```
{
    "hash": "ad9a0bf85af3b62c3779ff07981282e61d235c6179efa3622080432d32feaa04",
    "height": 1,
    "body": "Test Data #block 1",
    "time": "1548225985",
    "previousBlockHash": "83057494513ec2f5c01fa929f673f8537ba8de7e6f100c9878aa2ef7d755ccb6"
}
```


