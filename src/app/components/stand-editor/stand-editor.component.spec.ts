import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandEditorComponent } from './stand-editor.component';

describe('StandEditorComponent', () => {
  let component: StandEditorComponent;
  let fixture: ComponentFixture<StandEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandEditorComponent]
    });
    fixture = TestBed.createComponent(StandEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
