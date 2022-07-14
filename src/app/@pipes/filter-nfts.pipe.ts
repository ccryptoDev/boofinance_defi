import {Pipe, PipeTransform} from '@angular/core';
import {Nft} from "../@models/nft";

@Pipe({
  name: 'filterNFTs'
})
export class FilterNftsPipe implements PipeTransform {
  transform(tokenMap: Map<Number, Nft>, type: 'param1' | 'param2' | 'param3'): Map<Number, Nft> {
    return new Map(
      [...tokenMap].filter(([key, token]) => {
        // Filter by type
        let typeMatch: boolean;
        switch (type) {
          case 'param1':
            typeMatch = token.muscle > 1000;
            break;
          case 'param1':
            typeMatch = token.brain > 100;
            break;
          case "param3":
          default:
            typeMatch = token.speed > 700;
            break;
        }
        
        console.log('typematch', typeMatch, 'should display', typeMatch);
        return typeMatch;
      })
    );
  }
}
