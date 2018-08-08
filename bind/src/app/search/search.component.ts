import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import 'rxjs/Rx';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  // 自带表单流FormControl
  searchInput: FormControl = new FormControl();

  constructor() {
    // 订阅search事件
    this.searchInput.valueChanges
      .debounceTime(500)  // 500ms内没收到新的事件
      .subscribe(stockCode => this.getStockInfo(stockCode));
  }

  getStockInfo(stockCode:string) {
    console.log(`获取${stockCode}的股票信息`)
  }

  ngOnInit() {
  }

}
