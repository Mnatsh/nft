import { Address, toNano } from 'ton-core';
import { NftCollection, PathProject } from '../wrappers/NftCollection';
import { NetworkProvider, sleep } from '@ton-community/blueprint';
import { randomAddress } from '@ton-community/test-utils';

export type ItemNft = {
    amount : bigint,
    index: number,
    ownerAddress: Address,
    content: string,
}
  
  export type OunNft = {
    itemOwnerAddress : string,
  }
  
  export type ParamNfts = {
    collectionAddress : string,
    value : number,
    itemIndex : number,
    amount : number,
    itemsNft : OunNft[],
  }
  
export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    //const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Collection address'));

    const fs = require('fs');
    let pathProject : PathProject = JSON.parse(fs.readFileSync("pathProject.json"));
    let paramNfts : ParamNfts = 
        JSON.parse(fs.readFileSync(pathProject.pathProject + "newNftBatchMint.json"));  
console.log("json",paramNfts);
    const nftCollection = provider.open(NftCollection.createFromAddress(Address.parse(paramNfts.collectionAddress)));

    //заполнить массив параметров пакета Nft
    let nftsNew = [];
    for (let i = 0; i < paramNfts.itemsNft.length; i++) {
        let nftC : ItemNft = {
            amount: 0n,
            index: 1,
            ownerAddress: randomAddress(),
            content: ""
        };
        nftC.amount = toNano(paramNfts.amount);
        nftC.index = paramNfts.itemIndex + i;
        nftC.ownerAddress = Address.parse(paramNfts.itemsNft[i].itemOwnerAddress);
        nftC.content = `${nftC.index}.json`;
        nftsNew.push(nftC);
    }
  console.log("nftsNew",nftsNew);
     await nftCollection.sendBatchMint(provider.sender(), {
        value: toNano(paramNfts.value),
        queryId: Date.now(),
        nfts: nftsNew
    });
/* */
    ui.write('Batch of nfts deployed successfully!');
}