import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { CFile } from '../model/file';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  list$: BehaviorSubject<CFile[]> = new BehaviorSubject<CFile[]>([]);

  constructor(
    private config: ConfigService,
    private http: HttpClient,
  ) { }

  getAll(): void {
    this.http.get<CFile[]>(`${this.config.apiUrl}files`).subscribe(
      list => this.list$.next(list),
      err => console.error(err)
    )
  }

  getOne(filename: string): Observable<File> {
    return this.http.get<File>(`${this.config.apiUrl}files/${filename}`);
  }

  create(file: File, destination: string): Observable<CFile> {
    const formData: FormData = new FormData();

    if(
      file.name.includes('.png') ||
      file.name.includes('.pdf') ||
      file.name.includes('.xlsx') 
      ){
      formData.append('file', file);
      formData.append('destination', destination);
    } else {
      throw new Error('Only .pdf, .xlsx and .png format allowed!')
    }

    return this.http.post<CFile>(`${this.config.apiUrl}single`, formData);
  }

  remove(file: CFile): Observable<CFile> { 
    return this.http.delete<CFile>(`${this.config.apiUrl}files/${file.filename}?folder=${file.folder ? `${file.folder}/` : ''}`)
  }
}
