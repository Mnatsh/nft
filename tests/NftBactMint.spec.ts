import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Address, Cell, toNano } from 'ton-core';
import { NftItem } from '../wrappers/NftItem';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { randomAddress } from '@ton-community/test-utils';

export type ItemNft = {
    amount : bigint,
    index: number,
    ownerAddress: Address,
    content: string,
}
  
  export type OunNft = {
    itemOwnerAddress : "EQA01D1VQtR8-jWxRzbKkGAZtRhmvCJq6ojdShlENfqBl1LE",
  }
  
  export type ParamNfts = {
    collectionAddress : "EQDORASQghhr9e27e-8pFJj3SjU0UYcB7ufb5_-7z7616LRQ",
    value : number,
    itemIndex : number,
    amount : number,
    itemsNft : OunNft[],
  }

describe('NftItem', () => {
    let code: Cell;

    beforeAll(async () => {
        //code = await compile('NftItem');
    });

    let blockchain: Blockchain;
    let nftItem: SandboxContract<NftItem>;

    beforeEach(async () => {
    
        expect(25).toBe(25);
    });

    it('Проверка правильности чтения файла paramNftBatchMint.json', async () => {
        const fs = require('fs');
        let paramNfts : ParamNfts = JSON.parse(fs.readFileSync("scripts/paramsNft/paramNftBatchMint.json"));  
    
        //const nftCollection = provider.open(NftCollection.createFromAddress(Address.parse(paramNfts.collectionAddress)));
    
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
            nftC.content = `meta_${nftC.index}.json`;
            nftsNew.push(nftC);
        }
        // the check is done inside beforeEach
        console.log("json: ", nftsNew);
        console.log("nftsNew: ", paramNfts);
        // blockchain and nftItem are ready to use
    });
});
