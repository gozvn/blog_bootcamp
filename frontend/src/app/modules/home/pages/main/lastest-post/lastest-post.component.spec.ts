import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastestPostComponent } from './lastest-post.component';

describe('LastestPostComponent', () => {
  let component: LastestPostComponent;
  let fixture: ComponentFixture<LastestPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastestPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastestPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
