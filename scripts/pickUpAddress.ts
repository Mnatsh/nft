import { NftCollection, PathProject } from '../wrappers/NftCollection';
import { NetworkProvider, sleep } from '@ton-community/blueprint';
import { Address, beginCell } from "ton";


//*************************************************
//C:/Users/mnats/ton/nft/node_modules/ton-core/dist/utils/crc16
const crc16_1 = require("C:/Users/mnats/ton/nft/node_modules/ton-core/dist/utils/crc16");
const bounceable_tag = 0x11;
const non_bounceable_tag = 0x51;
const test_flag = 0x80;
function parseFriendlyAddres(src: string) {
  if (typeof src === 'string' && !Address.isFriendly(src)) {
      throw new Error('Unknown address type');
  }
  const data = Buffer.isBuffer(src) ? src : Buffer.from(src, 'base64');
  // 1byte tag + 1byte workchain + 32 bytes hash + 2 byte crc
  if (data.length !== 36) {
      throw new Error('Unknown address type: byte length is not equal to 36');
  }
  // Prepare data
  const addr = data.subarray(0, 34);
  const crc = data.subarray(34, 36);

  const calcedCrc = crc16_1.crc16(addr);

  //const calcedCrc = (0, crc16_1.crc16)(addr);
  if (!(calcedCrc[0] === crc[0] && calcedCrc[1] === crc[1])) {
      throw new Error('Invalid checksum: ' + src);
  }
  // Parse tag
  let tag = addr[0];
  let isTestOnly = false;
  let isBounceable = false;
  if (tag & test_flag) {
      isTestOnly = true;
      tag = tag ^ test_flag;
  }
  if ((tag !== bounceable_tag) && (tag !== non_bounceable_tag))
      throw "Unknown address tag";
  isBounceable = tag === bounceable_tag;
  let workchain = null;
  if (addr[1] === 0xff) { // TODO we should read signed integer here
      workchain = -1;
  }
  else {
      workchain = addr[1];
  }
  const hashPart = addr.subarray(2, 34);
  return { isTestOnly, isBounceable, workchain, hashPart };
}
/*
            let r = parseFriendlyAddress(addr);
            return {
                isBounceable: r.isBounceable,
                isTestOnly: r.isTestOnly,
                address: new Address(r.workchain, r.hashPart)
            };
*/
//*************************************************

export async function run(provider: NetworkProvider, args: string[]) {

  let addrPick = "EQB+Collection/My/Collection/Muy/Collection+GDLb";
/* 
  const data = Buffer.from(addrPick, 'base64');
  const addr = data.subarray(0, 34);
  const calcedCrc = crc16_1.crc16(addr);

  data[34] = calcedCrc[0];
  data[35] = calcedCrc[1];

  console.log("желаемый адрес",addrPick);
  console.log("адрес с правильной контрольной суммой",data.toString('base64'));
 */
let r = parseFriendlyAddres(addrPick);
console.log("addrPick",addrPick)
console.log("Разобранный адрес",r)

}

