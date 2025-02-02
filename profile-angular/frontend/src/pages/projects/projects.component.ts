import { Component, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements AfterViewInit {
   public skill: Observable<any> = of([
    {
      name: 'FrontEnd Technology',
      skills: ['Angular', 'React', 'HTML', 'CSS', 'JavaScript', 'JQuery', 'AJAX', 'GraphQL', 'Redux'],
      ratings: [7, 7, 9, 7, 8, 9, 9, 6, 7]
    },
    {
      name: 'Backend Technology',
      skills: ['Java', 'Spring', 'Servlet', 'JSP', 'Node', 'Express', 'Nextjs'],
      ratings: [8, 7, 8, 8, 9, 9, 6]
    },
    {
      name: 'Database Technology',
      skills: ['MySQL', 'MongoDB', 'Oracle', 'Postgres', 'Hibernate', 'JPA'],
      ratings: [8, 7, 8, 8, 6, 6]
    },
    {
      name: 'DevOps Technologies',
      skills: ['Docker', 'Kubernetes', 'Github', 'Git', 'Github Workflow', 'Jenkins'],
      ratings: [8, 6, 9, 9, 6, 6]
    },
    {
      name: 'Cloud Technologies',
      skills: ['AWS', 'Lambda', 'EC2', 'CloudFront', 'Azure', 'GCP', 'DigitalOcean'],
      ratings: [7, 6, 9, 5, 6, 6, 8]
    },
    {
      name: 'Languages',
      skills: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'SQL', 'Typescript', 'C#'],
      ratings: [10, 8, 9, 8, 9, 8, 10, 7]
    },
    {
      name: 'Testing Technologies',
      skills: ['JUnit', 'Jasmine', 'Karma', 'Mocha', 'Cypress', 'Jest'],
      ratings: [6, 7, 7, 7, 5, 6]
    },
    {
      name: 'AI Technologies',
      skills: ['Tensorflow', 'Pytorch', 'Spacy', 'CNN', 'Encoder', 'NLTK', 'OpenCV'],
      ratings: [7, 5, 5, 8, 9, 7, 6]
    },
    {
      name: 'GenAI Technologies',
      skills: ['Transformers', 'Langchain', 'LangFuse', 'LangSmith', 'Langraph', 'RAG', 'Agentic AI'],
      ratings: [7, 7, 8, 7, 7, 8, 8]
    }
  ]);

  constructor() {}

  ngAfterViewInit() {
    this.skill.subscribe((skills: { name: string; skills: string[]; ratings: number[] }[]) => {
      skills.forEach((skill: { name: string; skills: string[]; ratings: number[] }, index: number) => {
        this.createRadarChart(`radarChart${index}`, skill.skills, skill.ratings);
      });
    });
  }
  

  createRadarChart(canvasId: string, labels: string[], data: number[]) {
    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Skill Ratings',
            data: data,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
          }]
        },
        options: {
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 10
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }
}
