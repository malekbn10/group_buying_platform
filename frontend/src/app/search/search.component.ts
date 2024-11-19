import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
ngOnInit(): void {

}
@Output() searchTerm = new EventEmitter<string>();

onSearch(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  if (inputElement) {
    const searchTerm = inputElement.value.trim().toLowerCase();
    this.searchTerm.emit(searchTerm);
  }
}
}
