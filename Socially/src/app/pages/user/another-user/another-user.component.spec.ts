import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnotherUserComponent } from './another-user.component';

describe('AnotherUserComponent', () => {
  let component: AnotherUserComponent;
  let fixture: ComponentFixture<AnotherUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnotherUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnotherUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
