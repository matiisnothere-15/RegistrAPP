import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApiMortyPage } from './api-morty.page';

describe('ApiMortyPage', () => {
  let component: ApiMortyPage;
  let fixture: ComponentFixture<ApiMortyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApiMortyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
