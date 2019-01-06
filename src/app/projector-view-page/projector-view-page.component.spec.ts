import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectorViewPageComponent } from './projector-view-page.component';

describe('ProjectorViewPageComponent', () => {
  let component: ProjectorViewPageComponent;
  let fixture: ComponentFixture<ProjectorViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectorViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectorViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
