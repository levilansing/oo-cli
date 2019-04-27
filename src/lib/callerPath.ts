import {CallSite} from 'callsites';

export function callerPath(sites: CallSite[]) {
  let caller = null;

  for (let i = 0; i < sites.length; i++) {
    const hasReceiver = sites[i].getTypeName() !== null;

    if (hasReceiver) {
      caller = i;
      break;
    }
  }

  return caller && sites[caller].getFileName();
}
