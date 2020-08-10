import { Component, OnInit, HostListener, Renderer2, RendererFactory2, ElementRef, ViewChild, ViewChildren, Injectable } from '@angular/core';
import { Note } from '../shared/note';
import { LinkedList, Node } from '../shared/linked-list';
import { Beat } from '../shared/beat';
import * as createjs from 'createjs-module';
import { Sounds } from '../shared/sounds';
import { ShortCutsPipe } from '../short-cuts.pipe';
import { LowerCasePipe } from '@angular/common';
import { LearnerComponent } from '../learner/learner.component';
import { StatStore } from '../shared/stat-store';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})


export class ConfigComponent implements OnInit {

  public seconds: number[];
  public numberOfNotes: number;
  public notes: Note;
  public notesLinkedList: LinkedList<string>;
  public buttonStatus: boolean;
  public melody: Beat[];
  public mixedRhythm: boolean;
  public mixedNotes: boolean;
  public octavesLinkedList: LinkedList<number>;
  public solfegeLinkedList: LinkedList<number>;
  public simulNotes: number;
  public durations: number[];
  public index: number;
  public timeInterval: number;
  public perfect: boolean;
  public root: string;
  public scale: string;
  public answer: string;
  public buttonMode: string;
  public map: string[];
  public keyScale: string;
  public selectRoots: string[];
  public selectScales: string[];
  public inputValues: string;
  public values: string;
  public numberValues: string;
  public val: string;
  public count: number;
  public countDown: number;
  public countTotal: number;
  public numberAnswer: string;
  public letterAnswer: string;
  public rows: number;
  public spanMatrix: HTMLElement[][];
  public addNotes: boolean;
  public learnerAssessor: boolean[][];
  public learner: LearnerComponent;
  public StatStore: StatStore;
  public learnerOn: boolean;
  public keyArray: string[];

  constructor(private rendererFactory: RendererFactory2, private renderer: Renderer2, private shortCuts: ShortCutsPipe, private lowerCase: LowerCasePipe) { }
  
  @ViewChild('fields') private el: ElementRef;
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    
    if(!this.melody.length){
      return;
    }else if(this.count === this.melody.length){
      this.count = 0;
      return;
    }

    switch(this.shortCuts.transform(event.key)){
      case false:
        break;
      default:
        this.checkAsYouGo(this.shortCuts.transform(this.lowerCase.transform(event.key)));
        break;
    }
  }

  ngOnInit() {
    console.log("ngOnInit()");
    this.countTotal = 0;
    this.countDown = 0;
    this.count = 0;
    this.rows = 1;
    this.seconds = [];
    this.spanMatrix = [[],[],[]];
    this.numberOfNotes = null;
    this.notesLinkedList = new LinkedList<string>();
    this.octavesLinkedList = new LinkedList<number>();
    this.solfegeLinkedList = new LinkedList<number>();
    this.selectRoots = [];
    this.selectScales = [];
    this.buttonStatus =  true;
    this.simulNotes = 1;
    this.melody = [];
    this.durations = [0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
    this.perfect = false;
    this.root = '';
    this.scale = '';
    this.buttonMode = 'Relative';
    this.map = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
    //this.keyRoot = this.map[Math.floor(Math.random() * this.map.length)];
    this.keyScale = 'Major';
    this.inputValues = '';
    this.values = '';
    this.val = '';
    this.numberValues = '';
    this.numberAnswer = '';
    this.letterAnswer = '';
    //this.melodyMatrix = [];
    this.addNotes = true;
    //this.learner.ngOnInit();// = new LearnerComponent(this.rendererFactory).ngOnInit();
    this.learnerAssessor = [[],[],[]];
    
    this.learner = new LearnerComponent(this.rendererFactory);
    this.StatStore = new StatStore(new Map<string, number>());
    this.learnerOn = false;
    
    this.setSeconds();
    this.setRoots();
    this.setScales();
    this.setNotes();
    this.setOctaves();   
  }

  setSeconds() {
    for(let i = 0; i < 7; i++){
      this.seconds.push(i);
    }
  }

  setScales() {
    let listScales = ['Major', 'Minor', 'Blues', 'Random'];

    for(let i = 0; i < listScales.length; i++){
      this.selectScales.push(listScales[i]);
    }
  }

  setRoots() {
    let listRoots = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b', 'Random'];
    for(let i = 0; i < listRoots.length; i++){
      this.selectRoots.push(listRoots[i]);
    }
  }

  setNotes() {

    const notes: string[] = this.map;
    this.notesLinkedList = this.notesLinkedList.fromArray(notes);
    const degrees: number[] = [1, 2, 3, 4, 5, 6, 7];
    this.solfegeLinkedList = this.solfegeLinkedList.fromArray(degrees);
    
    //console.log(this.notesLinkedList.find((_)=>_==='C'));
    //console.log(this.notesLinkedList.find(_=>_==='C'));
  }

  setOctaves() {
    const octaves: number[] = [4, 5, 6];
    this.octavesLinkedList = this.octavesLinkedList.fromArray(octaves);
    this.learner.setOctaves(octaves);
  }

  setMode(bool: boolean){
    console.log("setMode()");
    this.perfect = (this.perfect === bool);
    this.buttonMode = (this.perfect ? 'Perfect': 'Relative');
    //console.log(this.perfect);
  }

  setSounds(){
    console.log("setSounds()");
    if (!createjs.Sound.initializeDefaultPlugins()) {
      return;
    }

    let pianoSounds = [Sounds.pianoPitchSprite];
    //console.log(Sounds.pianoPitchSprite);
    let audioPath = "./assets/piano-pitch-files/";
    let sounds = [Sounds.pitchSprite];
    //console.log(Sounds.pitchSprite);

      
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.on("fileload", this.loadHandler);
    createjs.Sound.registerSounds(sounds, audioPath);
    createjs.Sound.registerSounds(pianoSounds, audioPath);
  }

  loadHandler(pitchId){
    const playSound = createjs.Sound.play(pitchId);
  } 
  
  triadloadHandler(pitchId, pitchId2, pitchId3){
    const play_sound = createjs.Sound.play(pitchId);
    const play_sound1 = createjs.Sound.play(pitchId2);
    const play_sound2 = createjs.Sound.play(pitchId3);
  }
  
  diadloadHandler(pitch_id, pitch_id1){
    const play_sound = createjs.Sound.play(pitch_id);
    const play_sound1 = createjs.Sound.play(pitch_id1);
  }

  activateLearner(){
    console.log("activateLearner()");
    console.log(this.learnerAssessor);

    if(this.learnerAssessor[0].length === 0) return;

    this.learner.setAssessment(this.learnerAssessor);
    console.log(this.melody);
    this.learner.setMelody(this.melody);
    this.learner.setFalseIndexes();
    this.learner.sendToStatStore();
    this.learner.setNumberOfNotes(this.numberOfNotes);
    console.log(this.learner.getStatStore().getTallies());
    this.learner.getTopThreeStats();
    this.learner.getTopThreeSinglesStats();
    this.learner.getTopThreeDoublesStats();
    this.learner.getTopThreeTriplesStats();
    let uni = this.learner.uniqueDegrees();
    console.log(uni);
    if(uni) {
      console.log("INTEGRATED!!!!!!!!");
      this.melody = [];
      let mel = this.learner.integrateIntoMelody();
      console.log(mel);

      mel.forEach(
        element => {
          this.learner.keyToNote(element).forEach(
          el => {
            let beat = new Beat();
            beat.notes = [el];
            this.melody.push(beat);
          }
        )
      });
    }

    console.log(this.melody);

    this.learnerAssessor = [[],[],[]];
  }

  reset(){
    console.log("reset()");

    let tempSpans = this.el.nativeElement.children;
    if(this.melody.length > 0 && this.learnerOn === true) this.activateLearner();

    for(let i = 0; i < this.melody.length*this.rows; i++){
      this.renderer.removeChild(this.el.nativeElement, tempSpans[0]);
    }

    this.countTotal = 0;
    this.count = 0;
    this.countDown = 0;
    this.melody = [];
    this.notesLinkedList = new LinkedList<string>();
    //console.log(this.notesLinkedList);
    this.setNotes();
    
    
  }

  checkAsYouGo(response: string) { // with type info
    console.log("checkAsYouGo()");
    if(this.melody.length === 0 || !this.melody){
      return;
    }

    let i = 0;
    let inputVal = response;
    let val = response;
    let valNumber = response;
    let numberAnswer = this.numberAnswer;
    let letterAnswer = this.letterAnswer;
    let regex = /^[0-9]+$/;
    let answerObject;

    response = inputVal;

    if(response.match(regex)){
      //console.log(response.match(regex));
      answerObject = this.checkAsYouGoNumber(letterAnswer, numberAnswer, response);
      valNumber = answerObject.assessment;
      (valNumber === undefined ? this.numberValues = 'Make a new melody': this.numberValues = valNumber);
      
    }else{
      //console.log("regex not rec "+response);
      answerObject = this.checkAsYouGoLetter(letterAnswer, numberAnswer, response);
      
      val = answerObject.assessment;
      (val === undefined ? this.values = 'Make a new melody': this.values = val);
      
    }

    this.numberAnswer = answerObject.adjustedAnswerDigit.join("");
    this.letterAnswer = answerObject.adjustedAnswerLetter.join("");
    //console.log(valNumber);
    (val === undefined || val === undefined? this.inputValues = 'Make a new melody': this.inputValues += inputVal);
    
    //console.log('adjustedString: '+this.letterAnswer+' '+this.numberAnswer);

    if(this.countDown === this.rows-1){
      this.countDown = 0;
      this.count++;
    }else{
      this.countDown++;
    }
    
    //response.value = '';
  }

  updateAnswerString(answerArrayLetter: string[], answerArrayDigit: string[]){
    let reversedAnswerLetter = answerArrayLetter.reverse();
    let letter = reversedAnswerLetter.pop();
    let reversedAnswerDigit = answerArrayDigit.reverse();
    let digit = reversedAnswerDigit.pop();
    return {'letter': letter, 'digit': digit, 'reversedAnswerLetter': reversedAnswerLetter, 'reversedAnswerDigit': reversedAnswerDigit};
  }

  checkAsYouGoLetter(answerLetter: string, answerDigit: string, response: string){
    console.log("checkAsYouGoLetter()");
    let answerArrayLetter = answerLetter.match(/.#?/g);
    let answerArrayDigit = answerDigit.split("");
    
    let AnswerObj = this.updateAnswerString(answerArrayLetter, answerArrayDigit);
    let letter = AnswerObj['letter'];
    let reversedAnswerLetter = AnswerObj['reversedAnswerLetter'];
    let reversedAnswerDigit = AnswerObj['reversedAnswerDigit'];
    let reveal = '';
    //console.log('checkAsYouGoLetter()');
    
    //console.log('answer: ');
    //console.log(answerArrayLetter);
    
    if(letter === response){
      this.learnerAssessor[this.countDown][this.count] = true;
      this.melody[this.count].notes[this.countDown].stat = true;
      this.updateResponseFields(`${response}`, 'green', answerArrayLetter, answerArrayDigit);
      
    }else if(letter === undefined){
      reveal = letter;
      //this.learnerAssessor[this.countDown][this.count] = true;
    }else{
      this.learnerAssessor[this.countDown][this.count] = false;
      this.melody[this.count].notes[this.countDown].stat = false;
      this.updateResponseFields(`${letter}`, 'red', answerArrayLetter, answerArrayDigit);

    }
    
    return {'assessment': reveal, 'adjustedAnswerLetter': reversedAnswerLetter.reverse(), 'adjustedAnswerDigit': reversedAnswerDigit.reverse()};
  }

  checkAsYouGoNumber(answerLetter: string, answerDigit: string, response: string) {
    console.log('checkAsYouGoNumber()');
    let answerArrayLetter = answerLetter.match(/.#?/g);
    let answerArrayDigit = answerDigit.split("");
    
    let AnswerObj = this.updateAnswerString(answerArrayLetter, answerArrayDigit);
    let digit = AnswerObj['digit'];
    let reversedAnswerLetter = AnswerObj['reversedAnswerLetter'];
    let reversedAnswerDigit = AnswerObj['reversedAnswerDigit'];
    let reveal = '';
    
   
    // console.log('answer: ');
    // console.log(answerArrayDigit);
    // console.log(this.countDown, this.count);
    
    if(digit === response){
      this.learnerAssessor[this.countDown][this.count] = true;
      this.melody[this.count].notes[this.countDown].stat = true;
      this.updateResponseFields(`${response}`, 'green', answerArrayLetter, answerArrayDigit);
      

    }else if(digit === undefined){
      reveal = digit;
      //this.learnerAssessor[this.countDown][this.count] = true;
    }else{
      this.learnerAssessor[this.countDown][this.count] = false;
      this.melody[this.count].notes[this.countDown].stat = false;
      this.updateResponseFields(`${digit}`, 'red', answerArrayLetter, answerArrayDigit);

    }
    //console.log(this.learnerAssessor);
    
    return {'assessment': reveal, 'adjustedAnswerLetter': reversedAnswerLetter.reverse(), 'adjustedAnswerDigit': reversedAnswerDigit.reverse()};

  }

  updateResponseFields(response: string, style: string, arrLetter: string[], arrNumber: string[]){
    console.log("updateResponseFields()");
    //console.log(this.el.nativeElement.children);
    let tempSpans = this.el.nativeElement.children;
    let i = 0;
    
    for(let e = 0; e < tempSpans.length; e++){
      if(e === this.melody.length || e === this.melody.length*2){
        i++;
      }
      this.spanMatrix[i][e%(this.melody.length)] = tempSpans[e];
    }
    
    let span = this.renderer.createElement('span');
    let text = this.renderer.createText(response);
    this.renderer.addClass(span, 'temp' + this.countDown);
    //console.log("Coundown:" + this.countDown);
    this.renderer.setStyle(
      span, 
      'color', style);
    this.renderer.appendChild(span, text);
    this.renderer.insertBefore(this.el.nativeElement, span, this.spanMatrix[this.countDown][this.count]);
    this.renderer.removeChild(this.el.nativeElement, this.spanMatrix[this.countDown][this.count]);
    this.countTotal++;

    if(arrLetter[arrLetter.length-1] === undefined && this.countTotal !== this.melody.length*this.rows){
      return;
    }else if(arrLetter[arrLetter.length-1] === '*'){
      
      span = this.renderer.createElement('span');
      text = this.renderer.createText("*");
      this.renderer.addClass(span, 'temp' + 1);
      this.renderer.setStyle(
        span, 
        'color', style);
      this.renderer.appendChild(span, text);
      //console.log("Count: "+this.count);
      //console.log("here it is again");
      this.renderer.insertBefore(this.el.nativeElement, span, this.spanMatrix[++this.countDown][this.count]);

      this.renderer.removeChild(this.el.nativeElement, this.spanMatrix[this.countDown][this.count]);
      this.learnerAssessor[this.countDown][this.count] = null;
      this.melody[this.count].notes[this.countDown].stat = null;
      arrLetter.pop();
      arrNumber.pop();
      this.countTotal++;
      
    }

    if(arrLetter[arrLetter.length-1] === undefined && this.rows === 3 && this.countTotal !== this.melody.length*this.rows){
      return;
    }else if(arrLetter[arrLetter.length-1] === '*'){

      span = this.renderer.createElement('span');
      text = this.renderer.createText("*");
      this.renderer.addClass(span, 'temp' + 2);
      this.renderer.setStyle(
        span, 
        'color', style);
      this.renderer.appendChild(span, text);
      //console.log("Count: "+this.count);
      //console.log("here it is again");
      this.renderer.insertBefore(this.el.nativeElement, span, this.spanMatrix[++this.countDown][this.count]);

      this.renderer.removeChild(this.el.nativeElement, this.spanMatrix[this.countDown][this.count]);
      this.learnerAssessor[this.countDown][this.count] = null;
      this.melody[this.count].notes[this.countDown].stat = null;
      arrLetter.pop();
      arrNumber.pop();
      this.countTotal++;
      
    }
    
    //console.log("need to reset "+this.countTotal);
    if(this.countTotal === this.melody.length*this.rows){
      this.reset();
      return;
    }
    
  }

  getNumberAnswer(rowsToAdd: number){
    let letterAnswer = this.getAnswer(rowsToAdd);
    let numberAnswer = "";
    console.log("getNumberAnswer()");
    //console.log(this.root, this.notesLinkedList.size());
    let mapArray = this.mapToScaleDegree(/*this.keyRoot*/this.root, this.notesLinkedList.size());

    for(let i = 0; i < letterAnswer.length; i++){
      if(letterAnswer[i] === '*'){
        numberAnswer = numberAnswer + '*';
        continue;
      }
      numberAnswer = numberAnswer + (mapArray.indexOf(letterAnswer[i])+1); 
    }

    //console.log("getNumberAnswer()");
    //console.log(numberAnswer);
    this.numberAnswer = numberAnswer;
    return numberAnswer;
  }

  getAnswer(rowsToAdd: number) {
    console.log("getAnswer()");
    let answer: string;
    answer = "";
  
    for(let i = 0; i < this.melody.length; i++){

      answer = answer+this.melody[i].notes[0].pitch;

      if(this.melody[i].notes[1] === undefined && rowsToAdd > 0){
        answer = answer+'*';
      }else if(rowsToAdd === 0){
        continue;
      }else{
        answer = answer+this.melody[i].notes[1].pitch;
      }

      if(this.melody[i].notes[2] === undefined && rowsToAdd === 2){
        answer = answer+'*';
      }else if(rowsToAdd < 2){
        continue;
      }else{
        answer = answer+this.melody[i].notes[2].pitch;
      }
    }

    //console.log(answer);
    this.letterAnswer = answer;
    return answer;
  }

  getKeyArray(indexes: number[], key: number){
    let keyArray = [];
    let newIndex: number;
    for(let i = 0; i < indexes.length; i++){
      newIndex = indexes[i]+key;
      keyArray.push(newIndex%12);
    }
    
    return keyArray;
  }

  getScalePattern(){
    /*build the rest*/
    console.log("getScalePattern()");
    
    //this.keyScale;
    switch(this.keyScale){
      case 'Major':
        return [2, 2, 1, 2, 2, 2];
      case 'Minor':
        return [2, 1, 2, 2, 1, 2];
      case 'Blues':
        return [2, 1, 1, 3, 2, 3];
      default:
        return [2, 2, 1, 2, 2, 2];
    }
  }

  getOctave(){
    console.log("getOctave()");
    let octaves = this.octavesLinkedList.toArray();
    return octaves[Math.floor(Math.random() * this.octavesLinkedList.size())];
  }

  keys(root: string, scale: string){
    console.log("keys()");
    let cMajor = [1, 3, 6, 8, 10]; //these are the indexes of the notes not in the key of c major
    let cBlues = [1, 5, 6, 8, 10, 11];//TODO
    let cMinor = [];//TODO
    /*do the same for blues, minor, etc.*/
    let notes = {
      'cMajor': cMajor,
      'c#Major': this.getKeyArray(cMajor, 1),
      'dMajor': this.getKeyArray(cMajor, 2),
      'd#Major': this.getKeyArray(cMajor, 3),
      'eMajor': this.getKeyArray(cMajor, 4),
      'fMajor': this.getKeyArray(cMajor, 5),
      'f#Major': this.getKeyArray(cMajor, 6),
      'gMajor': this.getKeyArray(cMajor, 7),
      'g#Major': this.getKeyArray(cMajor, 8),
      'aMajor': this.getKeyArray(cMajor, 9),
      'a#Major': this.getKeyArray(cMajor, 10),
      'bMajor': this.getKeyArray(cMajor, 11),
      'cMinor': cMinor,
      'c#Minor': this.getKeyArray(cMinor, 1),
      'dMinor': this.getKeyArray(cMinor, 2),
      'd#Minor': this.getKeyArray(cMinor, 3),
      'eMinor': this.getKeyArray(cMinor, 4),
      'fMinor': this.getKeyArray(cMinor, 5),
      'f#Minor': this.getKeyArray(cMinor, 6),
      'gMinor': this.getKeyArray(cMinor, 7),
      'g#Minor': this.getKeyArray(cMinor, 8),
      'aMinor': this.getKeyArray(cMinor, 9),
      'a#Minor': this.getKeyArray(cMinor, 10),
      'bMinor': this.getKeyArray(cMinor, 11),
      'cBlues': cBlues,
      'c#Blues': this.getKeyArray(cBlues, 1),
      'dBlues': this.getKeyArray(cBlues, 2),
      'd#Blues': this.getKeyArray(cBlues, 3),
      'eBlues': this.getKeyArray(cBlues, 4),
      'fBlues': this.getKeyArray(cBlues, 5),
      'f#Blues': this.getKeyArray(cBlues, 6),
      'gBlues': this.getKeyArray(cBlues, 7),
      'g#Blues': this.getKeyArray(cBlues, 8),
      'aBlues': this.getKeyArray(cBlues, 9),
      'a#Blues': this.getKeyArray(cBlues, 10),
      'bBlues': this.getKeyArray(cBlues, 11),

    }
    
    return notes[root+scale];
  }

  makeKey(root: string, scale: string){
    let notes = this.map;
    let scales = ['Major', 'Minor', 'Blues'];
    if(root === 'Random') root = notes[Math.floor(Math.random() * notes.length)];
    if(scale === 'Random') scale = notes[Math.floor(Math.random() * scales.length)];
    this.root = root;
    let notesToDelete = this.keys(root, scale);

    for(let i = 0; i < notes.length; i++){
      this.notesLinkedList.delete(notes[notesToDelete[i]]);
    }
    console.log("makeKey()");
    
    //console.log(this.notesLinkedList);
  }

  mapToScaleDegree(root: string, scaleLength: number){
    const pattern = this.getScalePattern(); //make a getPattern function
    const notes = this.map;
    const map = {
      'c': 0,
      'c#': 1,
      'd': 2,
      'd#': 3,
      'e': 4,
      'f': 5,
      'f#': 6,
      'g': 7,
      'g#': 8,
      'a': 9,
      'a#': 10,
      'b': 11
    };

    let newNotes = [];
    let i = 0;
    let index = map[root];
    newNotes.push(notes[index]);

    while(i < scaleLength-1){
      index = index+pattern[i];
      newNotes.push(notes[index%12]);
      i++;
    }
    console.log("mapToScaleDegree()");
    //console.log(newNotes);
    //this.learner = new LearnerComponent(this.rendererFactory);
    this.keyArray = newNotes;
    this.learner.setKeyArray(this.keyArray); //set key array for learner
    return newNotes; 
  }


  updateNotes(note: string, stat: any){
    
    console.log("updateNotes()");
    if(stat.value === 'true') {
      this.notesLinkedList.delete(note);
      //this.mapToScaleDegree(note, this.keyScale);
      stat.value = false;
    } else {
      this.notesLinkedList.append(note);
      stat.value = true;
    }

    this.keyArray = this.notesLinkedList.toArray();

    this.learner.setKeyArray(this.keyArray);
  }

  updateOctaves(octave: number, stat: any){
    console.log("updatesOctaves()");

    if(stat.value) {
      this.octavesLinkedList.delete(octave);
      stat.value = false;
    } else {
      this.octavesLinkedList.append(octave);
      stat.value = true;
    }
    this.learner.setOctaves(this.octavesLinkedList.toArray());
  }

  melodyDelegator(speed: number, root: string, scale: string){
    console.log("melodyDelegator()");
    
    if(this.melody.length > 0 && this.learnerOn === true && this.learner.hasUniqueness()) return;
    if(this.buttonMode === 'Relative'){
      console.log("relative");
      this.reset();
      this.makeKey(root, scale);
      this.makeMelody(speed);
      this.getNumberAnswer(0);
    }else{
      this.rows = 1;
      this.makeMelody(speed);
      this.getAnswer(0);
    }
  }

  makeMelody(speed: number){
    console.log("makeMelody()");

    this.addNotes = true;
    this.inputValues = '';
    this.values = '';
    this.numberValues = '';
    this.setSounds();
    let i: number;
    let beat: Beat;
    i = 0;

    while(i < this.numberOfNotes){
      beat = new Beat();
      beat.notes = this.makeBeatNotes();
      beat.duration = this.durations[speed];
      this.melody[i] = beat;
      i++;
    }

    this.makeResponseFields();
  }

  makeResponseFields(){
    console.log("makeResponseFields()");

    for(let i = 0; i < this.melody.length; i++){
      const span = this.renderer.createElement('span');
      this.renderer.addClass(span, 'temp0');
      this.renderer.setStyle(
        span, 
        'color', 'grey');
      const questionMark = this.renderer.createText('?');
      this.renderer.appendChild(span, questionMark);

      this.renderer.appendChild(this.el.nativeElement, span);
    }

  }

  addToResponseFields(numberRows: number){
    console.log("addToResponseFields()");
    //console.log(numberRows);
    const parent = this.el.nativeElement;
  
    for(let e = 1; e < numberRows+1; e++){

      // const br = this.renderer.createElement('br');
      // this.renderer.appendChild(parent, br);

      for(let i = 0; i < this.melody.length; i++){
        
        const span = this.renderer.createElement('span');
        this.renderer.addClass(span, 'temp'+e);
        this.renderer.setStyle(
          span, 
          'color', 'grey');
        const questionMark = this.renderer.createText('?');
        this.renderer.appendChild(span, questionMark);
        this.renderer.appendChild(this.el.nativeElement, span);
        
      }
    }
  }

  undefinedToAsterisk(numberOfRows: number){
    console.log("undefinedToAsterisk()");
    //this.melodyCopy = this.melody;
    for(let i = 0; i < this.melody.length; i++){
      for(let e = 0; e <= numberOfRows; e++){
        if(this.melody[i].notes[e] === undefined){
          this.melody[i].notes[e] = new Note();
          this.melody[i].notes[e].pitch = '*';
        }

        if(numberOfRows === 2 && this.melody[i].notes[e] === undefined){
          this.melody[i].notes[e+1] = new Note();
          this.melody[i].notes[e+1].pitch = '*';
        }

      }
    }
    //console.log(this.melody);
  }

  makeBeatNotes(){
    console.log("makeBeatNotes()");

    const notesList = this.notesLinkedList.toArray();
    let notes: Note[] = [];
    
    let i = 0;
    let note: Note;
    while(i < this.simulNotes){
      note = new Note();
      note.pitch = notesList[Math.floor(Math.random() * notesList.length)];
      note.octave = this.getOctave();
      /* need to add more properties of a note */
      notes[i] = note;
      i++;
    }
    
    return notes;
  }

  async play(){
    //console.log(this.melody);
    console.log("play()");

    this.index = 0;
    let i: number;
    let melody = this.melody;
    console.log(this.melody);
    this.timeInterval = this.melody[this.index].duration;

    for(i = 0; i < this.melody.length; i++){
      this.chordDelegator(melody[i]);
      await this.sleeper(melody[i].duration*1000);
    }
  }

  chordDelegator(melody: Beat){
    console.log("chordDelegator()");

    let pitch: string[] = [];
    let octave: number[] = [];
    switch(melody.notes.length){
      case 2:
        pitch[0] = melody.notes[0].pitch;
        pitch[1] = melody.notes[1].pitch;
        octave[0] = melody.notes[0].octave;
        octave[1] = melody.notes[1].octave;
        this.diadloadHandler(pitch[0]+octave[0], pitch[1]+octave[1]);
        break;
      case 3:
        pitch[0] = melody.notes[0].pitch;
        pitch[1] = melody.notes[1].pitch;
        pitch[2] = melody.notes[2].pitch;
        octave[0] = melody.notes[0].octave;
        octave[1] = melody.notes[1].octave;
        octave[2] = melody.notes[2].octave;
        this.triadloadHandler(pitch[0]+octave[0], pitch[1]+octave[1], pitch[2]+octave[2]);
        break;
      default:
        //console.log("heyo");
        pitch[0] = melody.notes[0].pitch;
        octave[0] = melody.notes[0].octave;
        this.loadHandler(pitch[0]+octave[0]);
        break;
    }
  }

  sleeper(milliseconds: number){
    console.log("sleeper()");

    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  mixNotes(two: string){
    console.log("mixNotes()");

    two ? this.addSecondNote() : this.addTwoMoreNotes();
  }

  addTwoMoreNotes(){
    console.log("addTwoMoreNotes()");

    if(this.addNotes === false){

      return;
    }
    const notesList = this.notesLinkedList.toArray();
    let beatToChange: number;
    let note: Note;
    //let secondNote: Note;
    let cap = this.melody.length;
    let indexesToChange = Math.floor(Math.random() * cap);
    for(let i = 0; i < indexesToChange; i++){
      beatToChange = Math.floor(Math.random() * cap);
      note = new Note();
      note.pitch = notesList[Math.floor(Math.random() * notesList.length)];
      note.octave = this.getOctave();
      this.melody[beatToChange].notes[1] = note;
      note = new Note();
      note.pitch = notesList[Math.floor(Math.random() * notesList.length)];
      note.octave = this.getOctave();
      this.melody[beatToChange].notes[2] = note;
    }

    this.addToResponseFields(2);
    this.undefinedToAsterisk(2);
    this.rows = 3;
    this.addNotes = false;
    //console.log(this.melody);
    this.buttonMode === 'Relative' ? this.getNumberAnswer(2) : this.getAnswer(2);
  }

  addSecondNote(){
    if(this.addNotes === false){

      return;
    }
    console.log("addSecondNote()");
    const notesList = this.notesLinkedList.toArray();
    let beatToChange: number;
    let note: Note;
    let arrayForMatrix: Beat[];
    
    let cap = this.melody.length;
    let indexesToChange = Math.floor(Math.random() * cap);
    for(let i = 0; i < indexesToChange; i++){
      beatToChange = Math.floor(Math.random() * cap);
      note = new Note();
      note.pitch = notesList[Math.floor(Math.random() * notesList.length)];
      note.octave = this.getOctave();
      this.melody[beatToChange].notes[1] = note; 
    }

    this.addToResponseFields(1);
    this.undefinedToAsterisk(1);
    this.rows = 2;
    this.addNotes = false;
    this.buttonMode === 'Relative' ? this.getNumberAnswer(1) : this.getAnswer(1);
  }

  mixRhythm(){
    console.log("mixRhythm()");

    //this.melody;
    //this.durations;
    for(let i = 0; i < this.melody.length; i++){
      this.melody[i].duration = this.durations[Math.floor(Math.random() * this.durations.length)];
    }
  }  
}
