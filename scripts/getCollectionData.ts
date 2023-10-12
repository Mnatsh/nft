import { NftCollection, PathProject } from '../wrappers/NftCollection';
import { NetworkProvider, sleep } from '@ton-community/blueprint';
import { Address, beginCell } from "ton";

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

  let pathProject : PathProject = JSON.parse(fs.readFileSync("pathProject.json"));
  let paramCollection : InfoCollectionParam = 
         JSON.parse(fs.readFileSync(pathProject.pathProject + "getCollection.json"));

  const nftCollection = provider.open(NftCollection.createFromAddress(Address.parse(paramCollection.addressCollection)));

  // запросить 3 геттера из блокчейна
  ui.write("общие данные о коллекции");
  const counterValue1 = await nftCollection.sendGetCollection("get_collection_data");
     //распаковать стек
     paramCollection.next_item_index = counterValue1.readNumber();
     const coll_content = counterValue1.readCell().asSlice().loadStringTail().slice();

     paramCollection.pref = coll_content.charCodeAt(0);
     paramCollection.collection_content = coll_content.slice(1);
     paramCollection.owner_address = counterValue1.readAddress().toString();

  ui.write("общее содержимое Nft коллекции");
  const counterValue2 = await nftCollection.sendGetCollection("get_nft_content");
    let common_cont = counterValue2.readCell().asSlice();
    paramCollection.offchain = (common_cont.loadInt(8) == 1) ? "offchain": "onchain";
    const nftIte = beginCell().storeBits(common_cont.loadBits(common_cont.remainingBits)).endCell();
    paramCollection.common_content = nftIte.asSlice().loadStringTail();
    paramCollection.individual_nft_content = common_cont.loadStringRefTail();

  ui.write("параметры Royalty");
  const counterValue3 = await nftCollection.sendGetCollection("royalty_params");
      paramCollection.royality_perc = counterValue3.readNumber();
      paramCollection.royality_int2 = counterValue3.readNumber();
      paramCollection.royality_address = counterValue3.readAddress().toString();
  
  fs.writeFileSync(pathProject.pathProject + "getCollection.json", JSON.stringify(paramCollection, null, 2));

  ui.write('Параметры коллекции получены и сохранены!');
}

