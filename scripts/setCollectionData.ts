import { Address, beginCell } from "ton";
import { NftCollection } from '../wrappers/NftCollection';
import { NetworkProvider, sleep } from '@ton-community/blueprint';

export type InfoCollectionParam = {
  addressCollection : string;

  next_item_index : number;
  pref : number;
  owner_address : string;  
  collection_content : string;

  offchain : string;
  common_content : string;
  individual_nft_content : string;

  royality_perc : number;
  royality_int2 : number;
  royality_address : string;
}

export async function run(provider: NetworkProvider, args: string[]) {
  const ui = provider.ui();

  const fs = require('fs');
  let newParam : InfoCollectionParam = JSON.parse(fs.readFileSync("scripts/paramsNft/newCollectionParam.json"));
  console.log("Параметры коллекции: ", newParam);

  const nftCollection = provider.open(NftCollection.createFromAddress(Address.parse(newParam.addressCollection)));

  //подготовить данные с новыми параметрами коллекции
  const changeContentBody = beginCell()
    .storeUint(4, 32)                   //op: change content
    .storeUint(0, 64)                   // queryid
    .storeRef(
      // ссылка на Cell, содержащую две ссылки на две Cell, содержащие строки с ^[collection_content:^Cell common_content:^Cell]
        beginCell()
          .storeRef(
            beginCell()
            .storeUint(1, 8)                                 // первый непонятный байт
            .storeStringTail(newParam.collection_content) // collection_content
            .endCell()
          )
          .storeRef(
            beginCell()
              .storeStringTail(newParam.common_content) // common_content
            .endCell()
          )
        .endCell()
    )
    .storeRef(      // ссылка на Cell, royalty_params:^RoyaltyParams
        beginCell()
          .storeUint(newParam.royality_perc, 16)
          .storeUint(newParam.royality_int2, 16)
          .storeAddress(Address.parse(newParam.royality_address)) 
        .endCell()
    )
  .endCell();

  //послать транзакцию на изменение параметров коллекции  
  await nftCollection.sendChangeParamCollection(provider.sender(), changeContentBody);

  ui.write('Параметры коллекции изменены!');
}

