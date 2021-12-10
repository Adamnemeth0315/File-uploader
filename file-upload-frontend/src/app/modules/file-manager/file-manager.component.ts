import { Component, OnInit } from '@angular/core';
import { CFile } from '../../model/file';
import { FileManagerService } from 'src/app/services/file-manager.service';
import { Observable } from 'rxjs';
import { ConfigService, ITableCol } from 'src/app/services/config.service';
import { tap } from 'rxjs/operators';

interface IPageBtn {
  page: number;
}

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss']
})
export class FileManagerComponent implements OnInit {

  //paginator
  filesNum: number = 0;
  maxSize: number = 0;
  pageSize: number = 10;
  pageStart: number = 1;
  currentPage: number = 1;

  file: CFile = new CFile();
  destination = 'newFolder';
  showModal = false;
  selectedToDeleteItem: CFile = new CFile();
  files$: Observable<CFile[]> = this.fileService.list$.pipe(
    tap(files => this.filesNum = files.length),
    tap(files => this.maxSize = Math.ceil(files.length / 10))
  );
  cols: ITableCol[] = this.config.filesTableCols;
  sorterKey: string = '';
  sorterDirection: number = 1;

  constructor(
    private fileService: FileManagerService,
    private config: ConfigService,
  ) { }

  ngOnInit(): void {
    this.fileService.getAll();
  };


  onSave(value: FileList): void {
    this.fileService.create(value[0], this.destination).subscribe(
      (data) => {
        this.fileService.getAll();
      }
    )
  };

  selectedItemToDelete(file: CFile): void {
    this.selectedToDeleteItem = file;
    this.showModal = true;
  } 

  setShowModalToFalse(): void {
    this.showModal = false;
  }

  onDelete(): void {
    this.fileService.remove(this.selectedToDeleteItem).subscribe(
      () => {
        this.fileService.getAll();
        this.showModal = false;
      }
    )
  };

  onSort(key: string): void {
    if ( key === this.sorterKey ) {
      this.sorterDirection *= -1;
    } else {
      this.sorterDirection = 1;
    }

    this.sorterKey = key;
  }

  //Paginator
  get paginator(): IPageBtn[] {
    const pages: IPageBtn[] = [];
    for (let i = 0; i < this.filesNum / this.pageSize && pages.length < 10; i++) {
      const page = this.pageStart + i;
      pages.push({page});
    }
    return pages;
  }

  get pageSliceStart(): number {
    const index = this.currentPage - 1;
    return index === 0 ? 0 : (index * this.pageSize);
  }

  get pageSliceEnd(): number {
    return this.pageSliceStart + this.pageSize;
  }

  onPaginate(ev: Event, btn: IPageBtn) {
    ev.preventDefault();
    this.currentPage = btn.page;
    this.pageStart = (btn.page - 5) < 1 ? 1 : (btn.page - 5);
  }

  onStepPage(ev: Event, step: number): void {
    ev.preventDefault(); // Mivel linket használok gombnak lelövöm annak az eseményét.
    this.currentPage += step;
    this.pageStart = (this.currentPage - 5) < 1 ? 1 : (this.currentPage - 5);
  }

}
