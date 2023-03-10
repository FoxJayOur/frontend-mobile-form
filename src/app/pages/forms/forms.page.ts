import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.page.html',
  styleUrls: ['./forms.page.scss'],
})
export class FormsPage implements OnInit {

  title: string = ""
  wtitle: string = ""
  TTitle: string = ""
  bodyTrial: string = ""
  question: string = ""
  comment: string = ""

  data = {
    questions: [
      {
        question: "",
        comments: [
          {
            comment: "",
          }
        ]
      }
    ]
  }

  myForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.myForm = this.fb.group({
      title: [''],
      questions: this.fb.array([])
    })
  }

  onSubmit() {
    alert(this.myForm.value);
  }

  viewForms() {
    this.http.get('http://localhost:8080/api/formanaAuth/ListOfForms')
    .subscribe(req =>{
      localStorage.getItem('data')
      console.log(req)
    }, error =>{
       console.log(error)
    })
  }

  findTitle() {
    let titleCreds = {
      wtitle: this.wtitle
    }

    this.http.post('http://localhost:8080/api/formanaAuth/title', titleCreds)
    .subscribe(res => {
      localStorage.setItem('data', JSON.stringify(res))
      console.log(res)
      this.TTitle = this.wtitle
      this.bodyTrial = JSON.stringify(res)
      this.data = JSON.parse(this.bodyTrial)
      console.log(this.data.questions[0].question)
    }, error => {
       console.log(error)
    })
    return this.TTitle
  }
  viewTitle(): string {

    this.http.get('http://localhost:8080/api/formanaAuth/title')
    .subscribe(req =>{
      localStorage.getItem('data')
      this.title = req.toString()
      console.log(this.title)
    }, error =>{
       console.log(error)
       console.log("oo nag error")
    })
    return this.title
  }
  myGeeks() {
    this.findTitle()
    document.getElementById('GFG')!.innerHTML
        = this.TTitle;
    this.setQuestions()
  }

  addNewQuestion() {
    let control = <FormArray>this.myForm.controls.questions;
    control.push(
      this.fb.group({
        question: [''],
        comments: this.fb.array([])
      })
    )
  }

  deleteQuestion(index) {
    let control = <FormArray>this.myForm.controls.questions;
    control.removeAt(index)
  }

  addNewComment(control) {
    control.push(
      this.fb.group({
        comment: ['']
      }))
  }

  deleteComment(control, index) {
    control.removeAt(index)
  }

  setQuestions() {
    let control = <FormArray>this.myForm.controls.questions;
    this.data.questions.forEach(x => {
      control.push(this.fb.group({ 
        question: x.question,
        comments: this.setComments(x) }))
    })
  }

  setQuestions2() {
    let creds3 = {
      TTitle: this.TTitle
    }

    this.http.post('http://localhost:8080/api/formanaAuth/title', creds3)
    .subscribe(res => {
      localStorage.setItem('data', JSON.stringify(res))
      console.log(res)
      return this.TTitle
    }, error => {
       console.log(error)
    })
    let control = <FormArray>this.myForm.controls.questions;
    this.data.questions.forEach(x => {
      control.push(this.fb.group({ 
        question: x.question, 
        comments: this.setComments(x) }))
    })
  }

  setComments(x: any) {
    let arr = new FormArray([])
    x.comments.forEach(y => {
      arr.push(this.fb.group({ 
        comment: y.comment 
      }))
    })
    return arr;
  }

  ngOnInit() {
  }

  continue() {
    /*
    for (let i = 0; i < this.data.questions.length; i++) {
      for (let p = 0; i < this.data.questions[i].comments.length; i++) {
      document.getElementById('questionLbl').innerHTML
          = this.data.questions[i].question;
      document.getElementById('commentLbl').innerHTML
          = this.data.questions[i].comments[0].comment;
      document.getElementById('comments"{{p*2}}"').setAttribute('type', 
      this.data.questions[i].comments[p*2].comment);

      document.getElementById('comments"{{p*2+1}}"').setAttribute('value', 
      this.data.questions[i].comments[p*2+1].comment);
      }
    }
    */
  }

  pass(){
    console.log(this.myForm.value)
    const userData = this.myForm.value
    this.http.post('http://192.168.1.9:8080/api/formanaAuth/answer', userData)
    .subscribe(res =>{
      localStorage.setItem('data', JSON.stringify(res))
      this.router.navigateByUrl('/forms', {replaceUrl: true})
      console.log(res)
    }, error =>{
      console.log(error)
    })

  }


}
