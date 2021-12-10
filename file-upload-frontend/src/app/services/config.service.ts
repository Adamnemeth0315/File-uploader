import { Injectable } from '@angular/core';

export interface ITableCol {
  key: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiUrl = 'http://localhost:3000/';

  constructor() { }

  filesTableCols: ITableCol[] = [
    {key: 'filename', text: 'File azonosító'},
    {key: 'originalname', text: 'Név'},
    {key: 'size', text: 'Méret'},
    {key: 'mimetype', text: 'Típus'},
  ]
}
