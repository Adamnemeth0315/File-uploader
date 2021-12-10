import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FileManagerRoutingModule } from './file-manager-routing.module';
import { FileManagerComponent } from './file-manager.component';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { SorterPipe } from '../../pipes/sorter.pipe';


@NgModule({
  declarations: [
    FileManagerComponent,
    ModalComponent,
    SorterPipe,
  ],
  imports: [
    CommonModule,
    FileManagerRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class FileManagerModule { }
