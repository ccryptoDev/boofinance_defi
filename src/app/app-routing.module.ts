import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./@components/home/home.component";
import {StakeComponent} from "./@components/stake/stake.component";
import {CauldronComponent} from "./@components/cauldron/cauldron.component";
import {WellOfSoulsComponent} from "./@components/well-of-souls/well-of-souls.component";
import {ProfileEditorComponent} from "./@components/profile-editor/profile-editor.component";
import { VaultComponent } from './@components/vault/vault.component';
import { BattleComponent } from './@components/battle/battle.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'vault', component: VaultComponent},
  {path: 'battle', component: BattleComponent},
  {path: 'stake', component: StakeComponent},
  {path: 'cauldron', component: CauldronComponent},
  {path: 'well-of-souls', component: WellOfSoulsComponent},
  {path: 'profile', component: ProfileEditorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
