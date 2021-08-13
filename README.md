# Lottery contract
A lottlery app for blockchain

## Installation

Update the hardhat.config.js with your api key from ALCHEMY 


```bash
// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "ALCHEMY_API_KEY";

// Replace this private key with your Rinkeby account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const RINKEBY_PRIVATE_KEY = "RINKEBY_PRIVATE_KEY";
```

## Usage

```python
# Deploy on local
npm run localNode
npm run deploy:dev

# Deploy on Rinkeby
npm run deploy:rinkeby
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
