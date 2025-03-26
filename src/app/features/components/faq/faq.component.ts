import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-faq',
    imports: [
        NgClass,
    ],
    templateUrl: './faq.component.html',
    styleUrl: './faq.component.scss'
})
export default class FaqComponent {
  questions = [
    {
      value: '¿Qué son las plantas carnívoras y cómo obtienen sus nutrientes?',
      answer: 
        `Las plantas carnívoras o mejor llamadas como plantas insectívoras son seres vivos que han desarrollado la 
        capacidad de obtener nutrientes a partir de la atracción, captura y digestión de insectos y otros pequeños 
        animales, especialmente en ambientes donde el suelo es pobre en nutrientes esenciales como nitrógeno. 
        Utilizan diversas estrategias como trampas pegajosas, trampas de caída y trampas de succión, para capturar 
        a sus presas. Una vez atrapados, las plantas secretan enzimas digestivas para descomponer a las presas y 
        absorber los nutrientes necesarios`
    },
    {
      value: '¿Cómo se reproducen las plantas carnívoras?',
      answer: 
        `Las plantas carnívoras se reproducen tanto sexual como asexualmente. En la reproducción sexual, producen 
        flores que, tras ser polinizadas, generan semillas que pueden dispersarse para germinar en nuevas 
        ubicaciones. En la reproducción asexual, a través de brotes, hijuelos, estolones, gemas o esquejes, creando 
        clones de la planta madre. Este método es común en ambientes donde las condiciones para la germinación de 
        semillas son desfavorables`
    },
    {
      value: '¿Por qué son importantes las plantas carnívoras en los ecosistemas?',
      answer: 
        `Las plantas carnívoras juegan un papel crucial en los ecosistemas, especialmente en áreas donde los suelos 
        son pobres en nutrientes. Ayudan a controlar la población de insectos, actuando como reguladoras naturales 
        de plagas, además, contribuyen a la biodiversidad, ya que su presencia promueve la coexistencia de otras 
        especies y mantiene el equilibrio ecológico en los hábitats donde se encuentran`
    },
    {
      value: 'En qué tipos de ambientes suelen encontrarse las plantas carnívoras?',
      answer: 
        `Las plantas carnívoras generalmente se encuentran en ambientes con suelos pobres en nutrientes como pantanos, 
        turberas y áreas húmedas. Estos lugares suelen tener un alto nivel de humedad y una luz solar adecuada, pero 
        el suelo carece de nitrógeno y otros nutrientes esenciales, lo que ha hecho que evolucionen para sobrevivir 
        mediante la captura de insectos y pequeños animales para suplir la deficiencia de nutrientes en el suelo`
    },
    {
      value: '¿Cuál es la mayor amenaza para las plantas carnívoras en la actualidad?',
      answer: 
        `La mayor amenaza para las plantas carnívoras es la destrucción y alteración de sus hábitats naturales debido 
        a la urbanización, la agricultura y el cambio climático. Muchas especies de plantas carnívoras están en 
        peligro debido a la pérdida de los ecosistemas específicos en los que prosperan, adicionalmente, la 
        sobreexplotación para el comercio de plantas exóticas también contribuye a su declive. Es crucial proteger sus 
        hábitats y regular el comercio para asegurar la conservación de estas plantas fascinantes y ecológicamente 
        importantes`
    },
  ];

  isQuestionOpen: boolean[] = Array(this.questions.length).fill(false);

  toggleQuestion(index: number) {
    this.isQuestionOpen[index] = !this.isQuestionOpen[index];
  }
}
