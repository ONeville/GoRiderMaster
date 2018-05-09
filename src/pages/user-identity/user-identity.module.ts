import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserIdentityPage } from './user-identity';

@NgModule({
  declarations: [
    UserIdentityPage,
  ],
  imports: [
    IonicPageModule.forChild(UserIdentityPage),
  ],
})
export class UserIdentityPageModule {}
