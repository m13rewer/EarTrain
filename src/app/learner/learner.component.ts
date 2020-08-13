import { Component, OnInit, Renderer2, RendererFactory2, ElementRef, ViewChild } from '@angular/core';
import { StatStore } from '../shared/stat-store';
import { Beat } from '../shared/beat';
import { Note } from '../shared/note';
import { mapChildrenIntoArray } from '@angular/router/src/url_tree';


@Component({
  selector: 'app-learner',
  templateUrl: './learner.component.html',
  styleUrls: ['./learner.component.css']
})
export class LearnerComponent implements OnInit {

  @ViewChild('animated') private el: ElementRef;

  constructor(private renderer: Renderer2) { }

  private animation: string;
  private table: string;
  private index: number;
  private timer: any;
  private oneCorrect: string;
  private twoCorrect: string;
  private threeCorrect: string;
  private fourCorrect: string;
  private oneNotQuite: string;
  private twoNotQuite: string;
  private threeNotQuite: string;
  private fourNotQuite: string;
  private lineOne: string;
  private lineTwo: string;
  private lineThree: string;
  private lineFour: string;
  private stringGridCorrect: string[];
  private stringGridNotQuite: string[];


  ngOnInit() {
    console.log("ngOnInit()");
    this.animation = 
` **   **   **  **  ***  ** ***
*    *   * * * * *  **  *    *
*    *   * **  **   *   *    *
 **   **   * * * * ***  **  *`;
    this.table = ``;

    this.oneCorrect = 
` **   **   **  **  ***  ** ***`;
    this.twoCorrect = 
`*    *   * * * * *  **  *    *`;
    this.threeCorrect = 
`*    *   * **  **   *   *    *`;
    this.fourCorrect = 
` **   **   * * * * ***  **  * `;

    this.oneNotQuite=
`*  *  **  ***     **  *  * * *** *** 
** * *   *  *     *  * *  * *   *   **
* ** *   *  *     **** **  *   *   *  
*  *  **    *      ** ***  *   *   ***`;

    this.oneNotQuite = 
` *  *  **  ***     **  *  * * *** *** `;


    this.twoNotQuite = 
`** * *   *  *     *  * *  * *   *   **`;

    this.threeNotQuite = 
`* ** *   *  *     **** **  *   *   *  `;

    this.fourNotQuite = 
`*  *  **    *      ** ***  *   *   ***`;

    


    this.stringGridCorrect = [];
    this.stringGridCorrect[0] = this.oneCorrect;
    this.stringGridCorrect[1] = this.twoCorrect;
    this.stringGridCorrect[2] = this.threeCorrect;
    this.stringGridCorrect[3] = this.fourCorrect;

    this.stringGridNotQuite = [];
    this.stringGridNotQuite[0] = this.oneNotQuite;
    this.stringGridNotQuite[1] = this.twoNotQuite;
    this.stringGridNotQuite[2] = this.threeNotQuite;
    this.stringGridNotQuite[3] = this.fourNotQuite;

    this.lineOne = ``;
    this.lineTwo = ``;
    this.lineThree = ``;
    this.lineFour = ``;
    
  }

  async notQuiteAppear(){

    this.lineOne = this.oneNotQuite.substring(0, Math.ceil(this.oneNotQuite.length/2)-1)+'\n\n\n';
    let i = () => {
      let v = " ";
      for(let i = 0; i < (this.fourNotQuite.length/2)-1; i++){
        v+=" ";
      }
      return v + this.fourNotQuite.substring(Math.ceil(this.fourNotQuite.length/2)-1, this.fourNotQuite.length);
    };

    this.lineFour = i();
    await this.sleeper(50);

    this.lineOne = this.oneNotQuite.substring(0, Math.ceil(this.oneNotQuite.length/2)-1);
    let e = () => {
      let v = " ";
      for(let i = 0; i < (this.threeNotQuite.length/2)-1; i++){
        v+=" ";
      }
      return v + this.threeNotQuite.substring(Math.ceil(this.threeNotQuite.length/2)-1, this.threeNotQuite.length);

    }

    this.lineTwo = this.twoNotQuite.substring(0, Math.ceil(this.twoNotQuite.length/2)-1);
    this.lineThree = e();
    await this.sleeper(50);

    //this.lineOne += this.oneNotQuite.substring(Math.ceil(this.oneNotQuite.length/2), this.oneNotQuite.length);
    //this.lineFour = 
    // this.lineFour = this.fourNotQuite.substring(0, Math.ceil(this.fourNotQuite.length/2)) 
    // + this.lineFour.substring(Math.ceil(this.oneNotQuite.length/2), this.oneNotQuite.length);;
    this.lineTwo = this.twoNotQuite.substring(0, Math.ceil(this.twoNotQuite.length/2)-1) + 
    this.twoNotQuite.substring(Math.ceil(this.twoNotQuite.length/2)-1, this.twoNotQuite.length);
    this.lineThree = this.threeNotQuite.substring(0, Math.ceil(this.threeNotQuite.length/2)-1) + 
    this.threeNotQuite.substring(Math.ceil(this.threeNotQuite.length/2)-1, this.threeNotQuite.length);
    await this.sleeper(50);

    //this.linethree = this.threeNotQuite.substring(Math.ceil(this.threeNotQuite.length/2));
    // this.lineTwo += this.twoNotQuite.substring(Math.ceil(this.twoNotQuite.length/2), this.twoNotQuite.length);
    // this.lineThree = this.threeNotQuite.substring(0, Math.ceil(this.threeNotQuite.length/2)) + 
    //this.threeNotQuite.substring(Math.ceil(this.threeNotQuite.length/2), this.threeNotQuite.length);
    this.lineOne = this.oneNotQuite.substring(0, Math.ceil(this.oneNotQuite.length/2)-1) + 
    this.oneNotQuite.substring(Math.ceil(this.oneNotQuite.length/2)-1, this.oneNotQuite.length);

    this.lineFour = this.fourNotQuite.substring(0, Math.ceil(this.fourNotQuite.length/2)-1) + 
    this.fourNotQuite.substring(Math.ceil(this.fourNotQuite.length/2)-1, this.fourNotQuite.length);

    
    await this.sleeper(500);
    this.deleteAsterisks(this.oneNotQuite);
  }

  async correctAppear(){

    for(let i = 0; i < this.oneCorrect.length ; i++){

      this.lineOne+=this.oneCorrect[i];
      this.lineTwo+=this.twoCorrect[i];
      this.lineThree+=this.threeCorrect[i];
      this.lineFour+=this.fourCorrect[i];

      await this.sleeper(10);
    }

    await this.sleeper(500);

    this.deleteAsterisks(this.oneCorrect);

  }

  async deleteAsterisks(assessment: string){

    let randomIndexes = [];

    for(let x = 0; x < assessment.length; x++){
      randomIndexes.push(x);
    }

    let rows = [];
    rows[0] = randomIndexes;
    rows[1] = randomIndexes;
    rows[2] = randomIndexes;
    rows[3] = randomIndexes;

    console.log(rows);

    let rowOne = this.lineOne.split("");
    let rowTwo = this.lineTwo.split("");
    let rowThree = this.lineThree.split("");
    let rowFour = this.lineFour.split("");

    const regex = /,/gi;
    let randomIndex = 0;
    

    for(let i = 0; i < this.oneCorrect.length ; i++){

      rowOne[rows[0][randomIndex = Math.floor(Math.random() * rows[0].length)]] = " ";
      rows[0] = rows[0].filter(element => element !== rows[0][randomIndex]);//rows[0].filter(element => element !== " ");
      console.log(rows[0]);
      this.lineOne = rowOne.toString().replace(regex, "");

      rowTwo[rows[1][randomIndex = Math.floor(Math.random() * rows[1].length)]] = " ";
      rows[1] = rows[1].filter(element => element !== rows[1][randomIndex]);
      console.log(rows[1]);
      this.lineTwo = rowTwo.toString().replace(regex, "");

      rowThree[rows[2][randomIndex = Math.floor(Math.random() * rows[2].length)]] = " ";
      rows[2] = rows[2].filter(element => element !== rows[2][randomIndex]);
      console.log(rows[2]);
      this.lineThree = rowThree.toString().replace(regex, "");

      rowFour[rows[3][randomIndex = Math.floor(Math.random() * rows[3].length)]] = " ";
      rows[3] = rows[3].filter(element => element !== rows[3][randomIndex]);
      console.log(rows[3]);
      this.lineFour = rowFour.toString().replace(regex, "");


      await this.sleeper(10);
    }

    this.lineOne = this.lineTwo = this.lineThree = this.lineFour = "";
  }

  stop(){
    clearInterval(this.timer);
  }

  sleeper(milliseconds: number){
    console.log("sleeper()");

    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

}