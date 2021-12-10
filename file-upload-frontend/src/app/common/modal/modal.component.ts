import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CFile } from 'src/app/model/file';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {


  @Input() showModal = false;
  @Input() selectedToDeleteItem: CFile = new CFile();
  @Output() deleteClick: EventEmitter<any> = new EventEmitter();
  @Output() onShowModal: EventEmitter<any> = new EventEmitter();
  

  constructor() { }

  ngOnInit(): void {
  }

  onClickDelete(): void {
    this.deleteClick.emit();
  }

  setShowModalToFalse(): void{
    this.onShowModal.emit();
  }

}
