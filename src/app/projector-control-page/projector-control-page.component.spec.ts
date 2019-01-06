import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectorControlPageComponent } from './projector-control-page.component';

describe('ProjectorControlPageComponent', () => {
  let component: ProjectorControlPageComponent;
  let fixture: ComponentFixture<ProjectorControlPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectorControlPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectorControlPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
