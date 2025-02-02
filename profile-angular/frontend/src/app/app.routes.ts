import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from '../pages/home/home.component';
import { ProjectsComponent } from '../pages/projects/projects.component';
import { ResearchComponent } from '../pages/research/research.component';
import { EducationComponent } from '../pages/education/education.component';
import { ContactComponent } from '../pages/contact/contact.component';

export const routes: Routes = [
    {path: '', component:HomeComponent},
    {path: 'project', component:ProjectsComponent},
    {path: 'research', component:ResearchComponent},
    {path: 'education', component:EducationComponent},
    {path: 'contact', component:ContactComponent}
];
