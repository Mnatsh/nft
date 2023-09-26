import { Address, beginCell, toNano } from 'ton-core';
import { NftCollection, buildNftCollectionContentCell } from '../wrappers/NftCollection';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export type ParamCollection = {
  collectionContent: string,
  commonContent: string,
  royaltyFactor: number,
  royaltyBase: number,
  royaltyAddress: string,
  amount: string
}


export async function run(provider: NetworkProvider) {

    const fs = require('fs');
    let paramCollection : ParamCollection = JSON.parse(fs.readFileSync("scripts/paramsNft/newCollection.json"));

    const nftCollection = provider.open(NftCollection.createFromConfig({
        ownerAddress: provider.sender().address as Address,
        nextItemIndex: 0,
        collectionContent: buildNftCollectionContentCell(
            {
                collectionContent: paramCollection.collectionContent,
                commonContent: paramCollection.commonContent
            }
        ),
        nftItemCode: await compile('NftItem'),
        royaltyParams: {
            royaltyFactor: paramCollection.royaltyFactor,
            royaltyBase: paramCollection.royaltyBase,
            royaltyAddress: Address.parse(paramCollection.royaltyAddress)
        }
        
    }, await compile('NftCollection')));

    await nftCollection.sendDeploy(provider.sender(), toNano(paramCollection.amount));

    await provider.waitForDeploy(nftCollection.address);

    // run methods on `nftCollection`
}
