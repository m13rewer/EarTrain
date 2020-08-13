import { Injectable } from '@angular/core';
import { Component, OnInit, Renderer2, RendererFactory2, ElementRef, ViewChild } from '@angular/core';
import { StatStore } from './stat-store';
import { Beat } from './beat';
import { Note } from './note';

@Injectable({
  providedIn: 'root'
})
export class LearnerService {

  private StatStore: StatStore;
  private topThreeValues: number[];
  private topThreeKeys: string[];
  private topThreeTriplesValues: number[];
  private topThreeTriplesKeys: string[];
  private topThreeDoublesValues: number[];
  private topThreeDoublesKeys: string[];
  private topThreeSinglesValues: number[];
  private topThreeSinglesKeys: string[];
  private keyArray: string[];
  private assessment: boolean[][];
  private melody: Beat[];
  private falseIndexes: number[][];
  private missedGroupsOfNotes: Note[][];
  private map: Map<string, number>;
  private octaves: number[];
  private numberOfNotes: number;
  private uniqueDeg: number[];
  private isUnique: boolean;
  private tableTemplate: string;
  private animated: string;
  private index: number;

  constructor() {
      //this.renderer = render;
      //this.render = null;
      //this.renderer = rendererFactory.createRenderer(this.el, null);
      this.map = new Map<string, number>();
      this.StatStore = new StatStore(this.map);
      this.uniqueDeg = [];
      this.isUnique = false;
      this.animated = `f`;
      
  }

  ngOnInit() {
    console.log("ngOnInit()");
    
    
  }

  makeTheTable(){
    this.tableTemplate =
`*****************
*****************`;

    this.addToText();
    console.log(this.tableTemplate);
  }

  // const span = this.renderer.createElement('span');
    //   this.renderer.addClass(span, 'temp0');
    //   this.renderer.setStyle(
    //     span, 
    //     'color', 'grey');
    //   const questionMark = this.renderer.createText('?');
    //   this.renderer.appendChild(span, questionMark);

    //   this.renderer.appendChild(this.el.nativeElement, span);

  // animateTheTable(){
  //   console.log("animateTheTable()");
  //   this.animated = ``;
  //   this.index = 0;
  //   // for(let i = 0; i < this.tableTemplate.length; i++){
  //   //   await this.sleeper(1000);
  //   //   this.animated = this.animated + this.tableTemplate[i];
  //   // }
  //   // setInterval(() => this.animated = this.animated + this.tableTemplate.charAt(this.index++), 70);
  //   // setTimeout(()=>console.log(this.animated), 3000);
  //   //let timer;
  //   //if(this.index === this.tableTemplate.length) clearInterval(timer);
  //   //timer = setInterval(this.addToText, 50, timer);
    
    
  // }

  addToText(){
    //let text = this.renderer.createText(this.tableTemplate);
    //this.renderer.appendChild(this.el.nativeElement, text);
    //if(this.index === this.tableTemplate.length) clearInterval(timer);
  }

  sleeper(milliseconds: number){
    console.log("sleeper()");

    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  setOctaves(octaves: number[]){
    this.octaves = octaves;
  }

  setAssessment(assessorArr: boolean[][]){
    console.log("setAssessment()");

    this.assessment = assessorArr;
  }

  setMelody(melody: Beat[]){
    console.log("setMelody()");

    this.melody = melody;
  }
  
  setStatStore(stat: Map<string, number>){
    console.log("setStatStore()");

    if(stat) this.StatStore.setTallies(stat);

  }

  setNumberOfNotes(numberOfNotes: number){
    this.numberOfNotes = numberOfNotes;
  }

  sendToStatStore(){
    console.log("sendToStatStore()");
    
    this.assessor().forEach(element => {
      let map = new Map<string, number>();
      let el: string[];
      if(element.length === 1){
        el = [this.getScaleDegree(element[0].pitch)+1+""];
      }else if(element.length === 2){
        el = this.intervalDelegator(element[0], element[1]);
      }else if(element.length === 3){
        el = this.intervalDelegator(element[0], element[1]);
        el.push(this.intervalDelegator(element[0], element[2])[1]);
      }
      let tals = this.StatStore.getTallies();
      this.setStatStore(map.set(el+"", tals.has(el+"") ? tals.get(el+"") : 1));
    });
  }

  getStatStore(): StatStore{
    console.log("getStatStore()");

    let statObj = this.StatStore;
    return statObj;
  }

  filterStats(statsMap: Map<string, number>, statLength: number){
    console.log("filterStats()");

    this.StatStore.getTallies().forEach((v, k) => {
      if(k.split(",").length === statLength) statsMap.set(k, v);
    });

    return statsMap;
  }

  keyToNote(key: string): Note[] {
    console.log("keyToNote()");

    let keyArray = key.split(",");
    let noteArray: Note[] = [];
    let singleNote: Note = new Note();
    
    if(keyArray.length === 1) {
      singleNote.pitch = this.keyArray[+keyArray[0]-1];
      singleNote.octave = Math.ceil(Math.random() * this.octaves.length);
      return [singleNote]
    }
    
    noteArray = this.processGroupedNotes(keyArray);
    
    return noteArray;
  }

  hasUniqueness(){
    return this.isUnique;
  }

  uniqueDegrees(){
    console.log("uniqueDegrees()")
    let checkArr: number[] = [];
    for(let i = 0; i < this.keyArray.length; i++){
      if(!this.keyArray[i]) checkArr[i] = 0;
      else checkArr[i] = i + 1;
    }

    console.log(checkArr);

    this.uniqueDeg = this.uniqueDeg.concat(this.scaleDegrees());
    this.isUnique = checkArr.every(element => this.uniqueDeg.includes(element));
    console.log(this.uniqueDeg);

    return this.isUnique;
  }

  scaleDegrees(){
    console.log("scaleDegrees()");
    //this.melody
    let scaleDegrees: number[] = [];
    for(let i = 0; i < this.melody.length; i++){
      scaleDegrees.push(this.getScaleDegree(this.melody[i].notes[0].pitch)+1);
    }
    console.log(scaleDegrees);
    return scaleDegrees;
  }
 
  processGroupedNotes(strArr: string[]){
    console.log("processGroupedNotes()");
    
    let scaleDegree: number[] = [];
    let degreeExp: string[];
    let oct: number[] = [];
    let noteArr: Note[] = [];
 
    for(let lastIndex = strArr.length-1; lastIndex >= 0; lastIndex--){
      degreeExp = strArr[lastIndex].split("+");
      oct[lastIndex] = degreeExp[1] ? +degreeExp[1]/7 : 0;
      scaleDegree[lastIndex] = +degreeExp[0];
      noteArr[lastIndex] = new Note();
      noteArr[lastIndex].pitch = this.keyArray[Math.abs(scaleDegree[lastIndex])-1];
      if(scaleDegree[lastIndex] < 0) oct[lastIndex] = -oct[lastIndex];
    }

    //this.uniqueDegrees(scaleDegree);
    noteArr = this.octaveLimits(Math.max(...oct), Math.min(...oct), oct, noteArr);
    
    return noteArr;
  }

  octaveLimits(max: number, min: number, oct: number[], noteArr: Note[]){
    console.log("octaveLimits()");

    let range = max - min;
    let limit = this.octaves.length - range;
    let base = Math.ceil(Math.random() * limit);
    oct = oct.map(element => element + Math.abs(min));
    
    for(let i = 0; i < noteArr.length; i++){
      noteArr[i].octave = base + oct[i];
    }

    return noteArr;
  }

  getTopThreeTriplesStats(){
    console.log("getTopThreeTriplesStats()");
    let triplesStats: Map<string, number> = new Map<string, number>();

    triplesStats = this.filterStats(triplesStats, 3);
    let tals: IterableIterator<[string, number]>;
    let first: any;
    let second: any;
    let third: any;

    if(!this.topThreeTriplesValues){
      tals = triplesStats.entries();
      first= tals.next().value;
      second = tals.next().value;
      third = tals.next().value;
      if(second === undefined) second = third = ["", 0];
      if(third === undefined) third = ["", 0];

      this.topThreeTriplesKeys = [first[0], second[0], third[0]];
      this.topThreeTriplesValues = [first[1], second[1], third[1]];
    }

    if(this.topThreeTriplesKeys.length < 3){
      if(second === undefined) this.topThreeTriplesKeys[1] = "";
      if(third === undefined) this.topThreeTriplesKeys[2] = "";
    }
    
    triplesStats.forEach((v, k) => {
      if(v > this.topThreeTriplesValues[0] && !this.topThreeTriplesKeys.includes(k)){
        this.topThreeTriplesValues[2] = this.topThreeTriplesValues[1];
        this.topThreeTriplesValues[1] = this.topThreeTriplesValues[0];
        this.topThreeTriplesValues[0] = v;
        this.topThreeTriplesKeys[2] = this.topThreeTriplesKeys[1];
        this.topThreeTriplesKeys[1] = this.topThreeTriplesKeys[0];
        this.topThreeTriplesKeys[0] = k;

      }else if(v > this.topThreeTriplesValues[1] && !this.topThreeTriplesKeys.includes(k)){
        this.topThreeTriplesValues[2] = this.topThreeTriplesValues[1];
        this.topThreeTriplesValues[1] = v;
        this.topThreeTriplesKeys[2] = this.topThreeTriplesKeys[1];
        this.topThreeTriplesKeys[1] = k;

      }else if(v > this.topThreeTriplesValues[2] && !this.topThreeTriplesKeys.includes(k)){
        this.topThreeTriplesValues[2] = v;
        this.topThreeTriplesKeys[2] = k;

      }else if(this.topThreeTriplesKeys.includes(k)){
        this.topThreeTriplesValues[this.topThreeTriplesKeys.indexOf(k)] = v;

      }
    });
  }

  getTopThreeDoublesStats(){
    console.log("getTopThreeDoublesStats()");

    let doublesStats: Map<string, number> = new Map<string, number>();
    let tals: IterableIterator<[string, number]>;
    let first: any;
    let second: any;
    let third: any;

    doublesStats = this.filterStats(doublesStats, 2);

    if(!this.topThreeDoublesValues){

      tals = doublesStats.entries();
      first = tals.next().value;
      second = tals.next().value;
      third = tals.next().value;

      if(second === undefined) second = third = ["", 0];
      if(third === undefined) third = ["", 0];

      this.topThreeDoublesKeys = [first[0], second[0], third[0]];
      this.topThreeDoublesValues = [first[1], second[1], third[1]];
    }
    
    if(this.topThreeDoublesValues.length < 3){
      if(second === undefined) second = third = ["", 0];
      if(third === undefined) third = ["", 0];
    }

    doublesStats.forEach((v, k) => {
      if(v > this.topThreeDoublesValues[0] && !this.topThreeDoublesKeys.includes(k)){
        this.topThreeDoublesValues[2] = this.topThreeDoublesValues[1];
        this.topThreeDoublesValues[1] = this.topThreeDoublesValues[0];
        this.topThreeDoublesValues[0] = v;
        this.topThreeDoublesKeys[2] = this.topThreeDoublesKeys[1];
        this.topThreeDoublesKeys[1] = this.topThreeDoublesKeys[0];
        this.topThreeDoublesKeys[0] = k;

      }else if(v > this.topThreeDoublesValues[1] && !this.topThreeDoublesKeys.includes(k)){
        this.topThreeDoublesValues[2] = this.topThreeDoublesValues[1];
        this.topThreeDoublesValues[1] = v;
        this.topThreeDoublesKeys[2] = this.topThreeDoublesKeys[1];
        this.topThreeDoublesKeys[1] = k;

      }else if(v > this.topThreeDoublesValues[2] && !this.topThreeDoublesKeys.includes(k)){
        this.topThreeDoublesValues[2] = v;
        this.topThreeDoublesKeys[2] = k;

      }else if(this.topThreeDoublesKeys.includes(k)){

        this.topThreeDoublesValues[this.topThreeDoublesKeys.indexOf(k)] = v;
      }
    });  
  }

  getTopThreeSinglesStats(){
    console.log("getTopThreeSinglesStats()");

    let singlesStats: Map<string, number> = new Map<string, number>();
    let tals: IterableIterator<[string, number]>;
    let first: any;
    let second: any;
    let third: any;

    singlesStats = this.filterStats(singlesStats, 1);

    if(!this.topThreeSinglesValues){
      tals = singlesStats.entries();
      first = tals.next().value;
      second = tals.next().value;
      third = tals.next().value;

      if(second === undefined) second = third = ["", 0];
      if(third === undefined) third = ["", 0];

      this.topThreeSinglesKeys = [first[0], second[0], third[0]];
      this.topThreeSinglesValues = [first[1], second[1], third[1]];
    }

    if(this.topThreeSinglesValues.length < 3){
      if(second === undefined) second = third = ["", 0];
      if(third === undefined) third = ["", 0];
    }
    
    singlesStats.forEach((v, k) => {
      if(v > this.topThreeSinglesValues[0] && !this.topThreeSinglesKeys.includes(k)){
        this.topThreeSinglesValues[2] = this.topThreeSinglesValues[1];
        this.topThreeSinglesValues[1] = this.topThreeSinglesValues[0];
        this.topThreeSinglesValues[0] = v;
        this.topThreeSinglesKeys[2] = this.topThreeSinglesKeys[1];
        this.topThreeSinglesKeys[1] = this.topThreeSinglesKeys[0];
        this.topThreeSinglesKeys[0] = k;

      }else if(v > this.topThreeSinglesValues[1] && !this.topThreeSinglesKeys.includes(k)){
        this.topThreeSinglesValues[2] = this.topThreeSinglesValues[1];
        this.topThreeSinglesValues[1] = v;
        this.topThreeSinglesKeys[2] = this.topThreeSinglesKeys[1];
        this.topThreeSinglesKeys[1] = k;

      }else if(v > this.topThreeSinglesValues[2] && !this.topThreeSinglesKeys.includes(k)){
        this.topThreeSinglesValues[2] = v;
        this.topThreeSinglesKeys[2] = k;

      }else if(this.topThreeSinglesKeys.includes(k)){
        this.topThreeSinglesValues[this.topThreeSinglesKeys.indexOf(k)] = v;

      }
    });
  }

  getTopThreeStats(){
    console.log("getTopThreeStats()");
    
    if(!this.topThreeValues){
      let tals = this.StatStore.getTallies().entries();
      let first = tals.next().value;
      let second = tals.next().value;
      let third = tals.next().value;

      if(second === undefined) second = third = ["", 0];
      if(third === undefined) third = ["", 0];

      this.topThreeKeys = [first[0], second[0], third[0]];
      this.topThreeValues = [first[1], second[1], third[1]];
    }
    
    this.StatStore.getTallies().forEach((v, k) => {
      if(v > this.topThreeValues[0] && !this.topThreeKeys.includes(k)){
        this.topThreeValues[2] = this.topThreeValues[1];
        this.topThreeValues[1] = this.topThreeValues[0];
        this.topThreeValues[0] = v;
        this.topThreeKeys[2] = this.topThreeKeys[1];
        this.topThreeKeys[1] = this.topThreeKeys[0];
        this.topThreeKeys[0] = k;

      }else if(v > this.topThreeValues[1] && !this.topThreeKeys.includes(k)){
        this.topThreeValues[2] = this.topThreeValues[1];
        this.topThreeValues[1] = v;
        this.topThreeKeys[2] = this.topThreeKeys[1];
        this.topThreeKeys[1] = k;

      }else if(v > this.topThreeValues[2] && !this.topThreeKeys.includes(k)){
        this.topThreeValues[2] = v;
        this.topThreeKeys[2] = k;

      }else if(this.topThreeKeys.includes(k)){
        this.topThreeValues[this.topThreeKeys.indexOf(k)] = v;

      }
    });
  }

  popBlockedIndex(arr: number[], index: number){
    console.log("popBlockedIndex()");

    let last = arr.length-1;
    let temp = arr[index];
    arr[index] = arr[last];
    arr[last] = temp;
    return arr.pop();
  }

  setKeyArray(arr: string[]){
    console.log("setKeyArray()");

    this.keyArray = arr;
  }

  getScaleDegree(pitch: string){
    console.log("getScaleDegree()");

    for(let i = 0; i < this.keyArray.length; i++){
      if(this.keyArray[i] === pitch){
        return i;
      }
    }
  }

  findCOrCSharp(){
    console.log("findCOrCSharp()");

    let index = (this.keyArray.findIndex((element) => element === "c") === -1) ? (this.keyArray.findIndex((element) => element === "c#")): (this.keyArray.findIndex((element) => element === "c"));
    return index;
  }

  intervalDelegator(firstNote: Note, secondNote: Note){
    console.log("intervalDelegator()");

    let firstNoteIndex = this.getScaleDegree(firstNote.pitch);
    let secondNoteIndex = this.getScaleDegree(secondNote.pitch);
    
    if(firstNote.octave < secondNote.octave || (firstNoteIndex < secondNoteIndex && firstNote.octave === secondNote.octave)){
      return this.calculateIntervalAsc(firstNote, secondNote);
    }else{
      return this.calculateIntervalDesc(firstNote, secondNote);
    }
  }

  setFalseIndexes(){
    console.log("setFalseIndexes()");

    this.falseIndexes = [];
    for(let i = 0; i < this.assessment.length; i++){
      for(let e = 0; e < this.assessment[i].length; e++){
        if(this.assessment[i][e] === false){
          this.falseIndexes.push([i, e]);
        }
      }
    }
  }

  calculateIntervalAsc(firstNote: Note, secondNote: Note){
    console.log("calculateIntervalAsc()");

    let firstNoteIndex = this.getScaleDegree(firstNote.pitch);
    let secondNoteIndex = this.getScaleDegree(secondNote.pitch);
    //console.log(firstNoteIndex, secondNoteIndex);
    let responseArr: string[];
    let octavesApart: number = Math.abs(firstNote.octave - secondNote.octave);
    let octaveThreshold: number = this.findCOrCSharp();
    //console.log(octavesApart, octaveThreshold);

    if(((firstNoteIndex < octaveThreshold && secondNoteIndex >= octaveThreshold) && octavesApart === 1) || 
    
    (octavesApart === 0)){

      responseArr = [firstNoteIndex+1+"", secondNoteIndex+1+""];

    }else{

      responseArr = [firstNoteIndex+1+"", secondNoteIndex+1+"+"+7*octavesApart];

    }

    return responseArr;
    
  }

  calculateIntervalDesc(firstNote: Note, secondNote: Note){
    console.log("calculateIntervalDesc()");

    let firstNoteIndex = this.getScaleDegree(firstNote.pitch);
    let secondNoteIndex = this.getScaleDegree(secondNote.pitch);
    let responseArr: string[];
    let octavesApart: number = firstNote.octave - secondNote.octave;
    let octaveThreshold: number = this.findCOrCSharp();

    if(((firstNoteIndex >= octaveThreshold && secondNoteIndex < octaveThreshold) && octavesApart === 1) || 

    (octavesApart === 0)){

      responseArr = [firstNoteIndex+1+"", "-"+(secondNoteIndex+1)];

    }else{

      responseArr = [firstNoteIndex+1+"", -(secondNoteIndex+1)+"+"+(7*octavesApart)];

    }

    return responseArr;
  }

  integrateIntoMelody(){
    console.log("integrateIntoMelody()");

    let spotsToFill = this.numberOfNotes;  
    
    this.topThreeSinglesKeys = this.topThreeSinglesKeys.filter(element => element !== "");
    this.topThreeDoublesKeys = this.topThreeDoublesKeys.filter(element => element !== "");
    this.topThreeTriplesKeys = this.topThreeTriplesKeys.filter(element => element !== "");
  
    let keys = this.topThreeSinglesKeys.concat(this.topThreeDoublesKeys, this.topThreeTriplesKeys);
    let melodyKeys = [];

    while(spotsToFill > 0){
      switch(spotsToFill > 3){
        case true:
          let random = Math.floor(Math.random() * keys.length);
          melodyKeys.push(keys[random]);
          spotsToFill = spotsToFill - keys[random].split(",").length;
          break;
        case false:
          let filteredKeys = keys.filter(element => element.split(",").length <= spotsToFill);
          random = Math.floor(Math.random() * filteredKeys.length);
          melodyKeys.push(filteredKeys[random]);
          spotsToFill = spotsToFill - filteredKeys[random].split(",").length;
          break;
        default:
          break;
      }
    }

    return melodyKeys;
  }
  
  makeMapPairs(keys: string[], values: number[]){
    let mapArr = [];
    for(let i = 0; i < keys.length; i++){
      mapArr[i].push([keys[i], values[i]]);
    }

    return mapArr;
  }

  displayTopThree(){
    console.log("displayTopThree()");

    //this.getTopThreeStats();
    //console.log(this.topThreeKeys, this.topThreeValues);
    this.keyArray;
    // const span = this.renderer.createElement('span');
    //   this.renderer.addClass(span, 'temp0');
    //   this.renderer.setStyle(
    //     span, 
    //     'color', 'grey');
    //   const questionMark = this.renderer.createText('?');
    //   this.renderer.appendChild(span, questionMark);

    //   this.renderer.appendChild(this.el.nativeElement, span);

  }

  getSectors(substringEnd: number){
    console.log("getSectors()");
    let indexes: string = "";
    for(let i = 0; i < this.melody.length; i++){
      indexes = indexes + i;
    }

    let sectors: string[] = [];
    let substringStart: number = 0;
    
    while(substringEnd < this.melody.length+1){
      sectors.push(indexes.substring(substringStart, substringEnd));
      substringStart++;
      substringEnd++;
    }
    console.log(sectors);
    return sectors;
  }

  assessGroupsOfThreeMissed(){
    console.log("assessGroupsOfThreeMissed()");
    let indexHolder = [];
    let notesArr3: Note[][] = [];
    let sectors: string[] = [];
    let sectorsOfThree = this.getSectors(3);
    console.log(sectorsOfThree);

    for(let i = 0; i < this.falseIndexes.length; i++){
      indexHolder = this.falseIndexes[i];
      sectors = [];
      for(let element in sectorsOfThree){
        
        if(sectorsOfThree[element].includes(indexHolder[1].toString())) {
          sectors.push(sectorsOfThree[element]);
          sectorsOfThree[element] = "";
          //sectorsOfThree = sectorsOfThree.filter(index => index != sectorsOfThree[element]);
          console.log(sectorsOfThree);
        }

        //if(!sectorsOfThree) break;
        console.log("sectors: "+sectors, "sectorsOfThree: "+sectorsOfThree[element], "indexHolder: "+indexHolder);
      }
      //sectorsOfThree.forEach(element => element.includes(indexHolder[1].toString() ))
      console.log(sectors);
      if(sectors[0]) {
        for(let element in sectors){
          notesArr3.push([this.melody[sectors[element].substring(0,1)].notes[0], 
      this.melody[sectors[element].substring(1,2)].notes[0], 
      this.melody[sectors[element].substring(2,3)].notes[0]]);
        }
      }
    //   console.log(this.melody[sectors[0].substring(0,1)].notes[0], 
    //   this.melody[sectors[0].substring(1,2)].notes[0], 
    //   this.melody[sectors[0].substring(2,3)].notes[0]);
    }
    console.log(notesArr3);
    return notesArr3;
  }

  assessPairsMissed(){
    console.log("assessPairsMissed()");
    let indexHolder = [];
    let notesArr2: Note[][] = [];
    let sectors: string[] = [];
    let sectorsOfTwo = this.getSectors(2);
    console.log(sectorsOfTwo);

    for(let i = 0; i < this.falseIndexes.length; i++){
      indexHolder = this.falseIndexes[i];
      sectors = [];
      for(let element in sectorsOfTwo){
        console.log(sectorsOfTwo[element]);
        if(sectorsOfTwo[element].includes(indexHolder[1].toString())){
          sectors.push(sectorsOfTwo[element]); 
          sectorsOfTwo[element] = "";
          //sectorsOfTwo = sectorsOfTwo.filter(index => index != sectorsOfTwo[element]);
        }
        console.log(sectorsOfTwo);
        
        console.log("sectors: "+sectors, "sectorsOfTwo: "+sectorsOfTwo[element], "indexHolder: "+indexHolder);
      }
      //sectorsOfThree.forEach(element => element.includes(indexHolder[1].toString() ))
      if(sectors[0]) {
        for(let element in sectors){
          notesArr2.push([this.melody[sectors[element].substring(0,1)].notes[0], 
      this.melody[sectors[element].substring(1,2)].notes[0]]);
        }
      }
      
      // console.log(this.melody[sectors[0].substring(0,1)].notes[0], 
      // this.melody[sectors[0].substring(1,2)].notes[0], 
      // this.melody[sectors[0].substring(2,3)].notes[0]);
    }
    return notesArr2;
  }

  assessSinglesMissed(){//make it only return unique
    console.log("assessSinglesMissed()");
    let sectorsOfOne = this.getSectors(1);
    let indexHolder = [];
    let notesArr: Note[][] = [];
    let sectors: string[] = [];
    

    for(let i = 0; i < this.falseIndexes.length; i++){
      indexHolder = this.falseIndexes[i];
      sectors = [];
      for(let element in sectorsOfOne){
        console.log(sectorsOfOne[element]);
        if(sectorsOfOne[element] === indexHolder[1].toString()){
          sectors.push(sectorsOfOne[element]); 
          sectorsOfOne[element] = "";
          //sectorsOfTwo = sectorsOfTwo.filter(index => index != sectorsOfTwo[element]);
        }
        console.log(sectorsOfOne);
        
        console.log("sectors: "+sectors, "sectorsOfOne: "+sectorsOfOne[element], "indexHolder: "+indexHolder);
      }
      //sectorsOfThree.forEach(element => element.includes(indexHolder[1].toString() ))
      if(sectors[0]) {
        for(let element in sectors){
          notesArr.push([this.melody[sectors[element].substring(0,1)].notes[0]]);
        }
      }
      
    }
    return notesArr; //note arr
  }

  assessor(){
    console.log("assessor()");

    let missedGroups: Note[][] = [];
    
    if(this.melody.length >= 3){
      missedGroups = this.assessGroupsOfThreeMissed();
      this.assessPairsMissed().forEach(element => missedGroups.push(element));
      this.assessSinglesMissed().forEach(element => missedGroups.push(element));

      console.log(missedGroups);
    }else if(this.melody.length === 2){
      this.assessPairsMissed().forEach(element => missedGroups.push(element));
      this.assessSinglesMissed().forEach(element => missedGroups.push(element));
    }else if(this.melody.length === 1){
      this.assessSinglesMissed().forEach(element => missedGroups.push(element));
    }
    
    return missedGroups;
  }
}
