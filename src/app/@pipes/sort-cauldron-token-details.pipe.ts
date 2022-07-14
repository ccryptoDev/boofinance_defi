import {Pipe, PipeTransform} from "@angular/core";
import {KeyValue} from "@angular/common";
import {CauldronTokenDetails} from "../@models/cauldron-token-details";

@Pipe({
  name: 'sortCauldronTokensDetails'
})
export class SortCauldronTokensDetailsPipe implements PipeTransform {
  transform(keyValue: Array<KeyValue<string, CauldronTokenDetails>>):  Array<KeyValue<string, CauldronTokenDetails>> {
    // Sort in descending order by percentage of composition
    return keyValue.sort((a, b) => {
      if (a.value.percentageOfComposition && b.value.percentageOfComposition) {
        return b.value.percentageOfComposition - a.value.percentageOfComposition;
      }
      return 0;
    });
  }
}
