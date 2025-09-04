import { Component } from '@angular/core';
import { TableDataService } from './services/tableData.service';
import { TableData } from './models/data';
import { CommonModule, KeyValuePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EditUserPopupComponent } from './components/edit-user-popup/edit-user-popup.component';
import { PreviewSectionComponent } from './components/preview-section/preview-section.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SortHeaderComponent } from './components/sort-header/sort-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    KeyValuePipe,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    EditUserPopupComponent,
    PreviewSectionComponent,
    PaginationComponent,
    SortHeaderComponent,
  ],
})
export class AppComponent {
  title = 'InteractiveDataTable';
  data: TableData[] = [];
  paginatedData: TableData[] = [];
  currentPage = 1;
  recordsPerPage = 5;
  totalPages = 0;
  pageSizes = [5, 10, 15, 20, 30];
  rowDetailes!: TableData;
  editForm!: FormGroup;
  selectedUserIndex!: number;
  openEditPopup!: boolean;
  rowDetails: TableData | null = null;
  private clickTimeout: any;
  currencies: any;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  filters: { [key: string]: string } = {
    name: '',
    capital: '',
    currency: '',
  };

  constructor(private service: TableDataService, private fb: FormBuilder) {}

  ngOnInit() {
    this.getTheData();
    this.getTheCurrencies();
    this.createTheForm();
  }
  createTheForm() {
    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      capital: ['', [Validators.required]],
      currencyCode: ['', [Validators.required]],
      currencySymbol: ['', [Validators.required]],
    });
  }
  getTheData() {
    this.service.get().subscribe({
      next: (res) => {
        this.data = res;
        this.totalPages = Math.ceil(this.data.length / this.recordsPerPage);

        this.updateThePaginatedData();
      },
    });
  }
  getTheCurrencies() {
    this.service.getCurrencies().subscribe({
      next: (res) => {
        this.currencies = res;
      },
    });
  }

  updateThePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.recordsPerPage;
    const endIndex = startIndex + this.recordsPerPage;
    this.paginatedData = this.data.slice(startIndex, endIndex);
    this.applyFilters();
  }

  changeThePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateThePaginatedData();
  }

  nextPage() {
    this.changeThePage(this.currentPage + 1);
  }

  previousPage() {
    this.changeThePage(this.currentPage - 1);
  }

  PagesChangee(event: number) {
    this.recordsPerPage = event;
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.data.length / this.recordsPerPage);
    this.updateThePaginatedData();
  }
  viewDetails(item: TableData) {
    this.rowDetailes = item;
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }
  closePopup() {
    this.openEditPopup = false;
  }

  onRowClick(event: MouseEvent, item: TableData) {
    event.stopPropagation();

    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }

    this.clickTimeout = setTimeout(() => {
      this.viewDetails(item);
    }, 500);
  }

  onRowDblClick(event: MouseEvent, item: TableData, index: number) {
    event.stopPropagation();

    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }
    this.selectedUserIndex = index;
    this.openPopup(item);
  }
  openPopup(item: TableData) {
    const currencyKey = Object.keys(item.currencies)[0];
    const currency = item.currencies[currencyKey];
    this.editForm.setValue({
      name: item.name.common,
      status: item.status,
      capital: item.capital ? item.capital[0] : '',
      currencyCode: currencyKey.toLowerCase(),
      currencySymbol: currency.symbol,
    });

    this.openEditPopup = true;
  }
  saveUser() {
    if (this.editForm.invalid) return;

    const formValue = this.editForm.value;
    const existingUser = this.paginatedData[this.selectedUserIndex];

    this.paginatedData[this.selectedUserIndex] = {
      ...this.paginatedData[this.selectedUserIndex],
      name: { ...existingUser.name, common: formValue.name },
      status: formValue.status,
      capital: [formValue.capital],
      currencies: {
        [formValue.currencyCode]: {
          name: this.currencies[formValue.currencyCode],
          symbol: formValue.currencySymbol,
        },
      },
    };

    this.closePopup();
  }
  deleteRecord(index: number) {
    this.paginatedData.splice(index, 1);
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.data.sort((a: any, b: any) => {
      let aValue = '';
      let bValue = '';

      if (column === 'name') {
        aValue = a.name.common || '';
        bValue = b.name.common || '';
      } else if (column === 'capital') {
        aValue = a.capital?.[0] || '';
        bValue = b.capital?.[0] || '';
      } else if (column === 'currency') {
        aValue = Object.keys(a.currencies || {})[0] || '';
        bValue = Object.keys(b.currencies || {})[0] || '';
      }

      return this.sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    this.updateThePaginatedData();
  }
  private getNestedValue(obj: any, column: string): any {
    switch (column) {
      case 'name':
        return obj.name?.common ?? '';
      case 'capital':
        return obj.capital?.[0] ?? '';
      case 'currency':
        const currencyKey = Object.keys(obj.currencies || {})[0];
        return currencyKey ? obj.currencies[currencyKey]?.name ?? '' : '';
      default:
        return obj[column] ?? '';
    }
  }
  onFiltersChanged(newFilters: { [key: string]: string }) {
    this.filters = newFilters;
    this.applyFilters();
  }
  applyFilters() {
    let filtered = this.data.filter((item) => {
      const nameMatch = item.name.common
        .toLowerCase()
        .includes(this.filters['name'].toLowerCase());

      const capitalMatch = (item.capital?.[0] || '')
        .toLowerCase()
        .includes(this.filters['capital'].toLowerCase());

      const currencyKey = Object.keys(item.currencies || {})[0] || '';
      const currencyMatch = currencyKey
        .toLowerCase()
        .includes(this.filters['currency'].toLowerCase());
      return nameMatch && capitalMatch && currencyMatch;
    });

    this.totalPages = Math.ceil(filtered.length / this.recordsPerPage);

    const startIndex = (this.currentPage - 1) * this.recordsPerPage;
    const endIndex = startIndex + this.recordsPerPage;

    this.paginatedData = filtered.slice(startIndex, endIndex);
  }
}
