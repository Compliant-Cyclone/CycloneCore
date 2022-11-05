import { ethers } from "ethers";
import Cors from 'cors'
import initMiddleware from '../../../lib/init-middleware'

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    origin: "*",
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

export default async function (req, res) {

await cors(req, res)

const provider = new ethers.providers.InfuraProvider("goerli", process.env.INFURA_KEY);

const USDT_CONTRACT = "0xA1Ff332f03f3A1410f2A8Ac7DB2c4724AC01B7b0";

const USDT_SENDER_PRIVATE_KEY = process.env.USDT_SENDER_PRIVATE_KEY;

const getUSDTBalance = async (wallet) => {
    const abi = [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        constant: true,
        payable: false,
      },
    ];

    // Contract
    const contract = new ethers.Contract(USDT_CONTRACT, abi, wallet);

    // Balance
    const balance = await contract.balanceOf(wallet.address);

    return balance

  }

// Get the USDT balance for an account...
try {
    
const receiver_wallet = new ethers.Wallet(USDT_SENDER_PRIVATE_KEY, provider);
const receiver_balance = await getUSDTBalance(receiver_wallet);

var number = receiver_balance
var formatted_number = parseInt(number) / 1000000000000000000;
var float_number = formatted_number.toFixed(2);

console.log(float_number);

return res.status(200).json({ kycusdt_balance: float_number })

}

catch (error) {
    console.log(error);
    return res.status(500).json({
      "error_code": "eth_error",
      "error_message": error.toString ? error.toString() : error
    });
  };

}