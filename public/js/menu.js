class menu {
  	constructor(diary) {
      this.onclick=this.onclick.bind(this);
      this.diary=diary;
    	console.log('Menu'); 
      const button=document.querySelector("#menubutton");
      button.addEventListener("click",this.onclick);
    }
    async onclick(){
        console.log('Menu : onclick');
        event.preventDefault();
        let today =new Date();
        today.setDate(today.getDate());
        const option = { year:'numeric',month: 'numeric', day: 'numeric' };
        let date = today.toLocaleDateString('en-US', option);
        const option2 = {month: 'long', day: 'numeric' };
        let date2 = today.toLocaleDateString('en-US', option2);
        const token=date.split("/");
        if(token[0]<10) token[0]="0"+token[0];
        const ID=token[2]+token[0]+token[1];
        const result = await fetch('/api/'+ID,{ method : 'GET' , 
          headers :{          'Accept': 'application/json',
                        'Content-Type': 'application/json'}}); 
        const json = await result.json();
        if(json.text!==undefined){
            document.querySelector("#textarea").value=json.text;
            document.querySelector("#subdiary").innerText=json.text;
        }
        else{
            document.querySelector("#textarea").value="";
            document.querySelector("#subdiary").innerText="";
        }
        document.querySelector(".date").innerText=date2;
        this.diary(ID,date2,json);
    }
}
