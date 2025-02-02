import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-research',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './research.component.html',
  styleUrl: './research.component.css'
})
export class ResearchComponent {

}
