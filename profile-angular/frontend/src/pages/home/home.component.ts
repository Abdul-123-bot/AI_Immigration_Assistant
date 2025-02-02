import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, CommonModule, BaseChartDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public polarAreaChartLabels: string[] = [
    'Frontend Technologies', 
    'Backend Technologies', 
    'Testing Technologies', 
    'DevOps Technologies', 
    'MLOps Technologies', 
    'Database Technologies', 
    'AI Technologies', 
    'GenAI Technologies'
  ];

  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: this.polarAreaChartLabels,
    datasets: [{
      data: [80, 60, 50, 40, 70, 70, 60, 85],
      borderColor: [
        '#72A6A8', '#E61D3B', '#FF9553', '#F6BD4B', '#CBEBF6', '#37A5D2', '#32DD6D', '#FFB1C9'
      ],
      backgroundColor: [
        'rgba(114, 166, 168, 0.6)', // Opacity 0.6
        'rgba(230, 29, 59, 0.6)', 
        'rgba(255, 149, 83, 0.6)', 
        'rgba(246, 189, 75, 0.6)', 
        'rgba(203, 235, 246, 0.6)', 
        'rgba(55, 165, 210, 0.6)', 
        'rgba(50, 221, 109, 0.6)', 
        'rgba(255, 177, 201, 0.6)' 
      ], 
      borderWidth: 3 // Adjust border width
    }]
  };

  public polarAreaChartOptions: ChartOptions<'polarArea'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom', 
        align: 'start',
        labels: {
          boxWidth: 20, 
          padding: 10, 
          font: {
            size: 10, 
            weight: 'bold'
          },
          filter: function(legendItem, chartData) {
            return true; 
          },
        }
      }
    },
    scales: {
      r: {
        suggestedMin: 0, 
        suggestedMax: 100 
      }
    },
    animations: {
      tension: {
        duration: 10000,  // Duration of the animation
        easing: 'easeOutQuad',  // Animation easing function
        from: 1,
        to: 0,
        loop: false
      },
      radius: {
        duration: 10000,
        delay: 1000,  // Delay before the animation starts (in ms)
        easing: 'easeOutQuart',
        from: 0,
        to: 1,
        loop: false
      }
    }
  };
}
