import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../rest-api.service';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  query: string;
  page = 1;
  content: any;
  constructor(private rest: RestApiService, private data: DataService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(res=> {
      this.query = res['query'];
      this.page = 1;
      this.getProducts();
    });
  }

  get lower() {
    return 1 + this.content.hitsPerPage * this.content.page;
  }

  get upper() {
    return Math.min(this.content.hitsPerPage * (this.content.page + 1), this.content.nbHits);
  }
  
  async getProducts() {
    this.content = null;
    try {
      const data = await this.rest.get(environment.url + '/api/search?query=' + this.query + '&page=' + (this.page - 1));
      data['success'] ? (this.content = data['content']) : this.data.error(data['message']);
    } catch(error) {
      this.data.error(error['message']);
    }
  }

}
