class App {
  	constructor() {
        console.log('App');
        this.showdiary=this.showdiary.bind(this);
        const url=window.location.pathname;
        const ids=url.split('/');
        if ( ids.length > 2 && ids[1] === "id" ){
            id=ids[2];
            this.diary=new Diary(id);  
        }
        else{
            this.menu= new menu(this.showdiary);
        }      
  	}
    showdiary(ID,date,text){
        const home=document.querySelector('#menu');
        home.classList.add('inactive');
        document.querySelector("#diary").classList.remove('inactive');
        const diary= new Diary(ID,date,text);
    }
}
