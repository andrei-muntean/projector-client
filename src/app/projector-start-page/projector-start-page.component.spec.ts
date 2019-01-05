import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectorStartPageComponent } from './projector-start-page.component';

describe('ProjectorStartPageComponent', () => {
  let component: ProjectorStartPageComponent;
  let fixture: ComponentFixture<ProjectorStartPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectorStartPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectorStartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
