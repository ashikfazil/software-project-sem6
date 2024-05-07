// For simplicity we use `web3` package here. However, if you are concerned with the size,
//	you may import individual packages like 'web3-eth', 'web3-eth-contract' and 'web3-providers-http'.
import { Web3 } from 'web3';
import fs from 'fs';
import path from 'path';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

const bytecodePath: string = path.join(__dirname, 'MyContractBytecode.bin');
const bytecode: string = fs.readFileSync(bytecodePath, 'utf8');

const abi: any = require('./MyContractAbi.json');
const myContract: any = new web3.eth.Contract(abi);
myContract.handleRevert = true;

async function deploy(): Promise<void> {
	const providersAccounts: string[] = await web3.eth.getAccounts();
	const defaultAccount: string = providersAccounts[0];
	console.log('deployer account:', defaultAccount);

	const contractDeployer: any = myContract.deploy({
		data: '0x' + bytecode,
		arguments: [1],
	});

	const gas: number = await contractDeployer.estimateGas({
		from: defaultAccount,
	});
	console.log('estimated gas:', gas);

	try {
		const tx: any = await contractDeployer.send({
			from: defaultAccount,
			gas,
			gasPrice: 10000000000,
		});
		console.log('Contract deployed at address: ' + tx.options.address);

		const deployedAddressPath: string = path.join(__dirname, 'MyContractAddress.bin');
		fs.writeFileSync(deployedAddressPath, tx.options.address);
	} catch (error) {
		console.error(error);
	}
}

deploy();