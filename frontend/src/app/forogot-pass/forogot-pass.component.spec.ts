import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForogotPassComponent } from './forogot-pass.component';

describe('ForogotPassComponent', () => {
  let component: ForogotPassComponent;
  let fixture: ComponentFixture<ForogotPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForogotPassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForogotPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
