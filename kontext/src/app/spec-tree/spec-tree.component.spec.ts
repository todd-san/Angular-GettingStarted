import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecTreeComponent } from './spec-tree.component';

describe('SpecTreeComponent', () => {
  let component: SpecTreeComponent;
  let fixture: ComponentFixture<SpecTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
