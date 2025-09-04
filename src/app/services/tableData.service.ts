import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TableData } from '../models/data';

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  constructor(private http: HttpClient) {}

  get() {
    return this.http.get<TableData[]>(
      `${environment.baseUrl}/all?fields=name,independent,status,currencies,capital,regio/`
    );
  }
  getCurrencies() {
    return this.http.get<any>(
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json`
    );
  }
}
