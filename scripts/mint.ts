import { Address, toNano } from 'ton-core';
import { NftCollection, PathProject } from '../wrappers/NftCollection';
import { NetworkProvider, sleep } from '@ton-community/blueprint';

export type ParamNft = {
    collectionAddress : "EQDORASQghhr9e27e-8pFJj3SjU0UYcB7ufb5_-7z7616LRQ",
    value : "0.05",
    itemIndex : 0,
    itemOwnerAddress : "EQA01D1VQtR8-jWxRzbKkGAZtRhmvCJq6ojdShlENfqBl1LE",
    itemContent : "my_nft.json",
    amount : "0.05"
  }
  
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    //const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));

    const fs = require('fs');
    let pathProject : PathProject = JSON.parse(fs.readFileSync("pathProject.json"));
    let paramNftN : ParamNft = 
        JSON.parse(fs.readFileSync(pathProject.pathProject + "newNftMint.json"));
  
    const nftCollection = provider.open(NftCollection.createFromAddress(Address.parse(paramNftN.collectionAddress)));

    await nftCollection.sendMintNft(provider.sender(), {
        value: toNano(paramNftN.value),       //отсылается на контракт коллекции
        queryId: Date.now(),    // случайное число
        itemIndex: paramNftN.itemIndex,       //индекс NFT в коллекции. Посмотреть в get коллекции
        itemOwnerAddress: Address.parse(paramNftN.itemOwnerAddress),  //адрес владельца NFT
        itemContent: `${paramNftN.itemIndex}.json`,   //json файл NFT
        amount: toNano(paramNftN.amount),     //отсылается коллекцией на контракт создаваемого NFT
    });

    ui.write('Nft item deployed successfully!');
}