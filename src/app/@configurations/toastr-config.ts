import {NbToastrConfig} from "@nebular/theme/components/toastr/toastr-config";

export class ToastrConfig {
  public static Success: Partial<NbToastrConfig> = {
    destroyByClick: true,
    preventDuplicates: true,
    limit: 3,
    duration: 10000,
    icon: 'checkmark-circle-2-outline'
  };

  public static Warning: Partial<NbToastrConfig> = {
    destroyByClick: true,
    preventDuplicates: true,
    limit: 3,
    duration: 10000,
    icon: 'alert-circle-outline',
  }

}
